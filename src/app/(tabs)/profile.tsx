import { router, type Href } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Platform, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import {
  Badge,
  Caption,
  Card,
  Divider,
  Label,
  PBold,
  Pressable,
  Screen,
  ScreenHeader,
} from '@/components/ui';
import type { TxKey } from '@/components/ui';
import { bagCount, useBag } from '@/store/bag';
import { useSettings } from '@/store/settings';
import { useWishlist } from '@/store/wishlist';
import { isRTL } from '@/theme';
import { iconSizes } from '@/theme/tokens';
import pkg from '../../../package.json';

const UniSymbolView = withUnistyles(SymbolView);

type MenuItem = {
  tx: TxKey;
  icon: SymbolViewProps['name'];
  /** String path — cast at push so deleted routes (e.g. old `/modal`) don't break the menu type. */
  href: string;
};

const MENU: MenuItem[] = [
  {
    tx: 'profile.orders',
    icon: { ios: 'shippingbox', android: 'package_2', web: 'package_2' },
    href: '/orders',
  },
  {
    tx: 'profile.wishlist',
    icon: { ios: 'heart', android: 'favorite', web: 'favorite' },
    href: '/wishlist',
  },
  {
    tx: 'profile.bag',
    icon: { ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' },
    href: '/bag',
  },
  {
    tx: 'profile.search',
    icon: { ios: 'magnifyingglass', android: 'search', web: 'search' },
    href: '/search',
  },
  {
    tx: 'profile.preferences',
    icon: { ios: 'slider.horizontal.3', android: 'tune', web: 'tune' },
    href: '/preferences',
  },
  {
    tx: 'profile.about',
    icon: { ios: 'info.circle', android: 'info', web: 'info' },
    href: '/modal',
  },
];

export default function ProfileScreen() {
  return (
    <Screen scroll underWebNav>
      <ScreenHeader titleTx="profile.title" style={styles.header} />

      {/* Identity — no auth in this demo, so a guest identity that explains
          what signing in would add. */}
      <Card style={styles.identity}>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            <UniSymbolView
              name={{ ios: 'person.fill', android: 'person', web: 'person' }}
              size={iconSizes.xl}
              uniProps={theme => ({ tintColor: theme.colors.onPrimary })}
            />
          </View>
          <View style={styles.identityText}>
            <PBold tx="profile.guest" />
            <Caption color="textMuted" tx="profile.tagline" />
          </View>
        </View>
      </Card>

      <Card padded={false} style={styles.menu}>
        {MENU.map((item, i) => (
          <View key={item.href}>
            {i > 0 && <Divider />}
            <MenuRow item={item} />
          </View>
        ))}
      </Card>

      <Caption color="textMuted" tx="settings.version" txOptions={{ version: pkg.version }} />
    </Screen>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  // The trailing chevron must mirror under RTL on android/web (SF chevrons
  // are direction-aware natively; the Material glyph is not).
  const language = useSettings(s => s.language);
  const mirrored = isRTL(language) && Platform.OS !== 'ios';
  const wishCount = useWishlist(s => s.ids.length);
  const bagLines = useBag(s => bagCount(s.lines));
  const count = item.href === '/wishlist' ? wishCount : item.href === '/bag' ? bagLines : 0;
  const showCount = count > 0;

  return (
    <Pressable onPress={() => router.push(item.href as Href)} style={styles.row}>
      <UniSymbolView
        name={item.icon}
        size={iconSizes.md}
        uniProps={theme => ({ tintColor: theme.colors.text })}
      />
      <Label tx={item.tx} style={styles.rowLabel} />
      {showCount && <Badge tone="neutral">{count}</Badge>}
      <UniSymbolView
        name={{ ios: 'chevron.forward', android: 'chevron_right', web: 'chevron_right' }}
        size={iconSizes.sm}
        uniProps={theme => ({ tintColor: theme.colors.textMuted })}
        style={mirrored ? styles.mirrored : undefined}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    height: theme.gap(14),
    justifyContent: 'center',
    width: theme.gap(14),
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  identity: {
    marginBottom: theme.spacing.lg,
  },
  identityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  identityText: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  menu: {
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  rowLabel: {
    flex: 1,
  },
}));
