import { router } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Caption, Card, H4, Image, P, Screen, ScreenHeader } from '@/components/ui';
import { GALLERY, type GalleryEntry } from '@/components/gallery/registry';

export default function ComponentsScreen() {
  return (
    <Screen scroll underWebNav>
      <ScreenHeader titleTx="components.title" style={styles.header}>
        <P color="textMuted" tx="components.subtitle" style={styles.subtitle} />
      </ScreenHeader>

      <View style={styles.grid}>
        {GALLERY.map(entry => (
          <View key={entry.slug} style={styles.cell}>
            <GalleryRow entry={entry} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

function GalleryRow({ entry }: { entry: GalleryEntry }) {
  return (
    <Card
      padded={false}
      onPress={() => router.push(`/component/${entry.slug}`)}
      style={styles.card}
    >
      <View style={styles.row}>
        <View style={styles.thumb}>
          <Image uri={entry.preview} aspectRatio={1} radius="none" />
        </View>
        <View style={styles.text}>
          <H4>{entry.title}</H4>
          <Caption color="textMuted" numberOfLines={2}>
            {entry.description}
          </Caption>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create(theme => ({
  card: {
    overflow: 'hidden',
  },
  cell: {
    width: { xs: '100%', md: '48%' },
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  text: {
    flex: 1,
    gap: theme.spacing.xxs,
    paddingRight: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  thumb: {
    width: { xs: 84, md: 96 },
  },
}));
