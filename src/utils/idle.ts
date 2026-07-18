/**
 * Idle scheduling helpers (see src/docs/DeferredHeavyWorkGuide.md).
 *
 * Replaces the deprecated `InteractionManager.runAfterInteractions`: RN polyfills
 * `requestIdleCallback` globally, which yields the same "don't run on the
 * transition frame" behaviour without waiting on the interaction handle registry.
 */

type IdleDeadline = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type IdleApi = {
  requestIdleCallback?: (
    cb: (deadline: IdleDeadline) => void,
    options?: { timeout?: number },
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

/** Cap on how long work waits for a truly idle slice before running anyway. */
const DEFAULT_IDLE_TIMEOUT = 120;

/**
 * Runs `run` on the next idle slice, or after `timeout` ms if the JS thread
 * never goes idle. Returns a cancel function — call it from effect cleanup.
 *
 * Falls back to a short `setTimeout` where the global is missing (e.g. a test
 * env that never ran RN's InitializeCore).
 */
export function runWhenIdle(run: () => void, timeout: number = DEFAULT_IDLE_TIMEOUT): () => void {
  const idleApi = globalThis as IdleApi;
  let cancelled = false;

  const callback = () => {
    if (!cancelled) run();
  };

  const idleId = idleApi.requestIdleCallback?.(callback, { timeout });
  const timeoutId = idleId == null ? setTimeout(callback, 16) : undefined;

  return () => {
    cancelled = true;
    if (idleId != null) idleApi.cancelIdleCallback?.(idleId);
    if (timeoutId != null) clearTimeout(timeoutId);
  };
}
