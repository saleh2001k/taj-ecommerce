/**
 * Text primitives — the ONLY way to render text in this app.
 *
 * One component per semantic role, so the call site says what the text IS
 * (`<H1 />`, `<Caption />`) instead of configuring a generic box
 * (`<Text variant="h1" size="xxxl" weight="bold" />`). Size and weight are the
 * component's identity and are not props; `color` and `align` are refinements.
 *
 * Every one of them:
 *  - takes `tx` — a key that must exist in en.ts / ar.ts, enforced by the type
 *    system (`children` is the explicit opt-out for non-copy values)
 *  - hugs its glyphs: no font padding, no margin, no padding, tight 1.2 leading
 *  - never re-renders on theme change (see createTextComponent.tsx)
 *
 * Scale (sizes/weights resolve against the active theme's typography tokens):
 *
 *   Display  display / bold      hero numbers & splash copy
 *   H1       xxxl    / bold      one per screen
 *   H2       xxl     / bold      major section
 *   H3       xl      / semibold  subsection
 *   H4       lg      / semibold  card & group titles
 *   P        md      / regular   body copy
 *   PBold    md      / semibold  emphasised body
 *   Label    sm      / medium    form/field labels        (muted)
 *   Caption  sm      / regular   hints, help text         (muted)
 *   Overline xs      / semibold  eyebrow text             (muted)
 *   ButtonText md    / semibold  pressable labels
 */
import { createTextComponent } from './createTextComponent';

export const Display = createTextComponent('Display', {
  size: 'display',
  weight: 'bold',
  color: 'text',
  isHeading: true,
});

export const H1 = createTextComponent('H1', {
  size: 'xxxl',
  weight: 'bold',
  color: 'text',
  isHeading: true,
});

export const H2 = createTextComponent('H2', {
  size: 'xxl',
  weight: 'bold',
  color: 'text',
  isHeading: true,
});

export const H3 = createTextComponent('H3', {
  size: 'xl',
  weight: 'semibold',
  color: 'text',
  isHeading: true,
});

export const H4 = createTextComponent('H4', {
  size: 'lg',
  weight: 'semibold',
  color: 'text',
  isHeading: true,
});

export const P = createTextComponent('P', {
  size: 'md',
  weight: 'regular',
  color: 'text',
});

export const PBold = createTextComponent('PBold', {
  size: 'md',
  weight: 'semibold',
  color: 'text',
});

export const Label = createTextComponent('Label', {
  size: 'sm',
  weight: 'medium',
  color: 'textMuted',
});

export const Caption = createTextComponent('Caption', {
  size: 'sm',
  weight: 'regular',
  color: 'textMuted',
});

export const Overline = createTextComponent('Overline', {
  size: 'xs',
  weight: 'semibold',
  color: 'textMuted',
});

export const ButtonText = createTextComponent('ButtonText', {
  size: 'md',
  weight: 'semibold',
  color: 'text',
});

export type { TextProps, TextAlign, TextColorToken } from './createTextComponent';
export { TEXT_NOT_FOUND, type TxKey, type TxOptions } from './tx';
