/**
 * Factory behind every button variant (PrimaryButton, GhostButton, …).
 *
 * Mirrors the text factory: one memoized component per variant, so the call site
 * says what the button IS (`<PrimaryButton />`) instead of configuring a generic
 * one (`<Button variant="primary" />`).
 *
 * ── No re-render on theme change ──
 * No `useAppTheme()` / `useUnistyles()` here. Colours come from the single
 * `StyleSheet.create` below (Unistyles updates them on the shadow node from C++),
 * and each component is wrapped in `memo`, so a theme change re-styles the button
 * without re-rendering it — see the text factory notes for the full reasoning.
 *
 * ── No re-render on press/hover ──
 * All interaction runs on Reanimated shared values (UI thread), never React
 * state: a touch-point ripple that floods the button (both platforms — unlike
 * `android_ripple`), a subtle press scale, and a web hover tint.
 */
import { memo, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import type { AppTheme } from '@/theme';
import { ButtonText } from '../text';
import type { TextColorToken } from '../text';
import type { TxKey, TxOptions } from '../text/tx';
import { usePressAnimation } from './usePressAnimation';
import { useRipple, RIPPLE_SIZE } from './useRipple';
import { useSafePress } from './useSafePress';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ColorToken = keyof AppTheme['colors'];

type VariantPreset = {
  /** Fill; `'transparent'` for outline/ghost. */
  surface: ColorToken | 'transparent';
  /** Border; `'transparent'` for ghost. */
  border: ColorToken | 'transparent';
  /** Label + spinner + ripple + default icon colour. */
  label: TextColorToken;
};

const PRESETS = {
  primary: { surface: 'primary', border: 'primary', label: 'onPrimary' },
  secondary: { surface: 'secondary', border: 'secondary', label: 'onSecondary' },
  accent: { surface: 'accent', border: 'accent', label: 'onAccent' },
  danger: { surface: 'danger', border: 'danger', label: 'onDanger' },
  // Outline draws its frame in the TEXT colour — a border-token frame reads as
  // a disabled field next to the filled variants, not as a button.
  outline: { surface: 'transparent', border: 'text', label: 'text' },
  ghost: { surface: 'transparent', border: 'transparent', label: 'primary' },
} as const satisfies Record<ButtonVariant, VariantPreset>;

export type ButtonProps = {
  /** Button copy — must exist in the locale files. */
  tx: TxKey;
  txOptions?: TxOptions;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  /** Optional extra layout (margins, alignSelf). */
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const styles = StyleSheet.create(theme => ({
  base: (variant: ButtonVariant, size: ButtonSize, fullWidth: boolean, disabled: boolean) => {
    const pad = {
      sm: { pv: theme.spacing.sm, ph: theme.spacing.lg },
      md: { pv: theme.spacing.md, ph: theme.spacing.xl },
      lg: { pv: theme.spacing.lg, ph: theme.spacing.xxl },
    }[size];
    const preset = PRESETS[variant];
    return {
      alignItems: 'center',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      backgroundColor:
        preset.surface === 'transparent' ? 'transparent' : theme.colors[preset.surface],
      borderColor: preset.border === 'transparent' ? 'transparent' : theme.colors[preset.border],
      borderRadius: theme.radius.md,
      borderWidth: theme.borderWidths.thin,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      justifyContent: 'center',
      opacity: disabled ? theme.opacity.disabled : theme.opacity.full,
      // Clip the ripple/hover overlay to the button's rounded corners.
      overflow: 'hidden',
      paddingHorizontal: pad.ph,
      paddingVertical: pad.pv,
    };
  },
  // ActivityIndicator + icons take a raw `color` prop, not a style, so the
  // value is resolved here rather than inside a text component.
  foreground: (variant: ButtonVariant) => ({
    color: theme.colors[PRESETS[variant].label],
  }),
  // Editorial label treatment: caps + tracking (a no-op in Arabic, which has
  // no letter case — the tracking still applies).
  label: {
    letterSpacing: theme.typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  // Web-hover tint, sitting above the fill; its opacity is animated.
  overlay: {
    backgroundColor: theme.colors.overlay,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  // The ripple circle, tinted with the variant's label colour so it reads on
  // any fill (light wave on dark buttons, dark wave on light ones).
  ripple: (variant: ButtonVariant) => ({
    backgroundColor: theme.colors[PRESETS[variant].label],
    borderRadius: RIPPLE_SIZE / 2,
    height: RIPPLE_SIZE,
    left: 0,
    position: 'absolute',
    top: 0,
    width: RIPPLE_SIZE,
  }),
}));

// Press dips the button in while the ripple floods it; web hover lifts a touch.
const PRESS_SCALE = 0.97;
const HOVER_SCALE = 1.02;
const RIPPLE_OPACITY = 0.28;
const HOVER_OVERLAY = 0.12;

export function createButton(displayName: string, variant: ButtonVariant) {
  function ButtonComponent({
    tx,
    txOptions,
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    onPress,
    style,
    testID,
  }: ButtonProps) {
    const isDisabled = disabled || loading;
    const { pressed, hovered, handlers } = usePressAnimation();
    const ripple = useRipple();
    const safePress = useSafePress(onPress);

    const scaleStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: 1 + hovered.value * (HOVER_SCALE - 1) - pressed.value * (1 - PRESS_SCALE) },
      ],
    }));
    const hoverStyle = useAnimatedStyle(() => ({
      opacity: hovered.value * HOVER_OVERLAY,
    }));
    const rippleStyle = useAnimatedStyle(() => {
      // Scale needed for the wave to flood the farthest corner from the touch.
      const reachX = Math.max(ripple.x.value, ripple.width.value - ripple.x.value);
      const reachY = Math.max(ripple.y.value, ripple.height.value - ripple.y.value);
      const floodScale = (Math.sqrt(reachX * reachX + reachY * reachY) * 2) / RIPPLE_SIZE;
      return {
        opacity: ripple.opacity.value * RIPPLE_OPACITY,
        transform: [
          { translateX: ripple.x.value - RIPPLE_SIZE / 2 },
          { translateY: ripple.y.value - RIPPLE_SIZE / 2 },
          { scale: ripple.progress.value * floodScale },
        ],
      };
    });

    const labelColor = styles.foreground(variant).color;

    return (
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onLayout={ripple.onLayout}
        onPress={isDisabled ? undefined : safePress}
        onPressIn={(e: GestureResponderEvent) => {
          ripple.start(e);
          handlers.onPressIn();
        }}
        onPressOut={() => {
          ripple.release();
          handlers.onPressOut();
        }}
        onHoverIn={handlers.onHoverIn}
        onHoverOut={handlers.onHoverOut}
        testID={testID}
        style={[styles.base(variant, size, fullWidth, isDisabled), scaleStyle, style]}
      >
        <Animated.View pointerEvents="none" style={[styles.ripple(variant), rippleStyle]} />
        <Animated.View pointerEvents="none" style={[styles.overlay, hoverStyle]} />
        {loading ? (
          <ActivityIndicator color={labelColor} />
        ) : (
          <>
            {leftIcon}
            <ButtonText
              tx={tx}
              txOptions={txOptions}
              color={PRESETS[variant].label}
              style={styles.label}
            />
            {rightIcon}
          </>
        )}
      </AnimatedPressable>
    );
  }

  ButtonComponent.displayName = displayName;
  const Memoized = memo(ButtonComponent);
  Memoized.displayName = displayName;
  return Memoized;
}
