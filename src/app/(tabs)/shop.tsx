import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import { Caption, Chip, P, Pressable, Screen, ScreenHeader } from '@/components/ui';
import { iconSizes } from '@/theme/tokens';
import { ProductCard } from '@/components/product/ProductCard';
import { CATEGORIES, productsByCategory, type CategoryId } from '@/data/products';

const UniSymbolView = withUnistyles(SymbolView);

type Filter = CategoryId | 'all';

const FILTERS: Filter[] = ['all', ...CATEGORIES.map(c => c.id)];

export default function ShopScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const initial = (FILTERS.includes(params.category as Filter) ? params.category : 'all') as Filter;
  const [filter, setFilter] = useState<Filter>(initial);

  const products = productsByCategory(filter);

  return (
    <Screen scroll underWebNav>
      <ScreenHeader titleTx="catalog.title" style={styles.header}>
        <Caption
          color="textMuted"
          tx="catalog.subtitle"
          txOptions={{ count: products.length }}
          style={styles.count}
        />
      </ScreenHeader>

      {/* Faux search field → the search screen drops down over the shop. */}
      <Pressable onPress={() => router.push('/search')} style={styles.searchBar}>
        <UniSymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={iconSizes.sm}
          uniProps={theme => ({ tintColor: theme.colors.textMuted })}
        />
        <Caption color="textMuted" tx="search.placeholder" />
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // ScrollView defaults to flexGrow:1 — as a direct child of the screen's
        // flexGrow:1 content it would swallow ALL leftover height whenever the
        // grid is short (pick a 2-item category → giant gap under the chips).
        style={styles.filtersScroll}
        contentContainerStyle={styles.filters}
      >
        {/* eslint-disable-next-line react-doctor/rn-no-scrollview-mapped-list -- small fixed list (6 filters); FlashList overkill */}
        {FILTERS.map(f => (
          <Chip
            key={f}
            tx={f === 'all' ? 'catalog.all' : `catalog.categories.${f}`}
            selected={filter === f}
            onPress={() => setFilter(f)}
          />
        ))}
      </ScrollView>

      {products.length === 0 ? (
        <P color="textMuted" tx="catalog.empty" style={styles.empty} />
      ) : (
        <View style={styles.grid}>
          {products.map(p => (
            <View key={p.id} style={styles.cell}>
              <ProductCard product={p} />
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create(theme => ({
  cell: {
    width: { xs: '47%', md: '30%', lg: '22%' },
  },
  count: {
    marginTop: theme.spacing.xxs,
  },
  empty: {
    marginTop: theme.spacing.xxl,
    textAlign: 'center',
  },
  filters: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidths.thin,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
}));
