/**
 * Persisted app settings — the single source of truth for the user's
 * appearance choices: brand theme, light/dark mode, font, corner radius, and
 * language (which also drives RTL).
 *
 * Persisted to MMKV (native) / localStorage (web) via zustand `persist`.
 * The ThemeController subscribes to this store and pushes changes into
 * UnistylesRuntime + I18nManager.
 */
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { DEFAULT_BRAND, type BrandKey } from '@/theme/brands';
import { DEFAULT_FONT, type FontFamilyKey } from '@/theme/fonts';
import type { ThemeMode } from '@/theme/mode';
import { DEFAULT_RADIUS, type RadiusSetting } from '@/theme/radius';
import { zustandStorage } from './kv';

export type Language = 'en' | 'ar';

const PERSIST_KEY = 'settings';
const PERSIST_VERSION = 1;

export type SettingsState = {
  brand: BrandKey;
  mode: ThemeMode;
  font: FontFamilyKey;
  /** Shape override; `'brand'` follows the active brand's own profile. */
  radius: RadiusSetting;
  language: Language;
};

export type SettingsActions = {
  setBrand: (brand: BrandKey) => void;
  setMode: (mode: ThemeMode) => void;
  setFont: (font: FontFamilyKey) => void;
  setRadius: (radius: RadiusSetting) => void;
  setLanguage: (language: Language) => void;
  reset: () => void;
};

export const DEFAULT_SETTINGS: SettingsState = {
  brand: DEFAULT_BRAND,
  mode: 'system',
  font: DEFAULT_FONT,
  radius: DEFAULT_RADIUS,
  language: 'en',
};

export const useSettings = create<SettingsState & SettingsActions>()(
  // devtools outermost (recommended order: devtools → persist → …) so it sees
  // every action, including rehydration. No-op without the browser extension.
  devtools(
    persist(
      (set) => ({
        ...DEFAULT_SETTINGS,
        setBrand: (brand) => set({ brand }, false, 'settings/setBrand'),
        setMode: (mode) => set({ mode }, false, 'settings/setMode'),
        setFont: (font) => set({ font }, false, 'settings/setFont'),
        setRadius: (radius) => set({ radius }, false, 'settings/setRadius'),
        setLanguage: (language) => set({ language }, false, 'settings/setLanguage'),
        reset: () => set({ ...DEFAULT_SETTINGS }, false, 'settings/reset'),
      }),
      {
        name: PERSIST_KEY,
        version: PERSIST_VERSION,
        storage: createJSONStorage(() => zustandStorage),
        // Persist state only — never the actions.
        partialize: (s) => ({
          brand: s.brand,
          mode: s.mode,
          font: s.font,
          radius: s.radius,
          language: s.language,
        }),
      }
    ),
    { name: 'SettingsStore', enabled: __DEV__ }
  )
);

/**
 * Reads persisted settings SYNCHRONOUSLY, straight from storage — used before
 * React mounts (Unistyles `initialTheme`, RTL bootstrap) where the store's
 * hydration may not be observable yet. Falls back to defaults on any error.
 */
export function readInitialSettings(): SettingsState {
  try {
    const raw = zustandStorage.getItem(PERSIST_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as { state?: Partial<SettingsState> };
    return { ...DEFAULT_SETTINGS, ...(parsed.state ?? {}) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
