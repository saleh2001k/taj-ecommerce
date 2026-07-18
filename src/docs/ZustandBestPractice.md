Here is a comprehensive guide to **Zustand Best Practices** formatted in Markdown. You can copy and paste this directly into your project's documentation or personal notes.

---

# Zustand Best Practices Guide

Zustand is a small, fast, and scalable barebones state-management solution. While it is unopinionated, following these community-standard patterns will ensure your application remains performant and maintainable.

> **Version note:** This guide targets Zustand v5 (released October 2024), which requires React 18+ and TypeScript 4.5+. Breaking changes from v4 are called out where relevant.

---

## 1. Optimize Performance with Selectors

The most common mistake in Zustand is grabbing the entire state object. This causes the component to re-render whenever **any** property in the store changes.

- **Bad:** Causes re-renders on every store change.
  ```typescript
  const state = useStore(); // no selector — subscribes to everything
  const { bears } = useStore(); // still bad — same issue
  ```
- **Good:** Only re-renders when `bears` changes.
  ```typescript
  const bears = useStore(state => state.bears);
  ```

Actions (functions) technically never change reference, so selecting only one action is fine either way. But for consistency, use selectors throughout.

---

## 2. Use `useShallow` for Multiple Values

If you need multiple properties at once, use `useShallow`. Without it, returning a new object from the selector creates a new reference on every render, causing unnecessary re-renders even when the values haven't changed.

```typescript
import { useShallow } from 'zustand/react/shallow';

// Good — only re-renders when bears or bees actually change
const { bears, bees } = useStore(useShallow(state => ({ bears: state.bears, bees: state.bees })));
```

**Alternatively**, use separate selectors per value (equally valid, slightly more verbose):

```typescript
const bears = useStore(s => s.bears);
const bees = useStore(s => s.bees);
```

> **v5 change:** Custom equality functions were removed from `create()`. If you need a custom equality function (e.g. `shallow`), use `createWithEqualityFn()` from `'zustand/traditional'` instead.

---

## 3. The "Slice Pattern" for Large Stores

For complex applications, split your store into smaller, logical "slices." Zustand encourages **multiple focused stores** rather than one monolithic store — unlike Redux.

```typescript
// slices/createBearSlice.ts
import { StateCreator } from 'zustand';

export interface BearSlice {
  bears: number;
  addBear: () => void;
}

export const createBearSlice: StateCreator<BearSlice> = set => ({
  bears: 0,
  addBear: () => set(state => ({ bears: state.bears + 1 })),
});

// store.ts
import { create } from 'zustand';
import { createBearSlice, BearSlice } from './slices/createBearSlice';
import { createFishSlice, FishSlice } from './slices/createFishSlice';

type BoundStore = BearSlice & FishSlice;

export const useBoundStore = create<BoundStore>((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}));
```

**TypeScript tip:** Always type your slices with `StateCreator` so they have access to the full combined store's state and actions.

---

## 4. Keep Actions and State Together

Zustand recommends colocating "actions" (functions that update state) inside the store. This keeps logic close to the data it modifies and simplifies testing.

```typescript
const useStore = create<State>(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
}));
```

**Model actions as events** — structure them to represent "what happened" rather than directly setting values. This keeps business logic inside the store, not scattered across components.

---

## 5. Export Custom Hooks, Not Raw Stores

Instead of importing the raw store hook everywhere, wrap it in named custom hooks. This prevents accidental full-store subscriptions and makes refactoring easier.

```typescript
// store.ts — internal
const useBearStore = create<BearState>(...)

// Exported custom hooks — public API
export const useBears      = () => useBearStore(s => s.bears);
export const useAddBear    = () => useBearStore(s => s.addBear);
```

---

## 6. Use Middleware (Devtools & Persist)

- **Devtools:** Wrap your store in the `devtools` middleware for time-travel debugging via the Redux DevTools browser extension. Give each store a distinct name.
- **Persist:** Use the `persist` middleware to automatically sync your store with storage (AsyncStorage, MMKV, localStorage, etc.).

**Recommended middleware order:** `devtools → persist → subscribeWithSelector → immer`

