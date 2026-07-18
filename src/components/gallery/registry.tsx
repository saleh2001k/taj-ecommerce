/**
 * Component gallery registry.
 *
 * One entry per UI component: `slug` (route), `title`/`description` (shown in the
 * index list) and `render()` (every use case, shown on the detail screen).
 *
 * Demo copy is intentionally NOT translated — it's a developer style guide, so
 * text primitives use their `children` opt-out and buttons reuse real locale
 * keys (buttons are tx-only by design).
 */
import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import {
  AccentButton,
  AppHeader,
  Badge,
  ButtonText,
  Caption,
  Card,
  Chip,
  DangerButton,
  Display,
  Divider,
  GhostButton,
  H1,
  H2,
  H3,
  H4,
  Image,
  Label,
  Overline,
  OutlineButton,
  P,
  PBold,
  PrimaryButton,
  Pressable,
  ScreenHeader,
  SecondaryButton,
} from '@/components/ui';
import { iconSizes } from '@/theme/tokens';

export type GalleryEntry = {
  slug: string;
  title: string;
  description: string;
  /** Small preview image for the index list. */
  preview: string;
  render: () => ReactNode;
};

/** Clothing photography for previews/demos — every ID verified to resolve. */
const UNSPLASH: Record<string, string> = {
  text: '1469334031218-e382a71b716b',
  button: '1441984904996-e0b6ba687e04',
  card: '1445205170230-053b83016050',
  'card-media': '1483985988355-763728e1935b',
  chip: '1521369909029-2afed882baee',
  pressable: '1520975954732-35dd22299614',
  image: '1551028719-00167b16eac5',
  'img-1': '1527016021513-b09758b777bd',
  'img-2': '1583743814966-8936f5b7be1a',
  'img-3': '1576566588028-4147f3842f27',
  'img-4': '1605812860427-4024433a70fd',
  'img-5': '1611652022419-a9419f74343d',
  'img-6': '1549298916-b41d501d3772',
  badge: '1610652492500-ded49ceeb378',
  header: '1620799140408-edc6dcb6d633',
};

const g = (name: string) =>
  `https://images.unsplash.com/photo-${UNSPLASH[name]}?w=400&q=80&auto=format&fit=crop`;

/** One labelled use case: a caption + the live demo. */
function Case({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.case}>
      <Overline color="textMuted">{label}</Overline>
      <View style={styles.caseBody}>{children}</View>
    </View>
  );
}

// tintColor is a PROP, so Unistyles can't restyle it — withUnistyles keeps the
// icon readable when onPrimary flips between white (light) and ink (dark).
const UniSymbolView = withUnistyles(SymbolView);
const bagIcon = (
  <UniSymbolView
    name="bag.fill"
    size={iconSizes.sm}
    uniProps={theme => ({ tintColor: theme.colors.onPrimary })}
  />
);

