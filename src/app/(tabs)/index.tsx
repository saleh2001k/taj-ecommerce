import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, Card, Divider, Screen, Text } from '@/components/ui';
import { useAppTheme, useThemeControls } from '@/theme';

/** The 10 hand-authored semantic roles, for the palette preview. */
const PALETTE_ROLES = [
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
  'text',
  'textMuted',
  'border',
  'success',
  'danger',
] as const;

export default function ShowcaseScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const { brand, mode, font, fontOptions } = useThemeControls();

  return (
    <Screen scroll>
      <Text variant="h1">{t('showcase.title')}</Text>
      <Text variant="body" color="textMuted" style={styles.subtitle}>
        {t('showcase.subtitle', {
          brand: t(`brands.${brand}`),
          mode: t(`modes.${mode}`),
          font: fontOptions.find((f) => f.key === font)?.label ?? font,
        })}
      </Text>

      <Section title={t('showcase.paletteSection')}>
        <View style={styles.swatchGrid}>
          {PALETTE_ROLES.map((role) => (
            <View key={role} style={styles.swatchItem}>
              <View style={styles.swatch(theme.colors[role])} />
              {/* Token identifiers, not prose — intentionally untranslated. */}
              <Text variant="caption" color="textMuted" numberOfLines={1}>
                {role}
              </Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title={t('showcase.typographySection')}>
        <Text variant="display">{t('showcase.display')}</Text>
        <Text variant="h2">{t('showcase.heading')}</Text>
        <Text variant="title">{t('showcase.titleSample')}</Text>
        <Text variant="body">{t('showcase.bodySample')}</Text>
        <Text variant="caption" color="textMuted">
          {t('showcase.captionSample')}
        </Text>
      </Section>

      <Section title={t('showcase.buttonsSection')}>
        <View style={styles.row}>
          <Button title={t('showcase.buttonPrimary')} variant="primary" />
          <Button title={t('showcase.buttonSecondary')} variant="secondary" />
          <Button title={t('showcase.buttonAccent')} variant="accent" />
        </View>
        <View style={styles.row}>
          <Button title={t('showcase.buttonOutline')} variant="outline" />
          <Button title={t('showcase.buttonGhost')} variant="ghost" />
          <Button title={t('showcase.buttonDanger')} variant="danger" />
        </View>
        <Button title={t('showcase.buttonLoading')} fullWidth loading style={styles.fullBtn} />
      </Section>

      <Section title={t('showcase.radiusSection')}>
        <Text variant="caption" color="textMuted" style={styles.subtitle}>
          {t('showcase.radiusHint')}
        </Text>
        <View style={styles.row}>
          <Card style={styles.radiusBox}>
            <Text variant="label" align="center">
              sm
            </Text>
          </Card>
          <View style={styles.radiusBoxLg(theme.radius.lg)}>
            <Text variant="label" align="center" color="onPrimary">
              lg
            </Text>
          </View>
          <View style={styles.radiusBoxXl(theme.radius.xl)}>
            <Text variant="label" align="center" color="onAccent">
              xl
            </Text>
          </View>
        </View>
      </Section>

      <Card>
        <Text variant="title">{t('showcase.cardTitle')}</Text>
        <Divider />
        <Text variant="body" color="textMuted">
          {t('showcase.cardBody')}
        </Text>
      </Card>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="h3" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  subtitle: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  fullBtn: {
    marginTop: theme.spacing.sm,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  swatchItem: {
    // Responsive columns: 3 on phones, 5 on tablets, 10 on desktop.
    width: { xs: '30%', md: '17%', xl: '8%' },
    gap: theme.spacing.xs,
  },
  swatch: (color: string) => ({
    height: theme.spacing.xxxl,
    borderRadius: theme.radius.md,
    borderWidth: theme.borderWidths.thin,
    borderColor: theme.colors.border,
    backgroundColor: color,
  }),
  radiusBox: {
    width: theme.spacing.huge,
    height: theme.spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusBoxLg: (radius: number) => ({
    width: theme.spacing.huge,
    height: theme.spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius,
    backgroundColor: theme.colors.primary,
  }),
  radiusBoxXl: (radius: number) => ({
    width: theme.spacing.huge,
    height: theme.spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius,
    backgroundColor: theme.colors.accent,
  }),
}));
