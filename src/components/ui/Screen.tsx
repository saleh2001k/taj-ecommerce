/**
 * Screen — themed page container.
 *
 *  - background from the active theme
 *  - safe-area padding via Unistyles runtime insets (no extra provider reads)
 *  - responsive: content is centered and width-capped on tablets / desktop so
 *    lines don't stretch edge-to-edge on large screens
 *  - optional scrolling
 */
import type { PropsWithChildren, ReactNode } from 'react';
import { Platform, ScrollView, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// On web, a root-Stack screen container is auto-height, so a plain `flex: 1`
// Screen collapses to 0 and its content is clipped (the tab screens escape this
// only because the website layout wraps them in a viewport-height box). Giving
// the Screen an explicit viewport height fixes every screen the same way; native
// keeps `flex: 1`, which is correct there.
const IS_WEB = Platform.OS === 'web';

type Insets = 'all' | 'bottom' | 'top' | 'none';

export type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
  /** Which safe-area edges to pad. Default 'bottom' (headers handle top). */
  insets?: Insets;
  /**
   * Fixed chrome above the (scrolling) content — an `AppHeader`. Rendered
   * inside the screen's definite-height root so the content area below it
   * scrolls independently on every platform.
   */
  header?: ReactNode;
  /**
   * Web only: this screen sits under the website top nav (i.e. it is a tab
   * page). The nav has a FIXED height (`layout.webNavHeight`), and the screen
   * must subtract it — sizing to the full viewport pushed the last rows below
   * the fold with no way to scroll to them.
   */
  underWebNav?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  style?: ViewStyle;
}>;

const styles = StyleSheet.create((theme, rt) => ({
  content: (padded: boolean, insets: Insets, grow: boolean) => ({
    [grow ? 'flexGrow' : 'flex']: 1,
    alignSelf: 'center',
    // Cap width and center on large screens; full-bleed on phones.
    maxWidth: { xs: '100%', lg: theme.layout.contentMaxWidth },
    paddingBottom:
      insets === 'all' || insets === 'bottom'
        ? rt.insets.bottom + theme.spacing.md
        : theme.spacing.none,
    paddingHorizontal: padded ? theme.spacing.lg : theme.spacing.none,
    paddingTop:
      insets === 'all' || insets === 'top' ? rt.insets.top + theme.spacing.md : theme.spacing.none,
    width: '100%',
  }),
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  // A NUMERIC height on purpose. The router's web containers are auto-height
  // (percentages die there, and native-stack ignores contentStyle on web), so
  // the screen sizes itself from the viewport — minus the website nav when it
  // sits under one, or its last rows land below the fold, unreachable.
  rootWeb: (underWebNav: boolean) => ({
    backgroundColor: theme.colors.background,
    height: rt.screen.height - (underWebNav ? theme.layout.webNavHeight + rt.insets.top : 0),
  }),
}));

export function Screen({
  children,
  scroll = false,
  padded = true,
  insets = 'bottom',
  header,
  underWebNav = false,
  contentContainerStyle,
  style,
}: ScreenProps) {
  const rootStyle = IS_WEB ? styles.rootWeb(underWebNav) : styles.root;

  if (scroll) {
    const scroller = (
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.content(padded, insets, true), contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
    // On web the ScrollView won't take a height directly (its outer element
    // stays flex-collapsed), so wrap it in a plain View that DOES — the same
    // definite-height trick the website layout uses. The ScrollView then fills
    // that box and scrolls internally, instead of clipping its content to 0.
    // A header also forces the wrapper (fixed chrome above scrolling content).
    if (IS_WEB || header) {
      return (
        <View style={[rootStyle, style]}>
          {header}
          {scroller}
        </View>
      );
    }
    return scroller;
  }

  if (header) {
    return (
      <View style={[rootStyle, style]}>
        {header}
        <View style={styles.content(padded, insets, false)}>{children}</View>
      </View>
    );
  }
  return <View style={[rootStyle, styles.content(padded, insets, false), style]}>{children}</View>;
}
