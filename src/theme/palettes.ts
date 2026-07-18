/**
 * Brand color palettes.
 *
 * Each brand ships a `light` and `dark` variant of the SAME 10 semantic roles.
 * Dark variants are intentionally *higher contrast* than light: near-black
 * backgrounds, near-white text, brighter/more saturated brand colors, and more
 * visible borders.
 *
 * The 10 roles are the only colors you hand-author. Everything else a component
 * needs (onPrimary text color, overlays, skeletons…) is derived automatically
 * in `createTheme.ts`.
 */

/** The 10 semantic color roles every theme must define. */
export type Palette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  danger: string;
};

export type PaletteVariants = {
  light: Palette;
  dark: Palette;
};

/**
 * The house brand — an editorial, fashion-forward monochrome. Warm ink on
 * undyed-muslin bone, with antique brass (haberdashery hardware) as the accent
 * and a raw-denim indigo as the secondary. CTAs read as "fashion black" in
 * light mode and invert to bone in dark mode (onColor derives the flip).
 */
export const atelierPalette: PaletteVariants = {
  light: {
    primary: '#211D19',
    secondary: '#3F5573',
    accent: '#8F6A28',
    background: '#F6F3EE',
    surface: '#FFFFFF',
    text: '#211D19',
    textMuted: '#756D62',
    border: '#E6E0D6',
    success: '#3E7C4F',
    danger: '#B23B34',
  },
  dark: {
    primary: '#EDE6DB',
    secondary: '#A9BEDF',
    accent: '#E0B76F',
    background: '#141210',
    surface: '#1E1B18',
    text: '#F2EDE4',
    textMuted: '#A79D8F',
    border: '#37322B',
    success: '#6BBF7E',
    danger: '#E2695F',
  },
};

export const oceanPalette: PaletteVariants = {
  light: {
    primary: '#1C7ED6',
    secondary: '#0CA678',
    accent: '#15AABF',
    background: '#F5F8FC',
    surface: '#FFFFFF',
    text: '#1A2733',
    textMuted: '#5A6B7B',
    border: '#DDE4EC',
    success: '#2F9E44',
    danger: '#E03131',
  },
  dark: {
    primary: '#4DABF7',
    secondary: '#38D9A9',
    accent: '#3BC9DB',
    background: '#0A0F14',
    surface: '#121A22',
    text: '#F1F5F9',
    textMuted: '#94A3B8',
    border: '#26323E',
    success: '#51CF66',
    danger: '#FF6B6B',
  },
};

export const sunsetPalette: PaletteVariants = {
  light: {
    primary: '#E8590C',
    secondary: '#D6336C',
    accent: '#F08C00',
    background: '#FFF8F3',
    surface: '#FFFFFF',
    text: '#2B211D',
    textMuted: '#7A6A63',
    border: '#F0E2D8',
    success: '#2F9E44',
    danger: '#E03131',
  },
  dark: {
    primary: '#FF922B',
    secondary: '#F06595',
    accent: '#FFC078',
    background: '#14100D',
    surface: '#201A15',
    text: '#FBF3EE',
    textMuted: '#C9B4A8',
    border: '#3A2E26',
    success: '#51CF66',
    danger: '#FF6B6B',
  },
};

export const forestPalette: PaletteVariants = {
  light: {
    primary: '#2B8A3E',
    secondary: '#1971C2',
    accent: '#74B816',
    background: '#F4F9F4',
    surface: '#FFFFFF',
    text: '#1B2A1E',
    textMuted: '#5C6B5E',
    border: '#DCE8DC',
    success: '#2F9E44',
    danger: '#E03131',
  },
  dark: {
    primary: '#51CF66',
    secondary: '#4DABF7',
    accent: '#A9E34B',
    background: '#0A0F0B',
    surface: '#121A13',
    text: '#EEF6EF',
    textMuted: '#94A89A',
    border: '#223026',
    success: '#69DB7C',
    danger: '#FF6B6B',
  },
};
