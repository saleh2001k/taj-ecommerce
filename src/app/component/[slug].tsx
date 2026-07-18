import { Stack, useLocalSearchParams } from 'expo-router';

import { AppHeader, H1, P, Screen } from '@/components/ui';
import { getEntry } from '@/components/gallery/registry';

export default function ComponentDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const entry = getEntry(slug);

  if (!entry) {
    return (
      <Screen scroll header={<AppHeader titleTx="components.title" />}>
        <Stack.Screen options={{ title: '' }} />
        <P color="textMuted" tx="catalog.empty" />
      </Screen>
    );
  }

  return (
    <Screen scroll insets="bottom" header={<AppHeader title={entry.title} />}>
      <Stack.Screen options={{ title: entry.title }} />
      <H1>{entry.title}</H1>
      <P color="textMuted">{entry.description}</P>
      {entry.render()}
    </Screen>
  );
}
