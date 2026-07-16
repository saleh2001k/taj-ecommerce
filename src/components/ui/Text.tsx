/**
 * Themed Text — the ONLY text primitive the app should use.
 *
 * Pulls font family (the user's chosen typeface, per weight), size, line-height
 * and color from the active theme via a Unistyles dynamic function, so it reacts
 * to brand / light-dark / font changes with zero hardcoded values.
 */
import { Platform, Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import type { AppTheme } from '@/theme';
import type { FontSizeToken, FontWeightToken } from '@/theme/tokens';

type ColorToken = keyof AppTheme['colors'];
type Align = 'auto' | 'left' | 'right' | 'center' | 'justify';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'label'
  | 'button';

const VARIANTS: Record<TextVariant, { size: FontSizeToken; weight: FontWeightToken }> = {
  display: { size: 'display', weight: 'bold' },
  h1: { size: 'xxxl', weight: 'bold' },
  h2: { size: 'xxl', weight: 'bold' },
  h3: { size: 'xl', weight: 'semibold' },
  title: { size: 'lg', weight: 'semibold' },
  body: { size: 'md', weight: 'regular' },
  bodyBold: { size: 'md', weight: 'semibold' },
  caption: { size: 'sm', weight: 'regular' },
  label: { size: 'sm', weight: 'medium' },
  button: { size: 'md', weight: 'semibold' },
};

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  size?: FontSizeToken;
  weight?: FontWeightToken;
  color?: ColorToken;
  align?: Align;
};

// Native only mirrors text whose style SETS textAlign — and 'left' is
// start-relative there (left in LTR, right under RTL), so it flips with a
// runtime direction change. On web 'left' is physical; 'auto' resolves to
// CSS `start`, which follows the document `dir`.
const DEFAULT_ALIGN: Align = Platform.OS === 'web' ? 'auto' : 'left';

const styles = StyleSheet.create((theme) => ({
  text: (size: FontSizeToken, weight: FontWeightToken, color: ColorToken, align: Align) => ({
    color: theme.colors[color],
    fontFamily: theme.typography.family[weight],
    fontSize: theme.typography.sizes[size],
    lineHeight: theme.typography.lineHeights[size],
    textAlign: align,
  }),
}));

export function Text({
  variant = 'body',
  size,
  weight,
  color = 'text',
  align = DEFAULT_ALIGN,
  style,
  ...rest
}: TextProps) {
  const preset = VARIANTS[variant];
  return (
    <RNText
      style={[styles.text(size ?? preset.size, weight ?? preset.weight, color, align), style]}
      {...rest}
    />
  );
}
