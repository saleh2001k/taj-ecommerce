/**
 * English strings — the SOURCE locale.
 *
 * `en` defines the canonical shape; every other locale must implement
 * `AppTranslation` (derived from this object), so adding/removing a key here
 * is a compile error until all locales are updated.
 */
export const en = {
  nav: {
    brand: 'Shop',
    showcase: 'Showcase',
    settings: 'Settings',
    about: 'About',
    modalTitle: 'About',
  },

  showcase: {
    title: 'Theme Showcase',
    subtitle: 'Brand: {{brand}}  ·  Mode: {{mode}}  ·  Font: {{font}}',
    paletteSection: 'Palette · 10 roles (light + dark)',
    typographySection: 'Typography',
    display: 'Display',
    heading: 'Heading',
    titleSample: 'Title',
    bodySample: 'Body — the quick brown fox. النص العربي هنا.',
    captionSample: 'Caption / muted',
    buttonsSection: 'Buttons',
    buttonPrimary: 'Primary',
    buttonSecondary: 'Secondary',
    buttonAccent: 'Accent',
    buttonOutline: 'Outline',
    buttonGhost: 'Ghost',
    buttonDanger: 'Danger',
    buttonLoading: 'Full width · loading',
    radiusSection: 'Radius (theme shape)',
    radiusHint:
      'Each brand ships its own shape — Ocean is rounded, Sunset is soft, Forest is minimal. Override it from Settings.',
    cardTitle: 'Elevated Card',
    cardBody:
      'Surface + border + brand radius + scheme-aware shadow. Everything here is driven by tokens — no hardcoded values.',
  },

  settings: {
    title: 'Appearance',
    intro: 'Everything below persists to storage and applies instantly.',
    brandField: 'Brand theme',
    modeField: 'Mode',
    fontField: 'Font',
    radiusField: 'Corner radius',
    languageField: 'Language / direction',
    rtlNote: 'Switching to العربية flips the whole layout to RTL instantly — no reload.',
    reset: 'Reset to defaults',
  },

  modal: {
    title: 'About',
    cardTitle: 'Dynamic theming',
    cardBody:
      'This app uses Unistyles 3.3 with multiple brand themes (each with light + dark, 10 semantic colors, and its own radius), 4 selectable Arabic/English fonts, full runtime RTL, MMKV-persisted settings, and responsive tablet/desktop layouts.',
  },

  notFound: {
    title: 'Oops!',
    message: "This screen doesn't exist.",
    goHome: 'Go to home screen',
  },

  brands: {
    ocean: 'Ocean',
    sunset: 'Sunset',
    forest: 'Forest',
  },

  modes: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },

  radius: {
    brand: 'Theme default',
    sharp: 'Sharp',
    minimal: 'Minimal',
    rounded: 'Rounded',
    soft: 'Soft',
    round: 'Round',
  },

  /** Language names stay in their OWN language (endonyms) — never translated. */
  languages: {
    en: 'English',
    ar: 'العربية',
  },
} as const;

/** Values every locale must provide: same keys as `en`, string leaves. */
export type AppTranslation = DeepStringify<typeof en>;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};
