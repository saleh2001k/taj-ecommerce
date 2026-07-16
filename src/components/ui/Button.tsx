/**
 * Button — themed pressable. Variants map to semantic colors; radius follows the
 * brand shape; sizes/spacing come from tokens. No hardcoded values.
 */
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text as RNText,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: ViewStyle;
};

const styles = StyleSheet.create((theme) => ({
  base: (variant: ButtonVariant, size: ButtonSize, fullWidth: boolean, disabled: boolean) => {
    const pad = {
      sm: { pv: theme.spacing.sm, ph: theme.spacing.md },
      md: { pv: theme.spacing.md, ph: theme.spacing.lg },
      lg: { pv: theme.spacing.lg, ph: theme.spacing.xl },
    }[size];

    const surface: Record<ButtonVariant, { bg: string; border: string }> = {
      primary: { bg: theme.colors.primary, border: theme.colors.primary },
      secondary: { bg: theme.colors.secondary, border: theme.colors.secondary },
      accent: { bg: theme.colors.accent, border: theme.colors.accent },
      danger: { bg: theme.colors.danger, border: theme.colors.danger },
      outline: { bg: 'transparent', border: theme.colors.border },
      ghost: { bg: 'transparent', border: 'transparent' },
    };

    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      paddingVertical: pad.pv,
      paddingHorizontal: pad.ph,
      borderRadius: theme.radius.md,
      borderWidth: theme.borderWidths.thin,
      backgroundColor: surface[variant].bg,
      borderColor: surface[variant].border,
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      opacity: disabled ? theme.opacity.disabled : theme.opacity.full,
    };
  },
  label: (variant: ButtonVariant, size: ButtonSize) => {
    const color: Record<ButtonVariant, string> = {
      primary: theme.colors.onPrimary,
      secondary: theme.colors.onSecondary,
      accent: theme.colors.onAccent,
      danger: theme.colors.onDanger,
      outline: theme.colors.text,
      ghost: theme.colors.primary,
    };
    const fontSize = {
      sm: theme.typography.sizes.sm,
      md: theme.typography.sizes.md,
      lg: theme.typography.sizes.lg,
    }[size];
    return {
      color: color[variant],
      fontFamily: theme.typography.family.semibold,
      fontSize,
    };
  },
  pressed: {
    opacity: theme.opacity.pressed,
  },
}));

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const labelStyle = styles.label(variant, size);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base(variant, size, fullWidth, isDisabled),
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={labelStyle.color} />
      ) : (
        <>
          {leftIcon}
          <RNText style={labelStyle}>{title}</RNText>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
}
