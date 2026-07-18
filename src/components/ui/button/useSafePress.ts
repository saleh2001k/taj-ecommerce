/**
 * Multi-click guard.
 *
 * Wraps an `onPress` so it can't fire again within a cooldown window — protects
 * against the double-tap that fires a mutation / navigation twice (a duplicate
 * order, a screen pushed twice). The guard is a ref timestamp, so it costs no
 * state and no re-render.
 *
 * Returns `undefined` when there is nothing to call, so `disabled` stays
 * accurate and the Pressable shows no press affordance.
 */
import { useCallback, useRef } from 'react';
import type { GestureResponderEvent } from 'react-native';

/** Default cooldown — long enough to swallow an accidental double-tap. */
export const SAFE_PRESS_COOLDOWN_MS = 600;

export function useSafePress(
  onPress: ((e: GestureResponderEvent) => void) | undefined,
  cooldownMs: number = SAFE_PRESS_COOLDOWN_MS,
): ((e: GestureResponderEvent) => void) | undefined {
  const lastFiredAt = useRef(0);

  const safePress = useCallback(
    (e: GestureResponderEvent) => {
      const now = Date.now();
      if (now - lastFiredAt.current < cooldownMs) return;
      lastFiredAt.current = now;
      onPress?.(e);
    },
    [onPress, cooldownMs],
  );

  return onPress ? safePress : undefined;
}
