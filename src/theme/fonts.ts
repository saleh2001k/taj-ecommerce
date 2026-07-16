/**
 * Fonts — the user-selectable typeface axis (independent of brand & scheme).
 *
 * 4 dual-script families (Arabic + Latin in one file, so a single choice works
 * in both languages), each with 4 weight slots. Tajawal has no 600 weight, so
 * its `semibold` slot falls back to its 700 Bold file.
 *
 * The active family lives in `theme.typography.family` and is swapped at runtime
 * by the ThemeController via `UnistylesRuntime.updateTheme`.
 */
import { useFonts } from 'expo-font';
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
} from '@expo-google-fonts/tajawal';
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from '@expo-google-fonts/rubik';

export type FontFamilyKey = 'cairo' | 'tajawal' | 'ibmPlexArabic' | 'rubik';

/** Weight slots — the same names as `fontWeights` tokens. */
export type FontWeightSlot = 'regular' | 'medium' | 'semibold' | 'bold';

/** Resolved family: one platform font name per weight slot. */
export type FontFamilyMap = Record<FontWeightSlot, string>;

type FontDefinition = {
  key: FontFamilyKey;
  label: string;
  /** Sample string shown in the picker (renders in the font itself). */
  sample: string;
  family: FontFamilyMap;
};

export const FONTS = {
  cairo: {
    key: 'cairo',
    label: 'Cairo',
    sample: 'Cairo · القاهرة',
    family: {
      regular: 'Cairo_400Regular',
      medium: 'Cairo_500Medium',
      semibold: 'Cairo_600SemiBold',
      bold: 'Cairo_700Bold',
    },
  },
  tajawal: {
    key: 'tajawal',
    label: 'Tajawal',
    sample: 'Tajawal · تجوّل',
    family: {
      regular: 'Tajawal_400Regular',
      medium: 'Tajawal_500Medium',
      semibold: 'Tajawal_700Bold', // no 600 weight — fall back to Bold
      bold: 'Tajawal_700Bold',
    },
  },
  ibmPlexArabic: {
    key: 'ibmPlexArabic',
    label: 'IBM Plex Arabic',
    sample: 'IBM Plex · بلكس',
    family: {
      regular: 'IBMPlexSansArabic_400Regular',
      medium: 'IBMPlexSansArabic_500Medium',
      semibold: 'IBMPlexSansArabic_600SemiBold',
      bold: 'IBMPlexSansArabic_700Bold',
    },
  },
  rubik: {
    key: 'rubik',
    label: 'Rubik',
    sample: 'Rubik · روبيك',
    family: {
      regular: 'Rubik_400Regular',
      medium: 'Rubik_500Medium',
      semibold: 'Rubik_600SemiBold',
      bold: 'Rubik_700Bold',
    },
  },
} as const satisfies Record<FontFamilyKey, FontDefinition>;

export const fontKeys = Object.keys(FONTS) as FontFamilyKey[];
export const DEFAULT_FONT: FontFamilyKey = 'cairo';

export function resolveFontFamily(key: FontFamilyKey): FontFamilyMap {
  return FONTS[key].family;
}

/**
 * Loads every weight of every family once at boot (all files are bundled
 * locally by the @expo-google-fonts packages — no network), so switching fonts
 * at runtime is instant. Returns `[loaded, error]`.
 */
export function useAppFonts(): [boolean, Error | null] {
  return useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_600SemiBold,
    Rubik_700Bold,
  });
}
