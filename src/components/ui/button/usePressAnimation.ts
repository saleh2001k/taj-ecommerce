/**
 * Press / hover animation, driven entirely on the UI thread.
 *
 * Two shared values (`pressed`, `hovered`) are animated by Reanimated worklets,
 * so a press or hover NEVER triggers a React re-render — the same guarantee the
 * text primitives give for theme changes, extended to interaction. Components
 * build their own `useAnimatedStyle` from the returned values.
 *
 * `pressed`/`hovered` go 0→1; the handlers are stable (created once), so a
 * memoized button stays memoized.
 */
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import { durations } from '@/theme/tokens';

export type PressHandlers = {
  onPressIn: () => void;
  onPressOut: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

export type PressAnimation = {
  pressed: SharedValue<number>;
  hovered: SharedValue<number>;
  handlers: PressHandlers;
};

export function usePressAnimation(): PressAnimation {
  const pressed = useSharedValue(0);
  const hovered = useSharedValue(0);

  const handlers = useMemo<PressHandlers>(() => {
    const set = (sv: SharedValue<number>, to: number, ms: number) => {
      sv.value = withTiming(to, { duration: ms });
    };
    return {
      // Press-in snaps fast; release eases back so the button feels responsive.
      onPressIn: () => set(pressed, 1, durations.fast),
      onPressOut: () => set(pressed, 0, durations.normal),
      // Hover is web-only; leave the props undefined elsewhere so RN doesn't warn.
      ...(Platform.OS === 'web'
        ? {
            onHoverIn: () => set(hovered, 1, durations.fast),
            onHoverOut: () => set(hovered, 0, durations.normal),
          }
        : null),
    };
  }, [pressed, hovered]);

  return { pressed, hovered, handlers };
}
