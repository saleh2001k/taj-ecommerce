import type { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  AppHeader,
  Caption,
  Card,
  Chip,
  Divider,
  H4,
  Label,
  OutlineButton,
  Screen,
} from '@/components/ui';
import type { TxKey } from '@/components/ui';
import { brands, FONTS, resolveFontFamily, resolveRadius, useThemeControls } from '@/theme';

export default function PreferencesScreen() {
  const controls = useThemeControls();

  return (
    <Screen scroll header={<AppHeader titleTx="preferences.title" />}>
      <Caption color="textMuted" tx="settings.intro" style={styles.intro} />

      <Section titleTx="settings.appearanceSection">
        <Field tx="settings.brandField">
          {controls.brandOptions.map(brand => (
            <Chip
              key={brand}
              tx={`brands.${brand}`}
              selected={controls.brand === brand}
              onPress={() => controls.setBrand(brand)}
            />
          ))}
        </Field>
        <Divider />
        <Field tx="settings.modeField">
          {controls.modeOptions.map(m => (
            <Chip
              key={m}
              tx={`modes.${m}`}
              selected={controls.mode === m}
              onPress={() => controls.setMode(m)}
            />
          ))}
        </Field>
        <Divider />
        <Field tx="settings.fontField">
          {controls.fontOptions.map(opt => (
            <Chip
              key={opt.key}
              // Typeface names are proper nouns — never translated.
              label={FONTS[opt.key].label}
              fontFamily={resolveFontFamily(opt.key).medium}
              selected={controls.font === opt.key}
              onPress={() => controls.setFont(opt.key)}
            />
          ))}
        </Field>
        <Divider />
        <Field tx="settings.radiusField">
          {controls.radiusOptions.map(r => (
            <Chip
              key={r}
              tx={`radius.${r}`}
              // Preview each profile in its own curve. `md` is the characteristic
              // mid-scale value (what buttons use) — unlike `pill`, it differs
              // across every profile. 'brand' resolves against the ACTIVE brand,
              // so this preview also tracks the brand picker above.
              radius={resolveRadius(r, brands[controls.brand].radius).md}
              selected={controls.radius === r}
              onPress={() => controls.setRadius(r)}
            />
          ))}
        </Field>
      </Section>

      <Section titleTx="settings.languageSection">
        <Field tx="settings.languageField">
          {controls.languageOptions.map(l => (
            <Chip
              key={l}
              tx={`languages.${l}`}
              selected={controls.language === l}
              onPress={() => controls.setLanguage(l)}
            />
          ))}
        </Field>
        <Caption color="textMuted" tx="settings.rtlNote" style={styles.note} />
      </Section>

      <OutlineButton tx="settings.reset" fullWidth onPress={controls.reset} style={styles.reset} />
    </Screen>
  );
}

function Section({ titleTx, children }: { titleTx: TxKey; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <H4 tx={titleTx} style={styles.sectionTitle} />
      <Card>{children}</Card>
    </View>
  );
}

function Field({ tx, children }: { tx: TxKey; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Label tx={tx} />
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  field: {
    gap: theme.spacing.sm,
  },
  intro: {
    marginTop: theme.spacing.lg,
  },
  note: {
    marginTop: theme.spacing.md,
  },
  reset: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xxl,
  },
  section: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.xxs,
  },
}));
