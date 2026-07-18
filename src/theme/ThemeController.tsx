/**
 * ThemeController — bridges the persisted settings store to the Unistyles
 * runtime. Renders nothing; mount it once near the app root.
 *
 *  - brand / mode change  -> UnistylesRuntime.setTheme(...)
 *  - mode === 'system'    -> follow OS appearance changes live
 *  - font change          -> patch typography.family on every registered theme
 *  - radius change        -> patch radius on every registered theme (each brand
 *                            resolves 'brand' to its OWN shape)
 *  - keeps the native root background in sync (avoids flashes on nav)
 *  - pins the native trait (overrideUserInterfaceStyle) to the mode, so forced
 *    dark/light doesn't fight iOS's OS-driven liquid-glass appearance
 *    (see applyNativeColorScheme)
 *
 * ── Why every axis is applied from a store SUBSCRIPTION, not an effect ──
 * Unistyles turns theme COLOURS into CSS variables, so they restyle with no
 * re-render. Non-colour theme values — `borderRadius`, font family, spacing —
 * are baked into the generated style as literals at the moment a style function
 * is evaluated. So ordering decides correctness:
 *
 *   effect (WRONG):  set() -> React re-renders, baking the OLD radius/font
 *                    -> effect runs -> theme changes -> colours follow via vars,
 *                       but radius/font stay a render behind until something
 *                       else happens to re-render that component.
 *
 *   subscription (RIGHT): set() -> subscriber applies the theme synchronously
 *                         -> React re-renders and bakes the NEW values.
 *
 * zustand runs subscribers inside `set()`, before React re-renders, which is
 * exactly the hook we need. This was invisible while `useThemeControls` called
 * `useAppTheme()`: that forced an extra re-render after the effect, which
 * happened to re-bake the correct values.
 */
import { useEffect } from 'react';
import { Appearance, Platform } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSettings } from '@/store/settings';
import { brandKeys, brands, themeName, type BrandKey } from './brands';
import { resolveFontFamily, type FontFamilyKey } from './fonts';
import { resolveScheme, type ThemeMode } from './mode';
import { resolveRadius, type RadiusSetting } from './radius';

/** Every registered theme, paired with the brand it came from. */
const REGISTERED_THEMES = brandKeys.flatMap(brand =>
  (['light', 'dark'] as const).map(scheme => ({ brand, name: themeName(brand, scheme) })),
);

/**
 * Pin the NATIVE trait collection (`overrideUserInterfaceStyle`) to our theme
 * mode — the fix for the iOS liquid-glass tab bar flashing dark→light→dark on
 * tab switch.
 *
 * Our theme is managed by Unistyles and can be FORCED dark/light independent of
 * the OS. But iOS native chrome (the UITabBar's liquid glass, headers) reads its
 * light/dark from the OS trait collection, not from Unistyles. So with app
 * mode=dark on a light-mode phone, every tab transition makes iOS re-resolve the
 * tab bar against the LIGHT trait, and our dark appearance override only lands a
 * frame later — the visible flash.
 *
 * `Appearance.setColorScheme` sets the app-window override at the native level,
 * so the trait already matches our theme and there is nothing to re-resolve.
 * `'unspecified'` in system mode hands control back to the OS (where trait and
 * theme already agree). Web has no such API and no native trait, so it's skipped.
 *
 * Called ONLY on a mode change, never from the OS-change listener: in system
 * mode this is always `'unspecified'`, and re-calling it from the listener could
 * feed setColorScheme's own change event straight back into the listener.
 */
function applyNativeColorScheme(mode: ThemeMode) {
  if (Platform.OS === 'web') return;
  Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
}

function applyTheme(brand: BrandKey, mode: ThemeMode) {
  const scheme = resolveScheme(mode);
  UnistylesRuntime.setTheme(themeName(brand, scheme));
  UnistylesRuntime.setRootViewBackgroundColor(brands[brand].palette[scheme].background);
}

/** Swap the font family on every theme so switching is instant and persistent. */
function applyFont(font: FontFamilyKey) {
  const family = resolveFontFamily(font);
  for (const { name } of REGISTERED_THEMES) {
    UnistylesRuntime.updateTheme(name, theme => ({
      ...theme,
      typography: { ...theme.typography, family },
    }));
  }
}

/**
 * Swap the shape on every theme. Resolved per brand, so 'brand' restores each
 * theme's own profile rather than flattening them all to one.
 */
function applyRadius(radius: RadiusSetting) {
  for (const { brand, name } of REGISTERED_THEMES) {
    const profile = resolveRadius(radius, brands[brand].radius);
    UnistylesRuntime.updateTheme(name, theme => ({ ...theme, radius: profile }));
  }
}

// Runs synchronously inside `set()` — see the header. Order within a single
// change doesn't matter; being ahead of React's re-render does.
useSettings.subscribe((state, prev) => {
  if (state.font !== prev.font) applyFont(state.font);
  if (state.radius !== prev.radius) applyRadius(state.radius);
  if (state.brand !== prev.brand || state.mode !== prev.mode) applyTheme(state.brand, state.mode);
  if (state.mode !== prev.mode) applyNativeColorScheme(state.mode);
});

export function ThemeController() {
  const brand = useSettings(s => s.brand);
  const mode = useSettings(s => s.mode);
  const font = useSettings(s => s.font);
  const radius = useSettings(s => s.radius);

  // Initial sync — `initialTheme` and `createTheme(…, initial.font, initial.radius)`
  // already cover the first paint, so on later changes (where the subscription
  // above has always run first) these are idempotent re-applies.
  useEffect(() => {
    applyTheme(brand, mode);
  }, [brand, mode]);

  // Pin the native trait to the mode (iOS liquid-glass flash fix). Keyed on mode
  // alone — never the OS-change listener — so it can't loop on its own event.
  useEffect(() => {
    applyNativeColorScheme(mode);
  }, [mode]);

  useEffect(() => {
    applyFont(font);
  }, [font]);

  useEffect(() => {
    applyRadius(radius);
  }, [radius]);

  // Follow the OS when in system mode.
  useEffect(() => {
    if (mode !== 'system') return;
    const sub = Appearance.addChangeListener(() => applyTheme(brand, 'system'));
    return () => sub.remove();
  }, [mode, brand]);

  return null;
}
