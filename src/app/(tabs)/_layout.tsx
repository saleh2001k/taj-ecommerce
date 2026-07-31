import { BlurTargetView } from 'expo-blur';
import { Link, Slot, Tabs, usePathname } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView, type AndroidSymbol, type SymbolViewProps } from 'expo-symbols';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, useWindowDimensions, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';
import type { SFSymbol } from 'sf-symbols-typescript';

import { H3, Label } from '@/components/ui';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { FloatingTabBar } from '@/navigation/FloatingTabBar';
import { breakpoints } from '@/theme';
import { iconSizes } from '@/theme/tokens';

/**
 * SymbolView colours itself through a `tintColor` PROP, not a style, so
 * Unistyles can't reach it on its own. `withUnistyles` subscribes just this
 * component to the theme: when the theme changes only the icon re-renders,
 * instead of `useAppTheme()` in the layout re-rendering the whole nav (and
 * every piece of text inside it).
 */
const UniSymbolView = withUnistyles(SymbolView);

/**
 * The native tab bar is a real UITabBarController / Material tab bar, so it is
 * configured entirely through PROPS (colours, label style) rather than styles —
 * Unistyles can't reach it either. Same treatment: `withUnistyles` keeps the
 * tab bar themed while re-rendering only itself.
 */
const UniNativeTabs = withUnistyles(NativeTabs, theme => ({
  tintColor: theme.colors.primary,
  backgroundColor: theme.colors.surface,
  iconColor: { default: theme.colors.textMuted, selected: theme.colors.primary },
  labelStyle: {
    default: { color: theme.colors.textMuted, fontFamily: theme.typography.family.medium },
    selected: { color: theme.colors.primary, fontFamily: theme.typography.family.medium },
  },
  rippleColor: theme.colors.primaryMuted,
  indicatorColor: theme.colors.primaryMuted,
}));

type NavItem = {
  /** Route file name inside (tabs) — what NativeTabs.Trigger binds to. */
  name: 'index' | 'shop' | 'components' | 'profile';
  href: '/' | '/shop' | '/components' | '/profile';
  labelKey: 'nav.home' | 'nav.shop' | 'nav.components' | 'nav.profile';
  /** Web nav bar (expo-symbols). */
  icon: SymbolViewProps['name'];
  /** Native tab bar: real SF Symbols on iOS, Material Symbols on Android. */
  sf: { default: SFSymbol; selected: SFSymbol };
  /**
   * Material Symbols name. Also the key `FloatingTabBar` draws its FILLED glyph
   * from, so the Android bar and the iOS tab bar can't disagree about which
   * icon a route owns.
   */
  md: AndroidSymbol;
};

