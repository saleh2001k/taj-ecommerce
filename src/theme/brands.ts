/**
 * Brand registry.
 *
 * A "brand" = a full look: its own palette (light + dark) AND its own default
 * border radius profile — some brands are heavily rounded, some are sharp with
 * (almost) no radius at all. The user can override that shape from Settings
 * (see `radius.ts`); the brand's profile is what `'brand'` resolves to.
 *
 * To add a new theme: author a palette in `palettes.ts`, pick (or add) a radius
 * profile in `radius.ts`, register it here. Everything downstream (types,
 * registered themes, the theme picker UI) picks it up automatically.
 */
import {
  atelierPalette,
  forestPalette,
  oceanPalette,
  sunsetPalette,
  type PaletteVariants,
} from './palettes';
import { RADIUS_PROFILES, type RadiusProfile } from './radius';

export type BrandDefinition = {
  key: BrandKey;
  label: string;
  palette: PaletteVariants;
  /** The brand's OWN shape — used unless the user overrides the radius axis. */
  radius: RadiusProfile;
};

export const brands = {
  atelier: {
    key: 'atelier',
    label: 'Atelier',
    palette: atelierPalette,
    radius: RADIUS_PROFILES.minimal,
  },
  ocean: {
    key: 'ocean',
    label: 'Ocean',
    palette: oceanPalette,
    radius: RADIUS_PROFILES.rounded,
  },
  sunset: {
    key: 'sunset',
    label: 'Sunset',
    palette: sunsetPalette,
    radius: RADIUS_PROFILES.soft,
  },
  forest: {
    key: 'forest',
    label: 'Forest',
    palette: forestPalette,
    radius: RADIUS_PROFILES.minimal,
  },
} as const satisfies Record<string, BrandDefinition>;

export type BrandKey = 'atelier' | 'ocean' | 'sunset' | 'forest';
export type ColorScheme = 'light' | 'dark';

export const brandKeys = Object.keys(brands) as BrandKey[];
export const DEFAULT_BRAND: BrandKey = 'atelier';

/** Registered Unistyles theme name, e.g. ('ocean','dark') -> 'oceanDark'. */
export function themeName(brand: BrandKey, scheme: ColorScheme): AppThemeName {
  return `${brand}${scheme === 'dark' ? 'Dark' : 'Light'}` as AppThemeName;
}

export type AppThemeName = `${BrandKey}${'Light' | 'Dark'}`;
