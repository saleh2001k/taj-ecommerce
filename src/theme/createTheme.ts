/**
 * Theme assembler.
 *
 * Combines the global tokens + a brand's palette (for a given light/dark scheme)
 * + that brand's radius profile + the initial font, and DERIVES everything else
 * (contrasting foreground colors, tinted surfaces, scheme-aware shadows).
 *
 * Every registered Unistyles theme is produced by this one function, so all
 * themes are guaranteed to share the exact same shape (a Unistyles requirement).
 */
import { brands, themeName, type BrandKey, type ColorScheme } from './brands';
import { onColor, withAlpha } from './colorUtils';
import { DEFAULT_FONT, resolveFontFamily, type FontFamilyKey } from './fonts';
import { DEFAULT_RADIUS, resolveRadius, type RadiusSetting } from './radius';
import {
  BASE_UNIT,
  borderWidths,
  durations,
  easing,
  elevation,
  fontSizes,
  fontWeights,
  hitSlop,
  iconSizes,
  layout,
  letterSpacing,
  lineHeights,
  opacity,
  spacing,
  zIndex,
  type ElevationToken,
} from './tokens';

function buildShadows(isDark: boolean) {
  const make = (token: ElevationToken) => {
    const e = elevation[token];
    return {
      shadowColor: '#000000',
      shadowOffset: e.offset,
      shadowRadius: e.radius,
      // Dark, high-contrast surfaces need stronger shadows to read at all.
      shadowOpacity: isDark ? Math.min(1, e.opacity * 1.7) : e.opacity,
      elevation: e.elevation,
    };
  };
  return {
    none: make('none'),
    sm: make('sm'),
    md: make('md'),
    lg: make('lg'),
    xl: make('xl'),
  };
}

export function createTheme(
  brand: BrandKey,
  scheme: ColorScheme,
  font: FontFamilyKey = DEFAULT_FONT,
  radius: RadiusSetting = DEFAULT_RADIUS
) {
  const def = brands[brand];
  const p = def.palette[scheme];
  const isDark = scheme === 'dark';

  return {
    name: themeName(brand, scheme),
    brand,
    scheme,
    isDark,

    colors: {
      // ── the 10 hand-authored roles ──
      primary: p.primary,
      secondary: p.secondary,
      accent: p.accent,
      background: p.background,
      surface: p.surface,
      text: p.text,
      textMuted: p.textMuted,
      border: p.border,
      success: p.success,
      danger: p.danger,

      // ── derived: readable text on colored fills ──
      onPrimary: onColor(p.primary),
      onSecondary: onColor(p.secondary),
      onAccent: onColor(p.accent),
      onSuccess: onColor(p.success),
      onDanger: onColor(p.danger),

      // ── derived: tinted / translucent helpers ──
      primaryMuted: withAlpha(p.primary, 0.12),
      secondaryMuted: withAlpha(p.secondary, 0.12),
      accentMuted: withAlpha(p.accent, 0.12),
      successMuted: withAlpha(p.success, 0.12),
      dangerMuted: withAlpha(p.danger, 0.12),

      // ── derived: structural ──
      overlay: withAlpha('#000000', isDark ? 0.6 : 0.4),
      backdrop: withAlpha('#000000', 0.6),
      skeleton: withAlpha(p.text, 0.08),
      pressed: withAlpha(p.text, 0.08),
      inputBackground: isDark ? withAlpha(p.text, 0.05) : p.surface,
    },

    /**
     * Shape: the brand's own profile, unless the user overrode the radius axis.
     * Swapped at runtime by the ThemeController when the user picks a profile.
     */
    radius: resolveRadius(radius, def.radius),

    // Shared structural tokens.
    spacing,
    layout,
    borderWidths,
    iconSizes,
    opacity,
    zIndex,
    durations,
    easing,
    hitSlop,
    shadows: buildShadows(isDark),

    typography: {
      sizes: fontSizes,
      lineHeights,
      weights: fontWeights,
      letterSpacing,
      /** Swapped at runtime by the ThemeController when the user picks a font. */
      family: resolveFontFamily(font),
    },

    /** `theme.gap(3)` === 12 — spacing helper for arbitrary multiples. */
    gap: (multiplier: number) => multiplier * BASE_UNIT,

    utils: { onColor, withAlpha },
  };
}

/** The canonical theme shape shared by every registered theme. */
export type AppTheme = ReturnType<typeof createTheme>;
