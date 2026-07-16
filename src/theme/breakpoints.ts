/**
 * Responsive breakpoints (px width).
 *
 * Unistyles requires the first breakpoint to be `0` to mirror CSS cascading.
 * `md` = tablet portrait, `lg` = tablet landscape / small laptop, `xl`+ = desktop.
 * Unistyles also injects built-in `portrait` / `landscape` breakpoints for free.
 */
export const breakpoints = {
  xs: 0, // phones
  sm: 480, // large phones
  md: 768, // tablets
  lg: 1024, // large tablets / small laptops
  xl: 1280, // desktop
  xxl: 1600, // large desktop
} as const;

export type AppBreakpoints = typeof breakpoints;