```typescript
import { devtools, persist } from 'zustand/middleware';

const useStore = create<State>()(
  devtools(
    persist(
      (set) => ({ ... }),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' } // name shown in Redux DevTools
  )
);
```

**`partialize`** — only persist the state you actually need (exclude ephemeral values, functions, etc.):

```typescript
persist(
  (set) => ({ ... }),
  {
    name: 'app-storage',
    partialize: state => ({ count: state.count }), // only persist 'count'
  }
)
```

---

## 7. Accessing State Outside Components

Use `getState()` / `setState()` / `subscribe()` when you need state outside React (API utilities, event handlers, service layers).

```typescript
// Read — non-reactive
const token = useAuthStore.getState().accessToken;

// Write — triggers subscribers
useAuthStore.setState({ accessToken: newToken });

// Subscribe — fires synchronously on every change
const unsub = useAuthStore.subscribe(state => console.log(state.count));
unsub(); // cleanup

// Subscribe to a slice only (requires subscribeWithSelector middleware)
useAuthStore.subscribe(
  s => s.accessToken,
  token => console.log('Token changed:', token),
);
```

> Do **not** use `getState()` inside React components — use the hook with a selector so the component re-renders when needed.

---

## 8. Common Anti-Patterns to Avoid

| Anti-pattern                             | Why it's bad                                  | Fix                                       |
| ---------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| `useStore()` with no selector            | Re-renders on every store change              | Use a selector or `useShallow`            |
| Creating stores inside components        | Store recreates on every render, losing state | Create stores at module scope             |
| Storing derived/computed values          | State duplication, sync issues                | Compute in a selector instead             |
| Expensive selectors without memoization  | Runs on every render                          | Memoize with `useMemo`, or use `reselect` |
| Using Zustand in React Server Components | State can leak between users                  | Use only in client components             |

---

## 9. Zustand v5 Breaking Changes (October 2024)

If you are upgrading from v4, be aware of:

1. **React 18+ required** — dropped support for React 17 and older (v5 uses React 18's native `useSyncExternalStore`).
2. **TypeScript 4.5+** — older TS versions no longer supported.
3. **No ES5 output** — bundle assumes modern JS environments.
4. **`use-sync-external-store` is now a peer dependency** — only needed if you import from `'zustand/traditional'` (`createWithEqualityFn` / `useStoreWithEqualityFn`); the core `create` uses React's native `useSyncExternalStore`.
5. **Custom equality removed from `create()`** — use `createWithEqualityFn` from `'zustand/traditional'` if you need shallow or deep equality:
   ```typescript
   import { createWithEqualityFn } from 'zustand/traditional';
   import { shallow } from 'zustand/shallow';

   const useStore = createWithEqualityFn<State>()(
     set => ({/* ... */}),
     shallow, // default equality function for all selectors
   );
   ```
6. **Selectors returning new references** — can now cause infinite loops in some patterns. Use `useShallow` to guard against this.
7. **`persist` initial state** — no longer stored during `create()` (only on first manual `setState`). Review rehydration logic.

---

## 10. Essential Resources

| Resource                                                                                                        | Description                                                               |
| :-------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| [**Official Zustand Documentation**](https://zustand.docs.pmnd.rs/)                                             | The absolute starting point and source of truth.                          |
| [**TkDodo: Working with Zustand**](https://tkdodo.eu/blog/working-with-zustand)                                 | An incredibly detailed deep-dive on effective Zustand usage.              |
| [**Zustand GitHub — Slice Pattern**](https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md) | The official guide on how to scale your store.                            |
| [**Zustand v5 Migration Guide**](https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5)             | Step-by-step migration from v4 to v5.                                     |
| [**Redux DevTools Extension**](https://github.com/reduxjs/redux-devtools)                                       | The browser tool used to debug Zustand stores with `devtools` middleware. |

---

### Quick Reference: Selector Cheat Sheet

```typescript
// Single value
const count = useStore(s => s.count);

// Single action
const increment = useStore(s => s.increment);

// Multiple values — use useShallow
const { count, name } = useStore(useShallow(s => ({ count: s.count, name: s.name })));

// Outside a component
useStore.getState().count;
useStore.setState({ count: 0 });
```
