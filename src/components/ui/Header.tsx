/**
 * App chrome headers — replaces the native stack header on EVERY platform, so
 * iOS, Android and web all get the same designed chrome.
 *
 *  - `AppHeader`: navigation chrome for pushed screens and modals. `solid`
 *    draws a surface bar with a hairline rule and a centered, letter-spaced
 *    title (garment care-label typography); `overlay` floats frosted circular
 *    buttons over full-bleed imagery (product hero) with no bar at all.
 *  - `ScreenHeader`: the in-content editorial title block used by tab screens
 *    (eyebrow wordmark → big title → hairline rule). It scrolls away with the
 *    content — the native tab bar has no header, and that is the design.
 *
 * No `useAppTheme()` here: colours come from the single `StyleSheet.create`,
 * icons are tinted through `withUnistyles` (tintColor is a prop, not a style).
 * The only subscription is the language (for mirroring the back arrow under
 * RTL) — a language change re-renders every string anyway.
 */
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Platform, View, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import { useSettings } from '@/store/settings';
import { isRTL } from '@/theme';
import { iconSizes } from '@/theme/tokens';
import { Pressable } from './button';
import { H1, Label, Overline } from './text';
import type { TxKey } from './text/tx';

const UniSymbolView = withUnistyles(SymbolView);

/** Diameter of the circular chrome buttons. */
const CHROME_BUTTON = 40;

type HeaderVariant = 'solid' | 'overlay';

type HeaderTitle =
  /** Translated title (static screens). */
  | { titleTx: TxKey; title?: never }
  /** Raw title (data — a product name). */
  | { titleTx?: never; title: string }
  /** No title (overlay chrome over imagery). */
  | { titleTx?: never; title?: never };

export type AppHeaderProps = {
  variant?: HeaderVariant;
  /** Show an X instead of the back chevron (modals). */
  close?: boolean;
  /** Pad for the status bar. Turn off inside modal sheets. */
  topInset?: boolean;
  /** Optional action pinned to the trailing edge. */
  right?: ReactNode;
} & HeaderTitle;

/** Back if there is history, otherwise land on home (deep links, not-found). */
function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

export function AppHeader({
  variant = 'solid',
  close = false,
  topInset = true,
  right,
  titleTx,
  title,
}: AppHeaderProps) {
  // SF Symbols' chevron.backward is direction-aware natively; the Material
  // arrow on Android/web is not, so mirror it by hand under RTL.
  const language = useSettings(s => s.language);
  const mirrored = isRTL(language) && Platform.OS !== 'ios';
  const overlay = variant === 'overlay';

  return (
    <View style={styles.bar(variant, topInset)}>
      <Pressable
        onPress={goBack}
        accessibilityLabel={close ? 'close' : 'back'}
        style={styles.chromeButton(variant)}
      >
        <UniSymbolView
          name={
            close
              ? { ios: 'xmark', android: 'close', web: 'close' }
              : { ios: 'chevron.backward', android: 'arrow_back', web: 'arrow_back' }
          }
          size={iconSizes.md}
          uniProps={theme => ({
            tintColor: overlay ? theme.colors.onOverlay : theme.colors.text,
          })}
          style={!close && mirrored ? styles.mirrored : undefined}
        />
      </Pressable>

      <View style={styles.titleBox}>
        {titleTx ? (
          <Label tx={titleTx} align="center" numberOfLines={1} style={styles.title} />
        ) : title ? (
          <Label align="center" numberOfLines={1} style={styles.title}>
            {title}
          </Label>
        ) : null}
      </View>

      {/* Trailing box mirrors the leading button's width so the title stays
          truly centered even when there is no right action. */}
      <View style={styles.rightBox}>{right}</View>
    </View>
  );
}

export type ScreenHeaderProps = {
  titleTx: TxKey;
  /** Eyebrow above the title — defaults to the brand wordmark. */
  eyebrowTx?: TxKey;
  /** Pad for the status bar (native tab screens have no chrome above them). */
  topInset?: boolean;
  /** Extra content between the title and the rule (a count, an intro line). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function ScreenHeader({
  titleTx,
  eyebrowTx = 'nav.brand',
  topInset = true,
  children,
  style,
}: ScreenHeaderProps) {
  return (
    <View style={[styles.screenHeader(topInset), style]}>
      <Overline tx={eyebrowTx} color="textMuted" style={styles.eyebrow} />
      <H1 tx={titleTx} />
      {children}
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  bar: (variant: HeaderVariant, topInset: boolean) => ({
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: (topInset ? rt.insets.top : 0) + theme.spacing.sm,
    ...(variant === 'solid'
      ? {
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: theme.borderWidths.thin,
        }
      : {
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: theme.zIndex.sticky,
        }),
  }),
  chromeButton: (variant: HeaderVariant) => ({
    alignItems: 'center',
    borderRadius: theme.radius.pill,
    height: CHROME_BUTTON,
    justifyContent: 'center',
    width: CHROME_BUTTON,
    ...(variant === 'solid'
      ? {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          borderWidth: theme.borderWidths.thin,
        }
      : {
          // Frosted circle that reads on any photograph.
          backgroundColor: theme.colors.overlay,
        }),
  }),
  eyebrow: {
    letterSpacing: theme.typography.letterSpacing.wider,
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  rightBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: CHROME_BUTTON,
  },
  rule: {
    backgroundColor: theme.colors.border,
    height: theme.borderWidths.thin,
    marginTop: theme.spacing.lg,
  },
  screenHeader: (topInset: boolean) => ({
    gap: theme.spacing.xs,
    paddingTop: (topInset ? rt.insets.top : 0) + theme.spacing.lg,
  }),
  title: {
    letterSpacing: theme.typography.letterSpacing.wider,
    textTransform: 'uppercase',
  },
  titleBox: {
    flex: 1,
  },
}));
