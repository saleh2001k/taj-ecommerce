/**
 * Public theme API. Import from `@/theme`.
 *
 * NOTE: styling is done via `StyleSheet` from `react-native-unistyles`, which
 * injects the active theme into `StyleSheet.create(theme => …)`. These exports
 * are for reading the theme in logic, building settings UI, and configuration.
 */
// Side-effect FIRST: guarantees StyleSheet.configure() has run before any
// component in this graph calls StyleSheet.create() (critical for web SSR,
// where route modules load outside the /index.ts entry).
import './unistyles';

export { ThemeController } from './ThemeController';
export { useAppTheme, useThemeControls, type ThemeControls } from './hooks';

export { brands, brandKeys, themeName, DEFAULT_BRAND } from './brands';
export type { BrandKey, ColorScheme, AppThemeName } from './brands';

export { RADIUS_PROFILES, radiusKeys, radiusSettings, resolveRadius, DEFAULT_RADIUS } from './radius';
export type { RadiusProfile, RadiusKey, RadiusSetting } from './radius';

export { FONTS, fontKeys, DEFAULT_FONT, useAppFonts, resolveFontFamily } from './fonts';
export type { FontFamilyKey, FontWeightSlot, FontFamilyMap } from './fonts';

export { resolveScheme, type ThemeMode } from './mode';
export { applyLanguageDirection, isRTL } from './rtl';

export type { AppTheme } from './createTheme';
export type { Palette, PaletteVariants } from './palettes';
export { breakpoints, type AppBreakpoints } from './breakpoints';
