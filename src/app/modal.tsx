import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { Card, Divider, Screen, Text } from '@/components/ui';

export default function ModalScreen() {
  const { t } = useTranslation();

  return (
    <Screen scroll insets="all">
      <Text variant="h2" style={styles.title}>
        {t('modal.title')}
      </Text>
      <Card>
        <Text variant="title">{t('modal.cardTitle')}</Text>
        <Divider />
        <Text variant="body" color="textMuted">
          {t('modal.cardBody')}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create((theme) => ({
  title: {
    marginBottom: theme.spacing.lg,
  },
}));
