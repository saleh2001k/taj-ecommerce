/**
 * Search — drops down over the app (SlideFromTop) and swipes back up to
 * dismiss. Filters the catalog live.
 */
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import {
  AppHeader,
  Caption,
  Chip,
  Divider,
  Image,
  P,
  PBold,
  Pressable,
  Screen,
} from '@/components/ui';
import { CATEGORIES, formatPrice, PRODUCTS, type Product } from '@/data/products';

/** TextInput colours are props/styles Unistyles can't theme via tokens alone. */
const UniTextInput = withUnistyles(TextInput, theme => ({
  placeholderTextColor: theme.colors.textMuted,
  selectionColor: theme.colors.primary,
}));

export default function SearchScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();
  const results = trimmed ? PRODUCTS.filter(p => p.name.toLowerCase().includes(trimmed)) : [];

  return (
    <Screen scroll header={<AppHeader titleTx="search.title" close />}>
      <UniTextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('search.placeholder')}
        autoFocus
        autoCorrect={false}
        style={styles.input}
        accessibilityLabel={t('search.title')}
      />

      {trimmed ? (
        <>
          <Caption
            color="textMuted"
            tx="search.results"
            txOptions={{ count: results.length }}
            style={styles.sectionLabel}
          />
          {results.length === 0 ? (
            <P color="textMuted" tx="search.empty" style={styles.empty} />
          ) : (
            results.map((p, i) => (
              <View key={p.id}>
                {i > 0 && <Divider />}
                <ResultRow product={p} />
              </View>
            ))
          )}
        </>
      ) : (
        <>
          <Caption color="textMuted" tx="search.categories" style={styles.sectionLabel} />
          <View style={styles.chips}>
            {CATEGORIES.map(c => (
              <Chip
                key={c.id}
                tx={c.tx}
                onPress={() => {
                  router.back();
                  router.push({ pathname: '/shop', params: { category: c.id } });
                }}
              />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

function ResultRow({ product }: { product: Product }) {
  return (
    <Pressable onPress={() => router.push(`/product/${product.id}`)} style={styles.row}>
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
        <PBold>{formatPrice(product.price)}</PBold>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  empty: {
    marginTop: theme.spacing.xl,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidths.thin,
    color: theme.colors.text,
    fontFamily: theme.typography.family.regular,
    fontSize: theme.typography.sizes.md,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  rowText: {
    flex: 1,
    gap: theme.spacing.xxs,
  },
  sectionLabel: {
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  thumb: {
    width: theme.gap(18),
  },
}));
