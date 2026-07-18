import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import { ProductCard } from '@/components/product/ProductCard';
import {
  AppHeader,
  Badge,
  Caption,
  Divider,
  H2,
  H3,
  Image,
  Label,
  P,
  PBold,
  Pressable,
  PrimaryButton,
  Screen,
} from '@/components/ui';
import { formatPrice, getProduct, relatedProducts } from '@/data/products';
import { Stack } from '@/navigation/stack';
import { bagCount, useBag } from '@/store/bag';
import { useWishlist } from '@/store/wishlist';
import { iconSizes } from '@/theme/tokens';

const UniSymbolView = withUnistyles(SymbolView);

/** Frosted bag in the floating chrome — opens the bag sheet, shows a count. */
function BagButton() {
  const count = useBag(s => bagCount(s.lines));

  return (
    <Pressable
      onPress={() => router.push('/bag')}
      accessibilityLabel="bag"
      style={styles.wishlistButton}
    >
      <UniSymbolView
        name={{ ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' }}
        size={iconSizes.md}
        uniProps={theme => ({ tintColor: theme.colors.onOverlay })}
      />
      {count > 0 && (
        <View style={styles.bagCount}>
          <Caption color="onPrimary">{count}</Caption>
        </View>
      )}
    </Pressable>
  );
}

/** Frosted heart in the floating chrome — saves the piece to the wishlist. */
function WishlistButton({ id }: { id: string }) {
  const saved = useWishlist(s => s.ids.includes(id));
  const toggle = useWishlist(s => s.toggle);

  return (
    <Pressable
      onPress={() => toggle(id)}
      accessibilityLabel="wishlist"
      style={styles.wishlistButton}
    >
      <UniSymbolView
        name={
          saved
            ? { ios: 'heart.fill', android: 'favorite', web: 'favorite' }
            : { ios: 'heart', android: 'favorite_border', web: 'favorite_border' }
        }
        size={iconSizes.md}
        uniProps={theme => ({
          tintColor: saved ? theme.colors.danger : theme.colors.onOverlay,
        })}
      />
    </Pressable>
  );
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | undefined>(product?.colors[0]);
  const [added, setAdded] = useState(false);
  const addToBag = useBag(s => s.add);

  if (!product) {
    return (
      <Screen scroll header={<AppHeader titleTx="catalog.title" />}>
        <Stack.Screen options={{ title: '' }} />
        <P color="textMuted" tx="catalog.empty" />
      </Screen>
    );
  }

  const singleSize = product.sizes.length === 1;
  const canAdd = singleSize || size !== null;
  const reviewCount = Math.round(product.rating * 37);
  const related = relatedProducts(product);

  const onAdd = () => {
    addToBag({ productId: product.id, size: size ?? product.sizes[0], color });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <View style={styles.root}>
      <Screen scroll padded={false} insets="bottom">
        <Stack.Screen options={{ title: product.name }} />

        <View style={styles.top}>
          {/* Full-bleed photograph on phones; half the row on desktop. The
              floating chrome (below) sits on top of it. */}
          <View style={styles.imageCol}>
            <Pressable onPress={() => router.push(`/photo/${product.id}`)}>
              <Image
                uri={product.image}
                aspectRatio={0.85}
                radius="none"
                accessibilityLabel={product.name}
              />
            </Pressable>
          </View>

          <View style={styles.detailCol}>
            {product.badge === 'new' && <Badge tone="primary" tx="catalog.new" />}
            {product.badge === 'sale' && <Badge tone="danger" tx="catalog.sale" />}

            <H2>{product.name}</H2>

            <View style={styles.priceRow}>
              <H3 color={product.compareAt ? 'danger' : 'text'}>{formatPrice(product.price)}</H3>
              {product.compareAt ? (
                <P color="textMuted" style={styles.strike}>
                  {formatPrice(product.compareAt)}
                </P>
              ) : null}
            </View>

            <Caption
              color="textMuted"
              tx="product.ratingReviews"
              txOptions={{ rating: product.rating.toFixed(1), count: reviewCount }}
            />

            {/* Colour */}
            <View style={styles.selectorBlock}>
              <Label tx="product.colorLabel" />
              <View style={styles.swatchRow}>
                {product.colors.map(c => (
                  <Pressable key={c} onPress={() => setColor(c)}>
                    <View style={styles.swatch(c, c === color)} />
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Size */}
            {!singleSize && (
              <View style={styles.selectorBlock}>
                <Label tx="product.sizeLabel" />
                <View style={styles.sizeRow}>
                  {product.sizes.map(s => (
                    <Pressable key={s} onPress={() => setSize(s)}>
                      <View style={styles.size(s === size)}>
                        <PBold color={s === size ? 'onPrimary' : 'text'}>{s}</PBold>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <PrimaryButton
              tx={added ? 'product.added' : 'product.addToCart'}
              size="lg"
              fullWidth
              disabled={!canAdd}
              onPress={onAdd}
              style={styles.addBtn}
            />
            <Caption color="textMuted" tx="product.shipping" style={styles.shipping} />
          </View>
        </View>

        <View style={styles.body}>
          <Divider />

          <H3 tx="product.description" style={styles.blockTitle} />
          <P color="textMuted" tx="product.descriptionBody" />

          {related.length > 0 && (
            <>
              <H3 tx="product.youMayLike" style={styles.blockTitle} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.related}
              >
                {/* eslint-disable-next-line react-doctor/rn-no-scrollview-mapped-list -- small fixed list (<=4 related); FlashList overkill */}
                {related.map(p => (
                  <View key={p.id} style={styles.relatedCard}>
                    <ProductCard product={p} />
                  </View>
                ))}
              </ScrollView>
            </>
          )}
        </View>
      </Screen>

      {/* Frosted circular chrome floating over the photograph. */}
      <AppHeader
        variant="overlay"
        right={
          <View style={styles.chromeRow}>
            <BagButton />
            <WishlistButton id={product.id} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  addBtn: {
    marginTop: theme.spacing.lg,
  },
  bagCount: {
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    justifyContent: 'center',
    minWidth: theme.gap(5),
    paddingHorizontal: theme.spacing.xxs,
    position: 'absolute',
    right: -theme.spacing.xxs,
    top: -theme.spacing.xxs,
  },
  blockTitle: {
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  body: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  chromeRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  detailCol: {
    flex: { xs: undefined, lg: 1 },
    gap: theme.spacing.sm,
    paddingHorizontal: { xs: theme.spacing.lg, lg: theme.spacing.none },
    paddingTop: { xs: theme.spacing.lg, lg: theme.spacing.none },
  },
  imageCol: {
    width: { xs: '100%', lg: '50%' },
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  related: {
    gap: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
  },
  relatedCard: {
    width: { xs: 200, md: 220 },
  },
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    position: 'relative',
  },
  selectorBlock: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  shipping: {
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  size: (selected: boolean) => ({
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.primary : 'transparent',
    borderColor: selected ? theme.colors.primary : theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidths.thin,
    justifyContent: 'center',
    minWidth: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  }),
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  swatch: (color: string, selected: boolean) => ({
    backgroundColor: color,
    borderColor: selected ? theme.colors.primary : theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: selected ? theme.borderWidths.thick : theme.borderWidths.thin,
    height: theme.iconSizes.xl,
    width: theme.iconSizes.xl,
  }),
  swatchRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  top: {
    flexDirection: { xs: 'column', lg: 'row' },
    gap: theme.spacing.xl,
    paddingHorizontal: { xs: theme.spacing.none, lg: theme.spacing.lg },
    paddingTop: { xs: theme.spacing.none, lg: theme.spacing.lg },
  },
  // Mirrors the AppHeader chrome circle (same size/frost) for the right slot.
  wishlistButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.overlay,
    borderRadius: theme.radius.pill,
    height: theme.gap(10),
    justifyContent: 'center',
    width: theme.gap(10),
  },
}));
