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
 */
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSettings } from '@/store/settings';
import { brandKeys, brands, themeName } from './brands';
import { resolveFontFamily } from './fonts';
import { resolveScheme } from './mode';
import { resolveRadius } from './radius';

/** Every registered theme, paired with the brand it came from. */
const REGISTERED_THEMES = brandKeys.flatMap((brand) =>
  (['light', 'dark'] as const).map((scheme) => ({ brand, name: themeName(brand, scheme) }))
);

export function ThemeController() {
  const brand = useSettings((s) => s.brand);
  const mode = useSettings((s) => s.mode);
  const font = useSettings((s) => s.font);
  const radius = useSettings((s) => s.radius);

  // Activate the theme for the current brand + resolved scheme.
  useEffect(() => {
    const scheme = resolveScheme(mode);
    UnistylesRuntime.setTheme(themeName(brand, scheme));
    UnistylesRuntime.setRootViewBackgroundColor(brands[brand].palette[scheme].background);
  }, [brand, mode]);

  // Follow the OS when in system mode.
  useEffect(() => {
    if (mode !== 'system') return;
    const sub = Appearance.addChangeListener(() => {
      const scheme = resolveScheme('system');
      UnistylesRuntime.setTheme(themeName(brand, scheme));
      UnistylesRuntime.setRootViewBackgroundColor(brands[brand].palette[scheme].background);
    });
    return () => sub.remove();
  }, [mode, brand]);

  // Swap the font family on every theme so switching is instant and persistent.
  useEffect(() => {
    const family = resolveFontFamily(font);
    for (const { name } of REGISTERED_THEMES) {
      UnistylesRuntime.updateTheme(name, (theme) => ({
        ...theme,
        typography: { ...theme.typography, family },
      }));
    }
  }, [font]);

  // Swap the shape on every theme. Resolved per brand, so 'brand' restores each
  // theme's own profile rather than flattening them all to one.
  useEffect(() => {
    for (const { brand: themeBrand, name } of REGISTERED_THEMES) {
      const profile = resolveRadius(radius, brands[themeBrand].radius);
      UnistylesRuntime.updateTheme(name, (theme) => ({ ...theme, radius: profile }));
    }
  }, [radius]);

  return null;
}
