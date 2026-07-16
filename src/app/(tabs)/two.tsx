import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, Chip, Screen, Text } from '@/components/ui';
import { brands, FONTS, resolveFontFamily, resolveRadius, useThemeControls } from '@/theme';

export default function SettingsScreen() {
  const controls = useThemeControls();
  const { t } = useTranslation();

  return (
    <Screen scroll>
      <Text variant="h2">{t('settings.title')}</Text>
      <Text variant="caption" color="textMuted" style={styles.intro}>
        {t('settings.intro')}
      </Text>

      <Field label={t('settings.brandField')}>
        {controls.brandOptions.map((brand) => (
          <Chip
            key={brand}
            label={t(`brands.${brand}`)}
            selected={controls.brand === brand}
            onPress={() => controls.setBrand(brand)}
          />
        ))}
      </Field>

      <Field label={t('settings.modeField')}>
        {controls.modeOptions.map((m) => (
          <Chip
            key={m}
            label={t(`modes.${m}`)}
            selected={controls.mode === m}
            onPress={() => controls.setMode(m)}
          />
        ))}
      </Field>

      <Field label={t('settings.fontField')}>
        {controls.fontOptions.map((opt) => (
          <Chip
            key={opt.key}
            label={FONTS[opt.key].label}
            fontFamily={resolveFontFamily(opt.key).medium}
            selected={controls.font === opt.key}
            onPress={() => controls.setFont(opt.key)}
          />
        ))}
      </Field>

      <Field label={t('settings.radiusField')}>
        {controls.radiusOptions.map((r) => (
          <Chip
            key={r}
            label={t(`radius.${r}`)}
            // Preview each profile in its own curve. `md` is the characteristic
            // mid-scale value (what buttons use) — unlike `pill`, it differs
            // across every profile, so each option shows its real shape.
            // 'brand' resolves against the ACTIVE brand, so this preview also
            // tracks the brand picker above.
            radius={resolveRadius(r, brands[controls.brand].radius).md}
            selected={controls.radius === r}
            onPress={() => controls.setRadius(r)}
          />
        ))}
      </Field>

      <Field label={t('settings.languageField')}>
        {controls.languageOptions.map((l) => (
          <Chip
            key={l}
            label={t(`languages.${l}`)}
            selected={controls.language === l}
            onPress={() => controls.setLanguage(l)}
          />
        ))}
      </Field>
      <Text variant="caption" color="textMuted" style={styles.note}>
        {t('settings.rtlNote')}
      </Text>

      <Button
        title={t('settings.reset')}
        variant="outline"
        onPress={controls.reset}
        style={styles.reset}
      />
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text variant="label" color="textMuted">
        {label}
      </Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  intro: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  field: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  note: {
    marginTop: theme.spacing.sm,
  },
  reset: {
    marginTop: theme.spacing.xxl,
  },
}));
