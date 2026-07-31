/**
 * Web stub for the floating tab bar (see `FloatingTabBar.tsx`).
 *
 * The bar is Android-only — `(tabs)/_layout.tsx` renders the website nav on web
 * and `NativeTabs` on iOS — but the layout imports it unconditionally. This stub
 * keeps the bar (and its native-leaning deps: blur, svg, reanimated worklets)
 * out of the web bundle entirely.
 */
export function FloatingTabBar(): null {
  return null;
}
