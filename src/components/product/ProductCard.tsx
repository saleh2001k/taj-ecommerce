/**
 * ProductCard — image + name + price tile for the catalog grids.
 *
 * Composed entirely from the UI kit (Pressable, Image, Badge, text primitives),
 * so it inherits their theming and no-re-render guarantees. Fills its grid cell;
 * the parent controls column width.
 */
import { router } from 'expo-router';
import { memo } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Badge, Caption, Image, P, PBold, Pressable } from '@/components/ui';
import { formatPrice, type Product } from '@/data/products';

export type ProductCardProps = {
  product: Product;
};

const styles = StyleSheet.create(theme => ({
  badge: {
    left: theme.spacing.sm,
    position: 'absolute',
    top: theme.spacing.sm,
  },
  card: {
    gap: theme.spacing.sm,
    width: '100%',
  },
  imageWrap: {
    position: 'relative',
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  strike: {
    textDecorationLine: 'line-through',
  },
  swatch: (color: string) => ({
    backgroundColor: color,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: theme.borderWidths.thin,
    height: theme.iconSizes.xs,
    width: theme.iconSizes.xs,
  }),
  swatches: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
}));

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/product/${product.id}`)}>
      <View style={styles.imageWrap}>
        <Image
          uri={product.image}
          aspectRatio={0.8}
          radius="lg"
          accessibilityLabel={product.name}
        />
        {product.badge === 'new' && <Badge tone="primary" tx="catalog.new" style={styles.badge} />}
        {product.badge === 'sale' && <Badge tone="danger" tx="catalog.sale" style={styles.badge} />}
      </View>

      <P numberOfLines={1}>{product.name}</P>

      <View style={styles.priceRow}>
        <PBold color={product.compareAt ? 'danger' : 'text'}>{formatPrice(product.price)}</PBold>
        {product.compareAt ? (
          <Caption color="textMuted" style={styles.strike}>
            {formatPrice(product.compareAt)}
          </Caption>
        ) : null}
      </View>

      <View style={styles.swatches}>
        {product.colors.map(c => (
          <View key={c} style={styles.swatch(c)} />
        ))}
      </View>
    </Pressable>
  );
});

ProductCard.displayName = 'ProductCard';
