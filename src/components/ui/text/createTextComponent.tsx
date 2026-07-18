/**
 * Internal factory behind every text primitive (H1, P, Caption…).
 *
 * ── Why a factory, when the components are separate? ──
 * The typography RULES (zero-slack reset, tx resolution, RTL-safe alignment)
 * must be identical everywhere; only the size/weight/color differ. The factory
 * holds the rules once and stamps out genuinely distinct components — callers
 * still write `<H1 />`, never `<Text variant="h1" />`.
 *
 * ── Why this never re-renders on theme change ──
 * Two things are required, and BOTH matter:
 *
 * 1. Nothing here reads the theme from React. There is no `useUnistyles()` /
 *    `useAppTheme()` — those subscribe the component to theme updates and, per
 *    the Unistyles docs, "lose all the benefits of ShadowTree updates". The
 *    single `StyleSheet.create` below declares the theme dependency at compile
 *    time (the babel plugin extracts it), so when the brand / scheme / font /
 *    radius changes, Unistyles recomputes and pushes the new style straight onto
 *    the shadow node from C++.
 *
 * 2. `memo`. Point 1 alone is NOT enough, because a theme change in this app
 *    starts as a settings-store change: the screen holding the picker is
 *    subscribed to that store, re-renders, and would drag every piece of text
 *    under it along for the ride — 27 of them, measured. The props here are all
 *    primitives (`tx`, `color`, `align`, `fontFamily`), so a shallow compare
 *    stops that cascade dead.
 *
 * What DOES still re-render, correctly: text whose props genuinely changed (a
 * chip label that just became selected), text with a fresh `txOptions` object,
 * and every string on a LANGUAGE change — `useTx` subscribes to i18next, which
 * memo cannot (and must not) block.
 */
import { memo, type ReactNode } from 'react';
import { Platform, Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { AppTheme } from '@/theme';
import type { FontSizeToken, FontWeightToken } from '@/theme/tokens';

import { useTx, type TxKey, type TxOptions } from './tx';

export type TextColorToken = keyof AppTheme['colors'];
export type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';

/**
 * Native only mirrors text whose style SETS textAlign, and there `'left'` is
 * start-relative (left in LTR, right under RTL) so it follows a runtime
 * direction flip. On web `'left'` is physical, while `'auto'` maps to CSS
 * `start` and follows the document `dir`.
 */
const DEFAULT_ALIGN: TextAlign = Platform.OS === 'web' ? 'auto' : 'left';

const styles = StyleSheet.create(theme => ({
  text: (
    size: FontSizeToken,
    weight: FontWeightToken,
    color: TextColorToken,
    align: TextAlign,
    fontFamily: string | undefined,
  ) => ({
    color: theme.colors[color],
    fontFamily: fontFamily ?? theme.typography.family[weight],
    fontSize: theme.typography.sizes[size],
    // Android draws extra padding derived from the font's own ascent/descent
    // metrics. It is the single biggest source of "why is there a gap above my
    // text", it differs per font, and it is exactly what the design asks to lose.
    includeFontPadding: false,
    // Always explicit — an unset lineHeight lets each font impose its own
    // leading, so the same box would breathe differently per typeface. The
    // ratio is DERIVED from the bundled fonts' real metrics (see
    // LINE_HEIGHT_RATIO); it must never drop below the tallest face's line box
    // or the leading goes negative and glyphs are clipped out of it.
    lineHeight: theme.typography.lineHeights[size],
    margin: 0,
    padding: 0,
    textAlign: align,
    // Android: without this the glyphs sit on the baseline of the (now unpadded)
    // box and drift within their line box.
    textAlignVertical: 'center' as const,
  }),
}));

type ContentProps =
  /** App copy: always comes from the locale files. */
  | { tx: TxKey; txOptions?: TxOptions; children?: never }
  /**
   * Raw content: for values that are NOT translatable copy — token identifiers,
   * user data, numbers. Keeps hardcoded English out of JSX by making the
   * non-translated path something you have to opt into.
   */
  | { tx?: never; txOptions?: never; children: ReactNode };

export type TextProps = Omit<RNTextProps, 'children'> & {
  color?: TextColorToken;
  align?: TextAlign;
  /**
   * Escape hatch: render in a specific typeface regardless of the active font.
   * Only for previewing fonts in the picker — app text must inherit the theme.
   */
  fontFamily?: string;
} & ContentProps;

type TextPreset = {
  size: FontSizeToken;
  weight: FontWeightToken;
  color: TextColorToken;
  /** Headings announce themselves to screen readers. */
  isHeading?: boolean;
};

export function createTextComponent(displayName: string, preset: TextPreset) {
  function TextComponent({
    tx,
    txOptions,
    children,
    color = preset.color,
    align = DEFAULT_ALIGN,
    fontFamily,
    style,
    ...rest
  }: TextProps) {
    const translated = useTx(tx, txOptions);

    return (
      <RNText
        accessibilityRole={preset.isHeading ? 'header' : undefined}
        style={[styles.text(preset.size, preset.weight, color, align, fontFamily), style]}
        {...rest}
      >
        {translated ?? children}
      </RNText>
    );
  }

  TextComponent.displayName = displayName;

  // See point 2 in the header: without this, every theme change re-renders all
  // text under whichever screen owns the picker (measured: 2 with, 27 without).
  // React Compiler would make this redundant, but it isn't enabled — see the
  // react-compiler-no-manual-memoization note in eslint.config.cjs.
  const Memoized = memo(TextComponent);
  Memoized.displayName = displayName;
  return Memoized;
}
