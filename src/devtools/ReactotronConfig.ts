/**
 * This file does the setup for integration with Reactotron, which is a
 * free desktop app for inspecting and debugging your React Native app.
 * @see https://github.com/infinitered/reactotron
 *
 * Loaded from `index.ts` under `__DEV__` only — `__DEV__` is inlined to `false`
 * in release builds, so the whole require is dead-code-eliminated and none of
 * the reactotron packages ship to production (that's why they're devDependencies).
 *
 * NOTE: this app uses Expo Router, so navigation commands go through the
 * imperative `router` — there is no React Navigation `navigationRef` here.
 */
import { router } from 'expo-router';
import { NativeModules, Platform } from 'react-native';
import { ArgType } from 'reactotron-core-client';
import zustandPlugin from 'reactotron-plugin-zustand';
import type { ReactotronReactNative } from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';

import { nativeMMKV } from '@/store/kv';
import { useSettings } from '@/store/settings';

import packageJson from '../../package.json';
import { Reactotron } from './ReactotronClient';

const reactotron = Reactotron.configure({
  name: packageJson.name,
  onConnect: () => {
    /** since this file gets hot reloaded, let's clear the past logs every time we connect */
    Reactotron.clear();
  },
});

// Monitor the persisted appearance store (brand / mode / font / radius / language).
reactotron.use(
  zustandPlugin({
    stores: [{ name: 'settings', store: useSettings }],
    omitFunctionKeys: true,
  }),
);

// MMKV only exists on native — web persists through localStorage instead.
if (nativeMMKV) {
  reactotron.use(mmkvPlugin<ReactotronReactNative>({ storage: nativeMMKV }));
}

if (Platform.OS !== 'web') {
  reactotron.useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  });
}

/**
 * Reactotron allows you to define custom commands that you can run
 * from Reactotron itself, and they will run in your app.
 *
 * Define them in the section below with `onCustomCommand`. Use your
 * creativity -- this is great for development to quickly and easily
 * get your app into the state you want.
 *
 * NOTE: If you edit this file while running the app, you will need to do a full refresh
 * or else your custom commands won't be registered correctly.
 */
reactotron.onCustomCommand({
  title: 'Show Dev Menu',
  description: 'Opens the React Native dev menu',
  command: 'showDevMenu',
  handler: () => {
    Reactotron.log('Showing React Native dev menu');
    NativeModules.DevMenu.show();
  },
});

reactotron.onCustomCommand({
  title: 'Reset Settings',
  description: 'Restores the default brand, mode, font, radius and language',
  command: 'resetSettings',
  handler: () => {
    Reactotron.log('resetting settings to defaults');
    useSettings.getState().reset();
  },
});

reactotron.onCustomCommand({
  title: 'Clear Storage',
  description: 'Removes every key from MMKV',
  command: 'clearStorage',
  handler: () => {
    if (!nativeMMKV) {
      Reactotron.log('No MMKV on this platform (web uses localStorage).');
      return;
    }
    Reactotron.log('clearing MMKV storage');
    nativeMMKV.clearAll();
  },
});

reactotron.onCustomCommand<[{ name: 'route'; type: ArgType.String }]>({
  command: 'navigateTo',
  handler: args => {
    const { route } = args ?? {};
    if (!route) {
      Reactotron.log('Could not navigate. No route provided.');
      return;
    }
    Reactotron.log(`Navigating to: ${route}`);
    // Expo Router paths are URLs, e.g. `/` or `/shop`.
    router.push(route as Parameters<typeof router.push>[0]);
  },
  title: 'Navigate To Screen',
  description: 'Navigates to a route by path, e.g. "/" or "/shop".',
  args: [{ name: 'route', type: ArgType.String }],
});

reactotron.onCustomCommand({
  title: 'Go Back',
  description: 'Goes back',
  command: 'goBack',
  handler: () => {
    if (router.canGoBack()) {
      Reactotron.log('Going back');
      router.back();
    } else {
      Reactotron.log('Nothing to go back to.');
    }
  },
});

reactotron.onCustomCommand({
  title: 'Go Home',
  description: 'Dismisses any modals and returns to the root route',
  command: 'goHome',
  handler: () => {
    Reactotron.log('Resetting navigation to root');
    router.dismissAll();
    router.replace('/');
  },
});

/**
 * We're going to add `console.tron` to the Reactotron object.
 * Now, anywhere in our app in development, we can use Reactotron like so:
 *
 * ```
 * if (__DEV__) {
 *  console.tron.display({
 *    name: 'JOKE',
 *    preview: 'What's the best thing about Switzerland?',
 *    value: 'I don't know, but the flag is a big plus!',
 *    important: true
 *  })
 * }
 * ```
 *
 * Use this power responsibly! :)
 */
// Attach reactotron to console for development tools access
if (__DEV__) {
  (console as unknown as Record<string, unknown>).tron = reactotron;
}

/**
 * We tell typescript about our dark magic
 *
 * You can also import Reactotron yourself from ./reactotronClient
 * and use it directly, like Reactotron.log('hello world')
 */
declare global {
  interface Console {
    /**
     * Reactotron client for logging, displaying, measuring performance, and more.
     * @see https://github.com/infinitered/reactotron
     * @example
     * if (__DEV__) {
     *  console.tron.display({
     *    name: 'JOKE',
     *    preview: 'What's the best thing about Switzerland?',
     *    value: 'I don't know, but the flag is a big plus!',
     *    important: true
     *  })
     * }
     */
    tron: typeof reactotron;
  }
}

/**
 * Now that we've setup all our Reactotron configuration, let's connect!
 */
if (Platform.OS !== 'web') {
  reactotron.connect();
}
