## Deferring heavy work with `requestIdleCallback` (RN-friendly)

When opening a screen or modal, avoid doing expensive work (big lists, expensive derived data, many components mounting, expensive selectors) on the same frame as the first paint. A good pattern is:

- Render the **lightweight UI shell first**
- Defer the heavy part to an **idle slice** (or a short fallback timeout)

This keeps animations/input responsive and reduces “JS thread spike” when opening modals.

### Why `requestIdleCallback`

`requestIdleCallback` schedules work when the event loop is idle. See MDN for details: [Window.requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback).

Do **not** use `InteractionManager.runAfterInteractions` — it is deprecated. The RN docs say: “Avoid long-running work and use [`requestIdleCallback`](https://reactnative.dev/docs/global-requestIdleCallback) instead.”

---

## Shared helper

Use `runWhenIdle` from `@utils/idle` rather than hand-rolling the schedule/cancel dance:

```ts
import { runWhenIdle } from '@utils/idle';

// Returns a cancel function — call it from effect cleanup.
const cancelIdle = runWhenIdle(() => {
  doExpensiveWork();
});
```

Notes:

- The `timeout` (120ms default) ensures the work still runs even if the app never gets truly “idle”.
- Wrap the body in `requestAnimationFrame` when the work must land after a paint rather than merely off the busy frame.
- To batch work across several idle slices, re-arm `runWhenIdle` from inside the callback and keep the latest cancel function for cleanup.

---

## Pattern 1: Screen renders shell, then heavy content

```tsx
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { runWhenIdle } from '@utils/idle';

export function ExampleScreen() {
  const [isHeavyReady, setIsHeavyReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;

    const cancelIdle = runWhenIdle(() => {
      rafId = requestAnimationFrame(() => {
        if (!cancelled) setIsHeavyReady(true);
      });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Lightweight shell (header, search, skeleton, etc.) */}
      {/* ... */}

      {/* Heavy part mounts later */}
      {isHeavyReady ? <HeavyContent /> : null}
    </View>
  );
}

function HeavyContent() {
  return <View />;
}
```

---

## Pattern 2: Modal opens immediately, heavy sections mount later

This works well for filter modals: show header + critical inputs immediately, then mount the expensive accordion sections later.

```tsx
import React from 'react';
import { View } from 'react-native';

import { useDeferredReady } from '@hooks/useDeferredReady';

export function ExampleModal() {
  const ready = useDeferredReady();

  return (
    <View>
      {/* Always render these immediately */}
      <Header />
      <CriticalInputs />

      {/* Defer heavy lists/sections */}
      {ready ? <HeavyAccordionSections /> : null}
    </View>
  );
}

function Header() {
  return null;
}
function CriticalInputs() {
  return null;
}
function HeavyAccordionSections() {
  return null;
}
```

---

## Alternative: Lazy-mount by expansion (often best UX)

Instead of deferring “everything heavy”, mount section content only when a section is expanded:

- Modal opens instantly (no deferred state, no loaders)
- API hooks for a section run only when expanded

This is usually the best approach for filter modals with multiple accordion sections.
