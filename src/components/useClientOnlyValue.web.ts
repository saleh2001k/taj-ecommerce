import { useEffect, useState } from 'react';

/* eslint-disable react-doctor/no-derived-state, react-doctor/no-derived-state-effect, react-doctor/no-adjust-state-on-prop-change --
 * These rules are right in general, but this hook exists PRECISELY to pay that
 * extra render. `useEffect` never runs during server rendering, so returning
 * `server` on the first pass and swapping to `client` afterwards is what keeps
 * SSR markup and the hydrated tree identical. Deriving the value directly (what
 * the rules suggest) would render client-only output on the server and cause a
 * hydration mismatch — the exact bug this guards against. */

// `useEffect` is not invoked during server rendering, meaning
// we can use this to determine if we're on the server or not.
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  const [value, setValue] = useState<S | C>(server);
  useEffect(() => {
    setValue(client);
  }, [client]);

  return value;
}
