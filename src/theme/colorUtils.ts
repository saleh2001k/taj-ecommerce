/**
 * Small, dependency-free color helpers used to DERIVE colors from the 10
 * hand-authored palette roles (contrasting text colors, translucent overlays…).
 */

function parseHex(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(h, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

/** WCAG relative luminance (0 = black, 1 = white). */
export function luminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Pick a readable foreground (near-black or near-white) for a given bg color. */
export function onColor(background: string, dark = '#0B0B0B', light = '#FFFFFF'): string {
  return luminance(background) > 0.5 ? dark : light;
}

/** Add alpha to a hex color -> `rgba(...)`. `a` in [0,1]. */
export function withAlpha(hex: string, a: number): string {
  const { r, g, b } = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