export const GALLERY: GalleryEntry[] = [
  {
    slug: 'text',
    title: 'Text',
    description: 'Display, H1–H4, P, Label, Caption, Overline — tight metrics, dual-script.',
    preview: g('text'),
    render: () => (
      <>
        <Case label="Display">
          <Display>Display</Display>
        </Case>
        <Case label="Headings">
          <H1>Heading 1</H1>
          <H2>Heading 2</H2>
          <H3>Heading 3</H3>
          <H4>Heading 4</H4>
        </Case>
        <Case label="Body">
          <P>Body — the quick brown fox jumps. النص العربي هنا يظهر بشكل صحيح.</P>
          <PBold>PBold — emphasised body copy.</PBold>
        </Case>
        <Case label="Supporting">
          <Label>FIELD LABEL</Label>
          <Caption>Caption / helper text</Caption>
          <Overline>OVERLINE</Overline>
        </Case>
        <Case label="Colours">
          <P color="primary">primary</P>
          <P color="accent">accent</P>
          <P color="success">success</P>
          <P color="danger">danger</P>
          <P color="textMuted">muted</P>
        </Case>
        <Case label="Alignment">
          <P align="left">Start-aligned (flips under RTL)</P>
          <P align="center">Centered</P>
          <P align="right">End-aligned</P>
        </Case>
      </>
    ),
  },
  {
    slug: 'button',
    title: 'Buttons',
    description: 'Six variants, three sizes, loading, disabled, icons — ripple on every platform.',
    preview: g('button'),
    render: () => (
      <>
        <Case label="Variants">
          <View style={styles.row}>
            <PrimaryButton tx="home.shopNow" />
            <SecondaryButton tx="catalog.all" />
            <AccentButton tx="catalog.new" />
          </View>
          <View style={styles.row}>
            <OutlineButton tx="nav.about" />
            <GhostButton tx="nav.back" />
            <DangerButton tx="settings.reset" />
          </View>
        </Case>
        <Case label="Sizes">
          <View style={styles.row}>
            <PrimaryButton tx="catalog.all" size="sm" />
            <PrimaryButton tx="catalog.all" size="md" />
            <PrimaryButton tx="catalog.all" size="lg" />
          </View>
        </Case>
        <Case label="With icons">
          <View style={styles.row}>
            <PrimaryButton tx="product.addToCart" leftIcon={bagIcon} />
          </View>
        </Case>
        <Case label="States">
          <View style={styles.row}>
            <PrimaryButton tx="home.shopNow" loading />
            <PrimaryButton tx="home.shopNow" disabled />
          </View>
        </Case>
        <Case label="Full width">
          <PrimaryButton tx="product.addToCart" fullWidth />
        </Case>
      </>
    ),
  },
  {
    slug: 'card',
    title: 'Card',
    description: 'Elevated surface with brand radius; optional press behaviour.',
    preview: g('card'),
    render: () => (
      <>
        <Case label="Default (elevated)">
          <Card>
            <H4>Card title</H4>
            <Divider />
            <P color="textMuted">Surface, border, brand radius and a scheme-aware shadow.</P>
          </Card>
        </Case>
        <Case label="Flat (not elevated)">
          <Card elevated={false}>
            <P>No shadow — just border + surface.</P>
          </Card>
        </Case>
        <Case label="Pressable">
          <Card onPress={() => {}}>
            <P>Tap me — dims like TouchableOpacity.</P>
          </Card>
        </Case>
        <Case label="Media card (unpadded)">
          <Card padded={false} style={styles.mediaCard}>
            <Image uri={g('card-media')} aspectRatio={1.6} radius="none" />
            <View style={styles.mediaBody}>
              <PBold>Overlaid content</PBold>
              <Caption color="textMuted">padded=false lets media reach the edge.</Caption>
            </View>
          </Card>
        </Case>
      </>
    ),
  },
  {
    slug: 'chip',
    title: 'Chip',
    description: 'Selectable pill used by the settings pickers; radius + font previews.',
    preview: g('chip'),
    render: () => (
      <>
        <Case label="Selected / unselected">
          <View style={styles.row}>
            <Chip label="Selected" selected />
            <Chip label="Default" />
            <Chip label="Another" />
          </View>
        </Case>
        <Case label="Radius preview">
          <View style={styles.row}>
            <Chip label="Sharp" radius={0} />
            <Chip label="Rounded" radius={10} />
            <Chip label="Pill" radius={999} />
          </View>
        </Case>
      </>
    ),
  },
  {
    slug: 'pressable',
    title: 'Pressable',
    description: 'TouchableOpacity-style wrapper for any content, with a multi-click guard.',
    preview: g('pressable'),
    render: () => (
      <>
        <Case label="Default (0.6 opacity)">
          <Pressable onPress={() => {}} style={styles.pressBox}>
            <PBold color="onPrimary">Press me</PBold>
          </Pressable>
        </Case>
        <Case label="Subtle (0.85 opacity)">
          <Pressable onPress={() => {}} activeOpacity={0.85} style={styles.pressBoxAlt}>
            <PBold>Softer dim</PBold>
          </Pressable>
        </Case>
      </>
    ),
  },
  {
    slug: 'image',
    title: 'Image',
    description: 'expo-image wrapper — blurhash placeholder, aspect ratios, radii, fit.',
    preview: g('image'),
    render: () => (
      <>
        <Case label="Aspect ratios">
          <View style={styles.row}>
            <View style={styles.imgCell}>
              <Image uri={g('img-1')} aspectRatio={1} radius="md" />
            </View>
            <View style={styles.imgCell}>
              <Image uri={g('img-2')} aspectRatio={0.75} radius="md" />
            </View>
          </View>
        </Case>
        <Case label="Radii">
          <View style={styles.row}>
            <View style={styles.imgCell}>
              <Image uri={g('img-3')} aspectRatio={1} radius="none" />
            </View>
            <View style={styles.imgCell}>
              <Image uri={g('img-4')} aspectRatio={1} radius="lg" />
            </View>
            <View style={styles.imgCell}>
              <Image uri={g('img-5')} aspectRatio={1} radius="pill" />
            </View>
          </View>
        </Case>
        <Case label="contentFit: contain">
          <Image uri={g('img-6')} aspectRatio={1.6} radius="md" contentFit="contain" />
        </Case>
      </>
    ),
  },
  {
    slug: 'badge',
    title: 'Badge',
    description: 'Small status pill — sale, new, counts. Five tones.',
    preview: g('badge'),
    render: () => (
      <>
        <Case label="Tones">
          <View style={styles.row}>
            <Badge tone="primary">NEW</Badge>
            <Badge tone="accent">HOT</Badge>
            <Badge tone="success">IN STOCK</Badge>
            <Badge tone="danger">SALE</Badge>
            <Badge tone="neutral">DRAFT</Badge>
          </View>
        </Case>
        <Case label="On a label">
          <View style={styles.row}>
            <ButtonText>Cart</ButtonText>
            <Badge tone="danger">3</Badge>
          </View>
        </Case>
      </>
    ),
  },
  {
    slug: 'header',
    title: 'Headers',
    description: 'AppHeader chrome (back/close, centered title) and the editorial ScreenHeader.',
    preview: g('header'),
    render: () => (
      <>
        <Case label="Solid chrome (pushed screens)">
          <View style={styles.headerDemo}>
            <AppHeader titleTx="components.title" topInset={false} />
          </View>
        </Case>
        <Case label="Close chrome (modals)">
          <View style={styles.headerDemo}>
            <AppHeader titleTx="modal.title" close topInset={false} />
          </View>
        </Case>
        <Case label="ScreenHeader (tab screens)">
          <ScreenHeader titleTx="catalog.title" topInset={false} />
        </Case>
      </>
    ),
  },
];

export function getEntry(slug: string): GalleryEntry | undefined {
  return GALLERY.find(e => e.slug === slug);
}

const styles = StyleSheet.create(theme => ({
  case: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  caseBody: {
    gap: theme.spacing.sm,
  },
  headerDemo: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidths.thin,
    overflow: 'hidden',
  },
  imgCell: {
    width: { xs: 100, md: 120 },
  },
  mediaBody: {
    gap: theme.spacing.xxs,
    padding: theme.spacing.lg,
  },
  mediaCard: {
    overflow: 'hidden',
  },
  pressBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  pressBoxAlt: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidths.thin,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
}));
