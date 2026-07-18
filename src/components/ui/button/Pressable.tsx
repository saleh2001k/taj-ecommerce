/**
 * Pressable — a TouchableOpacity-style wrapper for arbitrary content (a Card, a
 * list row, a tile). Dims on press instead of showing a button surface, so it
 * works on top of anything.
 *
 * Same guarantees as the buttons: the opacity/hover animation runs on Reanimated
 * shared values (UI thread, no re-render), the component is `memo`'d so a theme
 * change never re-renders it, and `onPress` is wrapped in the multi-click guard.
 * No ripple.
 */
import { memo, type ReactNode } from 'react';
import {
  Pressable as RNPressable,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { usePressAnimation } from './usePressAnimation';
import { useSafePress } from './useSafePress';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export type PressableProps = {
  children: ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  /** Opacity at full press (TouchableOpacity's activeOpacity). */
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
};

const DEFAULT_ACTIVE_OPACITY = 0.6;
const HOVER_OPACITY = 0.9;

export const Pressable = memo(function Pressable({
  children,
  onPress,
  disabled = false,
  activeOpacity = DEFAULT_ACTIVE_OPACITY,
  style,
  accessibilityLabel,
  testID,
}: PressableProps) {
  const { pressed, hovered, handlers } = usePressAnimation();
  const safePress = useSafePress(onPress);

  const animatedStyle = useAnimatedStyle(() => ({
    // Press wins over hover; both only ever reduce opacity.
    opacity:
      1 -
      pressed.value * (1 - activeOpacity) -
      hovered.value * (1 - HOVER_OPACITY) * (1 - pressed.value),
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : safePress}
      onPressIn={handlers.onPressIn}
      onPressOut={handlers.onPressOut}
      onHoverIn={handlers.onHoverIn}
      onHoverOut={handlers.onHoverOut}
      testID={testID}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
});

Pressable.displayName = 'Pressable';
