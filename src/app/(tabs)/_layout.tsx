import { Link, Slot, Tabs, usePathname } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable, useWindowDimensions, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/components/ui';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { breakpoints, useAppTheme } from '@/theme';

type NavItem = {
  href: '/' | '/two';
  labelKey: 'nav.showcase' | 'nav.settings';
  icon: SymbolViewProps['name'];
};

const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    labelKey: 'nav.showcase',
    icon: { ios: 'paintpalette.fill', android: 'palette', web: 'palette' },
  },
  {
    href: '/two',
    labelKey: 'nav.settings',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  },
];

export default function TabLayout() {
  const { width } = useWindowDimensions();
  // Website chrome (top nav) only on wide web; native + narrow web stay app-like.
  // Deferred to the client so SSR is deterministic (no hydration mismatch).
  const isWebsite = useClientOnlyValue(false, Platform.OS === 'web' && width >= breakpoints.md);

  if (isWebsite) return <WebsiteLayout />;
  return <MobileTabs />;
}

/* ── Wide web: top navigation bar + routed content ── */

function WebsiteLayout() {
  const theme = useAppTheme();
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Link href="/" asChild>
            <Pressable>
              <Text variant="h3" color="primary">
                {t('nav.brand')}
              </Text>
            </Pressable>
          </Link>

          <View style={styles.navLinks}>
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} asChild>
                  <Pressable style={styles.navLink(active)}>
                    <SymbolView
                      name={item.icon}
                      size={theme.iconSizes.sm}
                      tintColor={active ? theme.colors.primary : theme.colors.textMuted}
                    />
                    <Text variant="label" color={active ? 'primary' : 'textMuted'}>
                      {t(item.labelKey)}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
          </View>

          <Link href="/modal" asChild>
            <Pressable hitSlop={theme.hitSlop.md}>
              {({ pressed }) => (
                <SymbolView
                  name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                  size={theme.iconSizes.lg}
                  tintColor={theme.colors.text}
                  style={{ opacity: pressed ? theme.opacity.pressed : theme.opacity.full }}
                />
              )}
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

/* ── Native / narrow web: bottom tab bar (app-like) ── */

function MobileTabs() {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarLabelStyle: { fontFamily: theme.typography.family.medium },
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontFamily: theme.typography.family.semibold },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.showcase'),
          tabBarIcon: ({ color }) => (
            <SymbolView name={NAV_ITEMS[0].icon} tintColor={color} size={theme.iconSizes.xl} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable hitSlop={theme.hitSlop.md} style={{ marginHorizontal: theme.spacing.lg }}>
                {({ pressed }) => (
                  <SymbolView
                    name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                    size={theme.iconSizes.lg}
                    tintColor={theme.colors.text}
                    style={{ opacity: pressed ? theme.opacity.pressed : theme.opacity.full }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color }) => (
            <SymbolView name={NAV_ITEMS[1].icon} tintColor={color} size={theme.iconSizes.xl} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    // Definite viewport height so the fixed header + scrolling content split it.
    // (On web the Stack screen container is auto-height, which would collapse a
    // plain flex:1 chain to zero and hide the <Slot/> content.)
    height: rt.screen.height,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexShrink: 0,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: theme.borderWidths.thin,
    borderBottomColor: theme.colors.border,
    paddingTop: rt.insets.top,
    ...theme.shadows.sm,
    zIndex: theme.zIndex.sticky,
  },
  headerInner: {
    width: '100%',
    maxWidth: theme.layout.navMaxWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    flex: 1,
    marginHorizontal: theme.spacing.xl,
  },
  navLink: (active: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: active ? theme.colors.primaryMuted : 'transparent',
  }),
  content: {
    flex: 1,
  },
}));
