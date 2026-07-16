/**
 * i18next setup — translation runtime.
 *
 * Initialized SYNCHRONOUSLY (`initAsync: false` + bundled resources) with
 * the persisted language, so the very first render — including web static
 * rendering — already has the right strings. No loading state, no flash.
 *
 * Language CHANGES go through `changeAppLanguage` (./language.ts), which flips
 * the layout direction first, then swaps strings — see the react-native-rtl
 * integration notes.
 */
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { readInitialSettings } from '@/store/settings';
import { ar } from './locales/ar';
import { en } from './locales/en';

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

/** Typed `t()` — keys autocomplete and typos are compile errors. */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: (typeof resources)['en'];
  }
}

void i18next.use(initReactI18next).init({
  resources,
  lng: readInitialSettings().language,
  fallbackLng: 'en',
  // All resources are bundled — init synchronously so t() works immediately
  // (critical for web static rendering, which renders in the same tick).
  initAsync: false,
  interpolation: {
    // React already escapes interpolated values.
    escapeValue: false,
  },
});

export default i18next;
