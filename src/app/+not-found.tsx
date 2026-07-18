import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppHeader, ButtonText, H3, Screen } from '@/components/ui';

export default function NotFoundScreen() {
  // Navigation options take a plain string, not a component.
  const { t } = useTranslation();

  return (
    <Screen padded={false} header={<AppHeader titleTx="notFound.title" />}>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.container}>
        <H3 tx="notFound.message" />
        <Link href="/" style={styles.link}>
          <ButtonText tx="notFound.goHome" color="primary" />
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  link: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
}));
