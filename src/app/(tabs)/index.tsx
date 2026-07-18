import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import {
  Caption,
  Display,
  H3,
  H4,
  Image,
  Overline,
  P,
  PrimaryButton,
  Pressable,
  Screen,
} from '@/components/ui';
import { ProductCard } from '@/components/product/ProductCard';
import { CATEGORIES, HERO_IMAGE, PRODUCTS, type Category } from '@/data/products';

const FEATURED = PRODUCTS.filter(p => p.badge).slice(0, 4);
const NEW_ARRIVALS = PRODUCTS.filter(p => p.badge === 'new');

/**
 * Editorial scrim: a whisper at the top (wordmark legibility), clear through
 * the middle so the photograph reads true, deepening at the bottom where the
 * statement sits. `colors` is a PROP, so it goes through withUnistyles.
 */
const HeroScrim = withUnistyles(LinearGradient, theme => ({
  colors: [theme.colors.overlay, 'transparent', theme.colors.overlay, theme.colors.backdrop] as [
    string,
    string,
    string,
    string,
  ],
  locations: [0, 0.32, 0.65, 1] as [number, number, number, number],
}));

export default function HomeScreen() {
  return (
    <Screen scroll padded={false} underWebNav>
      <Hero />
      <PromoBand />

      <Section titleTx="home.shopByCategory">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {/* eslint-disable-next-line react-doctor/rn-no-scrollview-mapped-list -- small fixed list (5 categories); FlashList overkill */}
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </ScrollView>
      </Section>

      <Section titleTx="home.featured">
        <View style={styles.grid}>
          {FEATURED.map(p => (
            <View key={p.id} style={styles.cell}>
              <ProductCard product={p} />
            </View>
          ))}
        </View>
      </Section>

      <Section titleTx="home.newArrivals">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {/* eslint-disable-next-line react-doctor/rn-no-scrollview-mapped-list -- small fixed list (<=4 items); FlashList overkill */}
          {NEW_ARRIVALS.map(p => (
            <View key={p.id} style={styles.hCard}>
              <ProductCard product={p} />
            </View>
          ))}
        </ScrollView>
      </Section>

      <View style={styles.footerSpace} />
    </Screen>
  );
}

/**
 * Full-bleed editorial opener: photograph, scrim, the wordmark floating at the
 * top, and the season's statement anchored to the bottom edge.
 */
function Hero() {
  return (
    <View style={styles.hero}>
      <Image uri={HERO_IMAGE} fill radius="none" />
      <HeroScrim style={styles.heroScrim} />

      <View style={styles.heroBrand}>
        <H3 color="onOverlay" tx="nav.brand" style={styles.wordmark} />
      </View>

      <View style={styles.heroContent}>
        <Overline color="onOverlay" tx="home.heroEyebrow" style={styles.tracked} />
        <Display color="onOverlay" tx="home.heroTitle" />
        <P color="onOverlay" tx="home.heroSubtitle" style={styles.heroSubtitle} />
        <PrimaryButton
          tx="home.shopNow"
          size="lg"
          onPress={() => router.push('/shop')}
          style={styles.heroBtn}
        />
      </View>
    </View>
  );
}

/** Ink band under the hero — the store promise, set like a care label. */
function PromoBand() {
  return (
    <View style={styles.promo}>
      <Caption color="onPrimary" tx="home.promo" align="center" style={styles.tracked} />
    </View>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Pressable
      style={styles.categoryCard}
      onPress={() => router.push({ pathname: '/shop', params: { category: category.id } })}
    >
      <Image uri={category.image} aspectRatio={0.8} radius="lg" />
      <Overline color="textMuted" tx={category.tx} style={styles.categoryLabel} />
    </Pressable>
  );
}

function Section({
  titleTx,
  children,
}: {
  titleTx: 'home.shopByCategory' | 'home.featured' | 'home.newArrivals';
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <H4 tx={titleTx} />
        <Pressable onPress={() => router.push('/shop')}>
          <Caption color="textMuted" tx="home.viewAll" />
        </Pressable>
      </View>
      <View style={styles.rule} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  categoryCard: {
    gap: theme.spacing.sm,
    width: { xs: 150, md: 180 },
  },
  categoryLabel: {
    letterSpacing: theme.typography.letterSpacing.wider,
  },
  cell: {
    width: { xs: '47%', md: '30%', lg: '22%' },
  },
  footerSpace: {
    height: theme.spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  hCard: {
    width: { xs: 220, md: 240 },
  },
  hScroll: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  hero: {
    height: { xs: 520, md: 560, lg: 620 },
    justifyContent: 'flex-end',
    position: 'relative',
  },
  heroBrand: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: rt.insets.top + theme.spacing.lg,
  },
  heroBtn: {
    marginTop: theme.spacing.xl,
  },
  heroContent: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  heroScrim: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  heroSubtitle: {
    marginTop: theme.spacing.xs,
    maxWidth: 460,
  },
  promo: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  rule: {
    backgroundColor: theme.colors.border,
    height: theme.borderWidths.thin,
  },
  section: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tracked: {
    letterSpacing: theme.typography.letterSpacing.wider,
  },
  wordmark: {
    letterSpacing: theme.typography.letterSpacing.wider,
  },
}));
