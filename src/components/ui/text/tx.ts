/**
 * `tx` — the typed bridge between the text components and the locale files.
 *
 * `TxKey` is derived from `en` (the canonical locale), so it is EXACTLY the set
 * of strings that exist in en.ts / ar.ts — nothing else compiles. `ar` already
 * has to satisfy `AppTranslation`, so the two files can never drift apart and
 * one key type covers both.
 */
import { useTranslation } from 'react-i18next';

import type { en } from '@/i18n/locales/en';

/**
 * Every dot-path that leads to a string leaf, e.g. `'nav.brand'`,
 * `'showcase.title'`. Object nodes (`'nav'`) are NOT keys — they hold no text.
 */
type LeafPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${LeafPaths<T[K]>}`;
}[keyof T & string];

/** The only strings a text component will accept as `tx`. */
export type TxKey = LeafPaths<typeof en>;

/** Interpolation values for keys containing `{{placeholders}}`. */
export type TxOptions = Record<string, string | number>;

/** Rendered when a key is missing at runtime (see `useTx`). */
export const TEXT_NOT_FOUND = 'text not found';

/**
 * Resolves a `tx` key to its translated string.
 *
 * The type system already rejects unknown keys, so a miss here means the key
 * exists in `en` but not in the ACTIVE locale (or the locale failed to load).
 * That must be loud, not silently rendered as a raw key path like i18next does
 * by default — so we surface `text not found` in the UI itself.
 *
 * Safe to call with `undefined` (the `children` path) — hooks stay unconditional.
 */
export function useTx(tx: TxKey | undefined, options?: TxOptions): string | undefined {
  const { t, i18n } = useTranslation();

  if (tx === undefined) return undefined;

  // i18next's `t` overloads don't resolve against a key type as wide as TxKey —
  // it starts reading `options` as the `defaultValue: string` overload. The key
  // is already proven to exist (TxKey at compile time, `exists` below at
  // runtime), so narrow the signature rather than widen the call.
  const translate = t as unknown as (key: TxKey, options?: TxOptions) => string;

  if (!i18n.exists(tx)) {
    if (__DEV__) {
      // eslint-disable-next-line no-console -- a missing string is a bug worth shouting about in dev.
      console.error(`[text] ${TEXT_NOT_FOUND}: "${tx}" (language: ${i18n.language})`);
    }
    return `${TEXT_NOT_FOUND}: ${tx}`;
  }

  return translate(tx, options);
}
