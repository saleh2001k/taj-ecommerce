import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/components/ui';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.container}>
        <Text variant="h3">{t('notFound.message')}</Text>
        <Link href="/" style={styles.link}>
          <Text variant="button" color="primary">
            {t('notFound.goHome')}
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  link: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
}));
