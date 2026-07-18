/**
 * Bag — persisted cart lines (product id + qty + chosen size/colour).
 *
 * Same middleware stack as the settings store (devtools → persist → MMKV/
 * localStorage): survives restarts, visible in devtools, state-only persisted.
 */
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { zustandStorage } from './kv';

export type BagLine = {
  productId: string;
  qty: number;
  size?: string;
  color?: string;
};

export type BagState = {
  lines: BagLine[];
};

export type BagActions = {
  add: (line: Omit<BagLine, 'qty'>) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

/** Total number of pieces (badge count). */
export function bagCount(lines: BagLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

export const useBag = create<BagState & BagActions>()(
  devtools(
    persist(
      set => ({
        lines: [],
        add: line =>
          set(
            s => {
              const existing = s.lines.find(l => l.productId === line.productId);
              return {
                lines: existing
                  ? s.lines.map(l =>
                      l.productId === line.productId ? { ...l, ...line, qty: l.qty + 1 } : l,
                    )
                  : [...s.lines, { ...line, qty: 1 }],
              };
            },
            false,
            'bag/add',
          ),
        setQty: (productId, qty) =>
          set(
            s => ({
              lines:
                qty <= 0
                  ? s.lines.filter(l => l.productId !== productId)
                  : s.lines.map(l => (l.productId === productId ? { ...l, qty } : l)),
            }),
            false,
            'bag/setQty',
          ),
        remove: productId =>
          set(
            s => ({ lines: s.lines.filter(l => l.productId !== productId) }),
            false,
            'bag/remove',
          ),
        clear: () => set({ lines: [] }, false, 'bag/clear'),
      }),
      {
        name: 'bag',
        version: 1,
        storage: createJSONStorage(() => zustandStorage),
        partialize: s => ({ lines: s.lines }),
      },
    ),
    { name: 'BagStore', enabled: __DEV__ },
  ),
);
