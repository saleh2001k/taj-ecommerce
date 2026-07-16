/**
 * Public theming hooks for components.
 *
 *  - `useAppTheme()`    → the active theme object (colors, radius, spacing…).
 *  - `useThemeControls()` → current appearance choices + setters + option lists,
 *                            for building settings UI (theme/font/mode/lang pickers).
 *
 * Display labels for brands/modes/languages live in i18n resources
 * (`brands.*`, `modes.*`, `languages.*`) — options here are keys only.
 */
import { useUnistyles } from 'react-native-unistyles';
import { useShallow } from 'zustand/react/shallow';

import { changeAppLanguage } from '@/i18n/language';
import { DEFAULT_SETTINGS, useSettings, type Language } from '@/store/settings';
import { brandKeys, type BrandKey } from './brands';
import type { AppTheme } from './createTheme';
import { FONTS, fontKeys, type FontFamilyKey } from './fonts';
import type { ThemeMode } from './mode';
import { radiusSettings, type RadiusSetting } from './radius';
import { isRTL } from './rtl';

/** The active theme. Use in components that read theme outside StyleSheet.create. */
export function useAppTheme(): AppTheme {
  return useUnistyles().theme as AppTheme;
}

export type ThemeControls = {
  brand: BrandKey;
  mode: ThemeMode;
  font: FontFamilyKey;
  radius: RadiusSetting;
  language: Language;
  isDark: boolean;
  isRTL: boolean;

  setBrand: (brand: BrandKey) => void;
  setMode: (mode: ThemeMode) => void;
  setFont: (font: FontFamilyKey) => void;
  setRadius: (radius: RadiusSetting) => void;
  /** Flips direction in place (native + web) then swaps strings — no reload. */
  setLanguage: (language: Language) => void;
  reset: () => void;

  brandOptions: BrandKey[];
  fontOptions: { key: FontFamilyKey; label: string; sample: string }[];
  modeOptions: ThemeMode[];
  radiusOptions: RadiusSetting[];
  languageOptions: Language[];
};

// Font labels are typeface names (proper nouns) — not translated.
const FONT_OPTIONS = fontKeys.map((k) => ({
  key: k,
  label: FONTS[k].label,
  sample: FONTS[k].sample,
}));
const MODE_OPTIONS: ThemeMode[] = ['system', 'light', 'dark'];
const LANGUAGE_OPTIONS: Language[] = ['en', 'ar'];

export function useThemeControls(): ThemeControls {
  const theme = useAppTheme();
  const { brand, mode, font, radius, language, setBrand, setMode, setFont, setRadius, reset } =
    useSettings(
      useShallow((s) => ({
        brand: s.brand,
        mode: s.mode,
        font: s.font,
        radius: s.radius,
        language: s.language,
        setBrand: s.setBrand,
        setMode: s.setMode,
        setFont: s.setFont,
        setRadius: s.setRadius,
        reset: s.reset,
      }))
    );

  return {
    brand,
    mode,
    font,
    radius,
    language,
    isDark: theme.isDark,
    isRTL: isRTL(language),

    setBrand,
    setMode,
    setFont,
    setRadius,
    setLanguage: (next) => {
      if (next === language) return;
      void changeAppLanguage(next);
    },
    reset: () => {
      reset();
      // Reset includes language — re-align direction + strings, in place.
      if (language !== DEFAULT_SETTINGS.language) {
        void changeAppLanguage(DEFAULT_SETTINGS.language);
      }
    },

    brandOptions: brandKeys,
    fontOptions: FONT_OPTIONS,
    modeOptions: MODE_OPTIONS,
    radiusOptions: radiusSettings,
    languageOptions: LANGUAGE_OPTIONS,
  };
}
