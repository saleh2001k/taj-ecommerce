/**
 * Screen — themed page container.
 *
 *  - background from the active theme
 *  - safe-area padding via Unistyles runtime insets (no extra provider reads)
 *  - responsive: content is centered and width-capped on tablets / desktop so
 *    lines don't stretch edge-to-edge on large screens
 *  - optional scrolling
 */
import type { PropsWithChildren } from 'react';
import { ScrollView, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Insets = 'all' | 'bottom' | 'top' | 'none';

export type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  padded?: boolean;
  /** Which safe-area edges to pad. Default 'bottom' (nav headers handle top). */
  insets?: Insets;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  style?: ViewStyle;
}>;

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: (padded: boolean, insets: Insets, grow: boolean) => ({
    [grow ? 'flexGrow' : 'flex']: 1,
    width: '100%',
    alignSelf: 'center',
    // Cap width and center on large screens; full-bleed on phones.
    maxWidth: { xs: '100%', lg: theme.layout.contentMaxWidth },
    paddingHorizontal: padded ? theme.spacing.lg : theme.spacing.none,
    paddingTop:
      insets === 'all' || insets === 'top' ? rt.insets.top + theme.spacing.md : theme.spacing.none,
    paddingBottom:
      insets === 'all' || insets === 'bottom'
        ? rt.insets.bottom + theme.spacing.md
        : theme.spacing.none,
  }),
}));

export function Screen({
  children,
  scroll = false,
  padded = true,
  insets = 'bottom',
  contentContainerStyle,
  style,
}: ScreenProps) {
  if (scroll) {
    return (
      <ScrollView
        style={[styles.root, style]}
        contentContainerStyle={[styles.content(padded, insets, true), contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.root, styles.content(padded, insets, false), style]}>{children}</View>;
}
