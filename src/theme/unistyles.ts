/**
 * Unistyles configuration — the single place `StyleSheet.configure` is called.
 *
 * MUST be imported before any `StyleSheet.create` runs (see /index.ts and
 * app/+html.tsx). Registers every brand × {light,dark} theme, the responsive
 * breakpoints, and the initial theme resolved from persisted settings so the
 * first paint already matches the user's saved choice (no flash).
 */
import { StyleSheet } from 'react-native-unistyles';
import { readInitialSettings } from '@/store/settings';
import { brandKeys, themeName, type AppThemeName } from './brands';
import { breakpoints, type AppBreakpoints } from './breakpoints';
import { createTheme, type AppTheme } from './createTheme';
import { resolveScheme } from './mode';

const initial = readInitialSettings();

// brand × {light, dark}  ->  { oceanLight, oceanDark, sunsetLight, ... }
const themes = brandKeys.reduce(
  (acc, brand) => {
    acc[themeName(brand, 'light')] = createTheme(brand, 'light', initial.font, initial.radius);
    acc[themeName(brand, 'dark')] = createTheme(brand, 'dark', initial.font, initial.radius);
    return acc;
  },
  {} as Record<AppThemeName, AppTheme>,
);

type AppThemes = typeof themes;

/* eslint-disable @typescript-eslint/no-empty-object-type --
 * Unistyles registers our theme/breakpoint types by module augmentation, and
 * augmenting an interface REQUIRES the empty-extends form (a type alias can't
 * merge into a declared interface). Not a mistake, and there is no alternative. */
declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

StyleSheet.configure({
  themes,
  breakpoints,
  settings: {
    // We manage light/dark ourselves (multiple brands), so no `adaptiveThemes`.
    initialTheme: () => themeName(initial.brand, resolveScheme(initial.mode)),
    // CSSVars stays on (default) for flicker-free theming on web.
  },
});
