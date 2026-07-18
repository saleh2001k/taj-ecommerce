/**
 * Bag — a real snap-point sheet (`bagSheet` in navigation/transitions).
 *
 * Rests at 62% of the screen, drags up to fullscreen, swipes down or
 * backdrop-taps to dismiss. The list is a `Transition.ScrollView`, so the
 * dismiss gesture and the scroll coordinate: pulling down from the top of the
 * list moves the sheet, scrolling mid-list scrolls normally.
 */
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Platform, View } from 'react-native';
import Transition from 'react-native-screen-transitions';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import {
  Caption,
  Divider,
  H2,
  H3,
  Image,
  OutlineButton,
  P,
  PBold,
  Pressable,
  PrimaryButton,
} from '@/components/ui';
import { formatPrice, getProduct } from '@/data/products';
import { BAG_FOOTER_STYLE_ID } from '@/navigation/transitions';
import { useBag, type BagLine } from '@/store/bag';
import { iconSizes } from '@/theme/tokens';

const UniSymbolView = withUnistyles(SymbolView);

/** Plain styles for Transition.* components (see the web-flattening note). */
const PLAIN_FLEX = { flex: 1 } as const;
const PLAIN_BOTTOM_BAR = { bottom: 0, left: 0, position: 'absolute', right: 0 } as const;

export default function BagScreen() {
  const lines = useBag(s => s.lines);

  const total = lines.reduce((sum, l) => {
    const p = getProduct(l.productId);
    return sum + (p ? p.price * l.qty : 0);
  }, 0);

  return (
    <View style={Platform.OS === 'web' ? styles.sheetWeb : styles.sheet}>
      {/* Grabber — the sheet affordance. */}
      <View style={styles.grabber} />

      <View style={styles.header}>
        <H2 tx="bag.title" />
        <Caption color="textMuted" tx="bag.items" txOptions={{ count: lines.length }} />
      </View>

      {lines.length === 0 ? (
        <View style={styles.empty}>
          <P color="textMuted" tx="bag.empty" align="center" />
          <OutlineButton
            tx="bag.browse"
            onPress={() => {
              router.back();
              router.push('/shop');
            }}
          />
        </View>
      ) : (
        <>
          {/* Transition.* components only take PLAIN styles: Reanimated's web
              style flattening destroys Unistyles objects. Themed styles live
              on plain inner Views. */}
          <Transition.ScrollView style={PLAIN_FLEX} showsVerticalScrollIndicator={false}>
            <View style={styles.listContent}>
              {lines.map((line, i) => (
                <View key={line.productId}>
                  {i > 0 && <Divider />}
                  <BagRow line={line} />
                </View>
              ))}
            </View>
          </Transition.ScrollView>

          {/* Checkout bar: absolutely bottomed, counter-translated by the
              transition (styleId slot) so it stays pinned to the VISIBLE
              bottom while the sheet rests at a partial snap. */}
          <Transition.View styleId={BAG_FOOTER_STYLE_ID} style={PLAIN_BOTTOM_BAR}>
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <H3 tx="bag.total" />
                <H3>{formatPrice(total)}</H3>
              </View>
              <Caption color="textMuted" tx="bag.note" />
              <PrimaryButton tx="bag.checkout" size="lg" fullWidth onPress={() => router.back()} />
            </View>
          </Transition.View>
        </>
      )}
    </View>
  );
}

function BagRow({ line }: { line: BagLine }) {
  const setQty = useBag(s => s.setQty);
  const product = getProduct(line.productId);
  if (!product) return null;

  return (
    <View style={styles.row}>
      <View style={styles.thumb}>
        <Image
          uri={product.image}
          aspectRatio={0.8}
          radius="md"
          accessibilityLabel={product.name}
        />
      </View>

      <View style={styles.rowText}>
        <P numberOfLines={1}>{product.name}</P>
        {line.size ? (
          <Caption color="textMuted" tx="bag.size" txOptions={{ size: line.size }} />
        ) : null}
        <PBold>{formatPrice(product.price * line.qty)}</PBold>
      </View>

      <View style={styles.stepper}>
        <QtyButton
          icon={{ ios: 'minus', android: 'remove', web: 'remove' }}
          onPress={() => setQty(line.productId, line.qty - 1)}
        />
        <PBold>{line.qty}</PBold>
        <QtyButton
          icon={{ ios: 'plus', android: 'add', web: 'add' }}
          onPress={() => setQty(line.productId, line.qty + 1)}
        />
      </View>
    </View>
  );
}

function QtyButton({
  icon,
  onPress,
}: {
  icon: { ios: string; android: string; web: string };
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.qtyButton} accessibilityLabel="quantity">
      <UniSymbolView
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- SymbolView's per-platform name union is stricter than needed here
        name={icon as any}
        size={iconSizes.sm}
        uniProps={theme => ({ tintColor: theme.colors.text })}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  empty: {
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.huge,
  },
  footer: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: theme.borderWidths.thin,
    gap: theme.spacing.md,
    paddingBottom: rt.insets.bottom + theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  grabber: {
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    height: theme.gap(1),
    marginTop: theme.spacing.md,
    width: theme.gap(10),
  },
  header: {
    gap: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  listContent: {
    // Clears the pinned checkout bar at the collapsed snap.
    paddingBottom: theme.gap(60),
    paddingHorizontal: theme.spacing.lg,
  },
  qtyButton: {
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.gap(8),
    justifyContent: 'center',
    width: theme.gap(8),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  rowText: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    flex: 1,
    overflow: 'hidden',
  },
  // Separate key on purpose: spreading a Platform conditional inside a style
  // breaks Unistyles' web static analysis (the whole style silently drops).
  // Web screen containers are auto-height, so the sheet takes the viewport
  // height explicitly (same trick as `Screen`).
  sheetWeb: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    height: rt.screen.height,
    overflow: 'hidden',
  },
  stepper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  thumb: {
    width: theme.gap(16),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
