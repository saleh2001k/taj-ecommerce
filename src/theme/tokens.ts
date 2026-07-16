/**
 * Global design tokens — SHARED across every brand theme and color scheme.
 *
 * These never change when the user switches brand / light-dark. Only the
 * palette and the radius profile are per-theme (see `palettes.ts` / `brands.ts`).
 *
 * Rule for the whole app: NO hardcoded style values. Everything a component
 * needs (space, size, weight, z-index, timing…) comes from a token here or
 * from the active theme.
 */

/** 4pt spacing grid. */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

/** Multiply the base unit — `theme.gap(3)` === 12. */
export const BASE_UNIT = 4;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
  display: 44,
} as const;

export const lineHeights = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 26,
  xl: 30,
  xxl: 36,
  xxxl: 42,
  display: 52,
} as const;

/** Semantic weight names → the font-weight *slot* they map to (see fonts.ts). */
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const letterSpacing = {
  tighter: -0.6,
  tight: -0.3,
  normal: 0,
  wide: 0.3,
  wider: 0.6,
} as const;

export const borderWidths = {
  none: 0,
  thin: 1,
  thick: 2,
} as const;

export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 44,
} as const;

export const opacity = {
  transparent: 0,
  disabled: 0.4,
  muted: 0.7,
  pressed: 0.6,
  overlay: 0.5,
  full: 1,
} as const;

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  toast: 1400,
  tooltip: 1500,
} as const;

export const durations = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

/** cubic-bezier tuples, ready for Reanimated `Easing.bezier(...)`. */
export const easing = {
  standard: [0.2, 0, 0, 1],
  decelerate: [0, 0, 0, 1],
  accelerate: [0.3, 0, 1, 1],
} as const;

export const hitSlop = {
  sm: { top: 4, bottom: 4, left: 4, right: 4 },
  md: { top: 8, bottom: 8, left: 8, right: 8 },
  lg: { top: 12, bottom: 12, left: 12, right: 12 },
} as const;

/** Max content widths for centering/capping layout on large screens. */
export const layout = {
  /** Reading-width cap for page content. */
  contentMaxWidth: 960,
  /** Wider cap for the website top nav bar. */
  navMaxWidth: 1120,
} as const;

/**
 * Structural shadow/elevation recipes (color is injected per-theme so dark
 * themes get stronger, higher-contrast shadows).
 */
export const elevation = {
  none: { offset: { width: 0, height: 0 }, radius: 0, elevation: 0, opacity: 0 },
  sm: { offset: { width: 0, height: 1 }, radius: 2, elevation: 1, opacity: 0.12 },
  md: { offset: { width: 0, height: 4 }, radius: 8, elevation: 4, opacity: 0.16 },
  lg: { offset: { width: 0, height: 8 }, radius: 16, elevation: 8, opacity: 0.2 },
  xl: { offset: { width: 0, height: 16 }, radius: 24, elevation: 16, opacity: 0.24 },
} as const;

export type SpacingToken = keyof typeof spacing;
export type FontSizeToken = keyof typeof fontSizes;
export type FontWeightToken = keyof typeof fontWeights;
export type ElevationToken = keyof typeof elevation;
