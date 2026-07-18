// Entry point.
// Unistyles must be configured (and RTL applied) BEFORE any StyleSheet.create()
// runs or the router renders, so bootstrap comes first.
import '@/theme/bootstrap';

// Reactotron (dev only). `__DEV__` is inlined to `false` in release builds, so
// Metro drops this require entirely and none of the reactotron packages ship.
if (__DEV__) {
  require('@/devtools/ReactotronConfig');
}

// `require`, not `import`: imports are hoisted, so an `import` here would run
// BEFORE the dev block above and start the router first.
require('expo-router/entry');
