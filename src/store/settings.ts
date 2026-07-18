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
// v2 (2026-07-18): the app shipped its redesign with the new 'atelier' house
// brand as the default. The migration drops only the persisted `brand`, so
// existing installs see the new look while keeping their mode/font/language.
const PERSIST_VERSION = 2;

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
      set => ({
        ...DEFAULT_SETTINGS,
        setBrand: brand => set({ brand }, false, 'settings/setBrand'),
        setMode: mode => set({ mode }, false, 'settings/setMode'),
        setFont: font => set({ font }, false, 'settings/setFont'),
        setRadius: radius => set({ radius }, false, 'settings/setRadius'),
        setLanguage: language => set({ language }, false, 'settings/setLanguage'),
        reset: () => set({ ...DEFAULT_SETTINGS }, false, 'settings/reset'),
      }),
      {
        name: PERSIST_KEY,
        version: PERSIST_VERSION,
        storage: createJSONStorage(() => zustandStorage),
        // Persist state only — never the actions.
        partialize: s => ({
          brand: s.brand,
          mode: s.mode,
          font: s.font,
          radius: s.radius,
          language: s.language,
        }),
        migrate: (persisted, version) => {
          const state = { ...((persisted ?? {}) as Partial<SettingsState>) };
          if (version < 2) delete state.brand;
          return { ...DEFAULT_SETTINGS, ...state };
        },
      },
    ),
    { name: 'SettingsStore', enabled: __DEV__ },
  ),
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
    const parsed = JSON.parse(raw) as { state?: Partial<SettingsState>; version?: number };
    const state = { ...(parsed.state ?? {}) };
    // Mirror the persist `migrate` above: this sync path runs BEFORE the store
    // hydrates (Unistyles initialTheme), so it must apply the same v2 rule or
    // the first paint would use the pre-migration brand.
    if ((parsed.version ?? 0) < 2) delete state.brand;
    return { ...DEFAULT_SETTINGS, ...state };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
