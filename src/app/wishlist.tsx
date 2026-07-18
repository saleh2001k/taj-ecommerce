import { router } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppHeader, Caption, OutlineButton, P, Screen } from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useWishlist } from '@/store/wishlist';

export default function WishlistScreen() {
  const ids = useWishlist(s => s.ids);
  // Catalog order keeps the grid stable regardless of save order.
  const saved = PRODUCTS.filter(p => ids.includes(p.id));

  return (
    <Screen scroll header={<AppHeader titleTx="wishlist.title" />}>
      {saved.length === 0 ? (
        <View style={styles.empty}>
          <P color="textMuted" tx="wishlist.empty" align="center" />
          <OutlineButton tx="wishlist.browse" onPress={() => router.push('/shop')} />
        </View>
      ) : (
        <>
          <Caption
            color="textMuted"
            tx="wishlist.saved"
            txOptions={{ count: saved.length }}
            style={styles.count}
          />
          <View style={styles.grid}>
            {saved.map(p => (
              <View key={p.id} style={styles.cell}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create(theme => ({
  cell: {
    width: { xs: '47%', md: '30%', lg: '22%' },
  },
  count: {
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  empty: {
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.huge,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
}));
