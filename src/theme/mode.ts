/**
 * Color-scheme resolution.
 *
 * Mode is `system | light | dark`. We manage it ourselves (rather than
 * Unistyles' built-in `adaptiveThemes`, which only supports themes literally
 * named `light`/`dark`) because we have multiple brand themes.
 */
import { Appearance } from 'react-native';
import type { ColorScheme } from './brands';

export type ThemeMode = 'system' | 'light' | 'dark';

/** Turn a mode into a concrete light/dark scheme, following the OS when 'system'. */
export function resolveScheme(mode: ThemeMode): ColorScheme {
  if (mode === 'light' || mode === 'dark') return mode;
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}
