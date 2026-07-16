/**
 * Cross-platform key/value storage.
 *
 * Native  -> react-native-mmkv (fast, synchronous, native).
 * Web      -> localStorage (MMKV has no reliable web build; the app must run on
 *             the web, so we fall back cleanly).
 *
 * Both back-ends are synchronous, which lets us read the persisted theme BEFORE
 * the first render (no theme flash).
 */
import { Platform } from 'react-native';

export interface KV {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
}

function createWebKV(): KV {
  const hasLS = typeof localStorage !== 'undefined';
  return {
    getString: (k) => (hasLS ? localStorage.getItem(k) ?? undefined : undefined),
    set: (k, v) => {
      if (hasLS) localStorage.setItem(k, v);
    },
    delete: (k) => {
      if (hasLS) localStorage.removeItem(k);
    },
  };
}

function createNativeKV(): KV {
  // Required lazily so the native module is never touched on web/SSR.
  // react-native-mmkv v4 exposes a `createMMKV` factory (no `new MMKV()`).
  const { createMMKV } = require('react-native-mmkv') as typeof import('react-native-mmkv');
  const mmkv = createMMKV({ id: 'ecommerce-app-settings' });
  return {
    getString: (k) => mmkv.getString(k),
    set: (k, v) => mmkv.set(k, v),
    delete: (k) => {
      mmkv.remove(k);
    },
  };
}

export const storage: KV = Platform.OS === 'web' ? createWebKV() : createNativeKV();

/** Zustand `persist` adapter over the KV. */
export const zustandStorage = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => storage.delete(name),
};
