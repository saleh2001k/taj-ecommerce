/**
 * Radius — the theme's SHAPE axis.
 *
 * Each brand ships its own profile (that's why Ocean is rounded, Sunset soft and
 * Forest architectural), and the user can override it with any named profile
 * here — including `sharp`, which has no radius at all.
 *
 * The active profile lives in `theme.radius` and is swapped at runtime by the
 * ThemeController via `UnistylesRuntime.updateTheme`, exactly like the font.
 */

/**
 * Radius scale. `none` is always 0.
 *
 * `pill` is NOT a constant 999 — it means "as round as this profile's shape
 * language allows". A capsule chip inside an architectural theme contradicts
 * the whole point of the axis, so square-ish profiles flatten it. Keeping it
 * pinned at 999 makes the axis look broken: chips are the most common surface
 * in the UI, so every profile but `sharp` would render identically.
 */
export type RadiusProfile = {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
};

export const RADIUS_PROFILES = {
  /** No radius at all — every corner square, pills included. */
  sharp: { none: 0, sm: 0, md: 0, lg: 0, xl: 0, pill: 0 },
  /** Architectural — barely there; pills stay near-square to match. */
  minimal: { none: 0, sm: 0, md: 2, lg: 4, xl: 6, pill: 4 },
  /** Friendly default — true capsules. */
  rounded: { none: 0, sm: 6, md: 10, lg: 16, xl: 24, pill: 999 },
  /** Soft & generous. */
  soft: { none: 0, sm: 12, md: 18, lg: 26, xl: 36, pill: 999 },
  /** Maximal — everything reads as a capsule. */
  round: { none: 0, sm: 16, md: 24, lg: 32, xl: 44, pill: 999 },
} as const satisfies Record<string, RadiusProfile>;

export type RadiusKey = keyof typeof RADIUS_PROFILES;

/** `'brand'` = follow the active brand's own shape (the default). */
export type RadiusSetting = 'brand' | RadiusKey;

export const radiusKeys = Object.keys(RADIUS_PROFILES) as RadiusKey[];
export const DEFAULT_RADIUS: RadiusSetting = 'brand';

/** All pickable values, brand default first. */
export const radiusSettings: RadiusSetting[] = ['brand', ...radiusKeys];

/**
 * Resolve the profile to apply. Takes the brand's own profile as an argument
 * (rather than importing the brand registry) to keep this module cycle-free.
 */
export function resolveRadius(setting: RadiusSetting, brandProfile: RadiusProfile): RadiusProfile {
  return setting === 'brand' ? brandProfile : RADIUS_PROFILES[setting];
}