// `as const satisfies` rather than a `NavItem[]` annotation: the literal `md`
// values have to survive for `FloatingTabBar` to type-check them against the
// glyphs it can actually draw.
const NAV_ITEMS = [
  {
    name: 'index',
    href: '/',
    labelKey: 'nav.home',
    icon: { ios: 'house.fill', android: 'home', web: 'home' },
    sf: { default: 'house', selected: 'house.fill' },
    md: 'home',
  },
  {
    name: 'shop',
    href: '/shop',
    labelKey: 'nav.shop',
    icon: { ios: 'bag.fill', android: 'shopping_bag', web: 'shopping_bag' },
    sf: { default: 'bag', selected: 'bag.fill' },
    md: 'shopping_bag',
  },
  {
    name: 'components',
    href: '/components',
    labelKey: 'nav.components',
    icon: { ios: 'square.grid.2x2.fill', android: 'grid_view', web: 'grid_view' },
    sf: { default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' },
    md: 'grid_view',
  },
  {
    name: 'profile',
    href: '/profile',
    labelKey: 'nav.profile',
    icon: { ios: 'person.fill', android: 'person', web: 'person' },
    sf: { default: 'person', selected: 'person.fill' },
    md: 'person',
  },
] as const satisfies readonly NavItem[];

export default function TabLayout() {
  // "There is no standard system tab bar on web" (Expo docs), and the JS Tabs
  // navigator clips its screens to zero height there — so web ALWAYS gets the
  // website chrome (responsive top nav), and the real system tab bar stays
  // native-only. Platform.OS is constant, so this branch never flips at runtime.
  if (Platform.OS === 'web') return <WebsiteLayout />;
  // Android's system tab bar is a full-width opaque Material strip — there is no
  // Android equivalent of iOS 26's liquid glass — so it gets a bar we draw
  // ourselves instead (see below).
  if (Platform.OS === 'android') return <AndroidFloatingTabs />;

  return <NativeBottomTabs />;
}

/* ── Web: top navigation bar + routed content (compact below md) ── */

function WebsiteLayout() {
  // No useAppTheme() here on purpose — it would re-render this whole subtree
  // (and all its text) on every theme change. Icon colours go through
  // withUnistyles/uniProps; sizes and hit slop are GLOBAL tokens that are
  // identical in every theme, so they never needed the theme at all.
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  // Icon-only nav on narrow web; deferred to the client so SSR is deterministic.
  const compact = useClientOnlyValue(false, width < breakpoints.md);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Link href="/" asChild>
            <Pressable>
              <H3 tx="nav.brand" color="primary" style={styles.brand} />
            </Pressable>
          </Link>

          <View style={styles.navLinks}>
            {NAV_ITEMS.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} asChild>
                  <Pressable style={styles.navLink(active)}>
                    <UniSymbolView
                      name={item.icon}
                      size={iconSizes.sm}
                      uniProps={theme => ({
                        tintColor: active ? theme.colors.primary : theme.colors.textMuted,
                      })}
                    />
                    {!compact && (
                      <Label tx={item.labelKey} color={active ? 'primary' : 'textMuted'} />
                    )}
                  </Pressable>
                </Link>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

/* ── Native: the platform's own bottom tab bar ── */

/**
 * NativeTabs renders the real system tab bar — UITabBarController on iOS,
 * Material tabs on Android — instead of a JS-drawn one. That buys the native
 * look, gestures and (iOS 26) liquid-glass / minimize-on-scroll for free.
 *
 * A native tab bar has NO header — each screen draws its own (see
 * `ui/Header.tsx` and the per-screen editorial titles).
 */
function NativeBottomTabs() {
  const { t } = useTranslation();

  return (
    <UniNativeTabs>
      {NAV_ITEMS.map(item => (
        <NativeTabs.Trigger key={item.name} name={item.name}>
          {/* Real SF Symbols / Material Symbols — resolved by the OS, not drawn by us. */}
          <NativeTabs.Trigger.Icon sf={item.sf} md={item.md} />
          <NativeTabs.Trigger.Label>{t(item.labelKey)}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </UniNativeTabs>
  );
}

/* ── Android: the JS navigator, with our own floating bar ── */

const ANDROID_TAB_OPTIONS = {
  // Screens draw their own chrome (`ui/Header.tsx`), exactly as under NativeTabs.
  headerShown: false,
  // Scenes cross-shift while the selection pill springs across the bar.
  animation: 'shift',
} as const;

/**
 * `Tabs` is React Navigation's JS bottom-tabs navigator, so its bar is a React
 * component we can replace wholesale — `FloatingTabBar` renders a blurred
 * capsule floating over the screens. The `Tabs.Screen` children exist only to
 * fix the ORDER (the router would otherwise sort the route files alphabetically:
 * components, index, profile, shop).
 *
 * ── Layout: bar is a SIBLING of the blur target, not inside it ──
 * `expo-blur` on Android samples a designated `BlurTargetView` for its backdrop
 * (it does NOT read the window like iOS). The target here wraps ONLY the
 * `<Tabs>` screens; the `<Tabs>` own bar is disabled (`tabBar={() => null}`) and
 * `FloatingTabBar` renders as a SIBLING, floating over the screens.
 *
 * The bar CANNOT be inside the target. A `BlurView` nested in its own
 * `BlurTargetView` makes the hardware RenderNode tree self-reference —
 * `RenderNode::prepareTree` recurses until the render thread stack overflows
 * (SIGSEGV, `libhwui`). That is exactly why the bar was pulled out of `<Tabs>`
 * and made router-driven (it no longer needs the navigator's tab-bar props).
 *
 * ── Why the target ref is paired with an `onLayout` flag ──
 * `BlurView` resolves its native target once, in `componentDidMount`, via
 * `findNodeHandle(blurTarget.current)`, and re-resolves in `componentDidUpdate`
 * only when `blurTarget.current` *changes*. A plain `useRef` can't drive that:
 * ref mutation triggers no re-render, and a stable ref reports the same value on
 * both sides of the compare. `BlurTargetView` types `ref` as an object ref (no
 * callback allowed), so: hold the object ref, and on its first `onLayout` — by
 * which point `.current` is populated — flip `ready`, rebuilding a FRESH
 * `{ current: node }` object. That null→node transition is what makes BlurView
 * resolve its target and actually blur.
 */
const ANDROID_NO_TAB_BAR = () => null;

function AndroidFloatingTabs() {
  const targetRef = useRef<View | null>(null);
  const [ready, setReady] = useState(false);
  // Recomputed only when `ready` flips — a new object whose `current` is now the
  // populated node, so BlurView sees the change and resolves its native target.
  const blurTarget = useMemo(() => ({ current: ready ? targetRef.current : null }), [ready]);

  return (
    <View style={styles.flex}>
      <BlurTargetView ref={targetRef} style={styles.flex} onLayout={() => setReady(true)}>
        <Tabs screenOptions={ANDROID_TAB_OPTIONS} tabBar={ANDROID_NO_TAB_BAR}>
          {NAV_ITEMS.map(item => (
            <Tabs.Screen key={item.name} name={item.name} />
          ))}
        </Tabs>
      </BlurTargetView>

      <FloatingTabBar items={NAV_ITEMS} blurTarget={blurTarget} />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  brand: {
    letterSpacing: theme.typography.letterSpacing.wider,
  },
  content: {
    flex: 1,
  },
  // The Android BlurTargetView wrapping the tab navigator — must fill the screen
  // or it collapses and the blur samples nothing.
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: theme.borderWidths.thin,
    flexShrink: 0,
    // FIXED height — `Screen` subtracts `webNavHeight` to size tab pages, so
    // the nav must actually be that tall (border included, box-sizing).
    height: rt.insets.top + theme.layout.webNavHeight,
    paddingTop: rt.insets.top,
    ...theme.shadows.sm,
    zIndex: theme.zIndex.sticky,
  },
  headerInner: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
    height: '100%',
    justifyContent: 'space-between',
    maxWidth: theme.layout.navMaxWidth,
    paddingHorizontal: theme.spacing.xl,
    width: '100%',
  },
  infoIcon: (pressed: boolean) => ({
    opacity: pressed ? theme.opacity.pressed : theme.opacity.full,
  }),
  navLink: (active: boolean) => ({
    alignItems: 'center',
    backgroundColor: active ? theme.colors.primaryMuted : 'transparent',
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  }),
  navLinks: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: theme.spacing.xs,
    marginHorizontal: { xs: theme.spacing.sm, md: theme.spacing.xl },
  },
  root: {
    backgroundColor: theme.colors.background,
    // Definite viewport height so the fixed header + scrolling content split it.
    // (On web the Stack screen container is auto-height, which would collapse a
    // plain flex:1 chain to zero and hide the <Slot/> content.)
    height: rt.screen.height,
  },
}));
