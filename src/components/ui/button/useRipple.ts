/**
 * Touch-point ripple, driven entirely on the UI thread.
 *
 * Same contract as `usePressAnimation`: shared values only, zero React state,
 * so a press never re-renders the button. The ripple is a fixed-size circle
 * that the consumer translates to the touch point and scales until it floods
 * the button (the target scale is computed in the consumer's worklet from the
 * layout size captured here).
 *
 * Works identically on iOS, Android and web — unlike `android_ripple`, which
 * is Android-only and can't be themed per variant.
 */
import { useMemo, useRef } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import { durations } from '@/theme/tokens';

/** Base diameter of the ripple element; the animation scales it up from here. */
export const RIPPLE_SIZE = 100;

export type Ripple = {
  /** Touch point, in the pressable's own coordinates. */
  x: SharedValue<number>;
  y: SharedValue<number>;
  /** 0→1 expansion progress. */
  progress: SharedValue<number>;
  /** Fades out on release, independent of the expansion. */
  opacity: SharedValue<number>;
  /** Pressable's laid-out size — needed to know how far the ripple must flood. */
  width: SharedValue<number>;
  height: SharedValue<number>;
  onLayout: (e: LayoutChangeEvent) => void;
  /** Call from onPressIn with the gesture event. */
  start: (e: GestureResponderEvent) => void;
  /** Call from onPressOut — lets the wave finish while it fades. */
  release: () => void;
};

export function useRipple(): Ripple {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  // Stable identity (like usePressAnimation's handlers) so memo'd buttons
  // never re-render because of the ripple. Shared values are stable refs, so
  // the closure can be built once.
  const rippleRef = useRef<Pick<Ripple, 'onLayout' | 'start' | 'release'> | null>(null);
  if (rippleRef.current === null) {
    rippleRef.current = {
      onLayout: (e: LayoutChangeEvent) => {
        width.value = e.nativeEvent.layout.width;
        height.value = e.nativeEvent.layout.height;
      },
      start: (e: GestureResponderEvent) => {
        // RNW can omit locationX/Y for some pointer events — fall back to center.
        x.value = e.nativeEvent?.locationX ?? width.value / 2;
        y.value = e.nativeEvent?.locationY ?? height.value / 2;
        progress.value = 0;
        opacity.value = 1;
        progress.value = withTiming(1, { duration: durations.slow });
      },
      release: () => {
        opacity.value = withTiming(0, { duration: durations.slow });
      },
    };
  }

  return useMemo(
    () => ({ x, y, progress, opacity, width, height, ...rippleRef.current! }),
    [x, y, progress, opacity, width, height],
  );
}
