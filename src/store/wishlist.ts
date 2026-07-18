/**
 * Wishlist — persisted list of saved product ids.
 *
 * Same middleware stack as the settings store (devtools → persist → MMKV/
 * localStorage): survives restarts, visible in devtools, state-only persisted.
 */
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { zustandStorage } from './kv';

export type WishlistState = {
  ids: string[];
};

export type WishlistActions = {
  toggle: (id: string) => void;
  clear: () => void;
};

export const useWishlist = create<WishlistState & WishlistActions>()(
  devtools(
    persist(
      set => ({
        ids: [],
        toggle: id =>
          set(
            s => ({
              ids: s.ids.includes(id) ? s.ids.filter(x => x !== id) : [...s.ids, id],
            }),
            false,
            'wishlist/toggle',
          ),
        clear: () => set({ ids: [] }, false, 'wishlist/clear'),
      }),
      {
        name: 'wishlist',
        version: 1,
        storage: createJSONStorage(() => zustandStorage),
        partialize: s => ({ ids: s.ids }),
      },
    ),
    { name: 'WishlistStore', enabled: __DEV__ },
  ),
);
