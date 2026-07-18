/**
 * Root stack — react-native-screen-transitions' Blank Stack bridged into
 * expo-router via `withLayoutContext`.
 *
 * Why not the native stack: its transitions are platform-owned, and the shared
 * element engine we used before (Reanimated SET) is iOS-only in Reanimated 4.5 —
 * the Android side of `onTransitionProgress` is explicitly stubbed out upstream.
 * The blank stack runs every transition as a Reanimated worklet on the UI
 * thread, so pushes and dismissal gestures behave identically on iOS, Android
 * and web.
 *
 * Screens keep drawing their own chrome (`AppHeader`) — the blank stack has no
 * native header, which is what this app wanted anyway.
 */
import type { ParamListBase, StackNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import {
  createBlankStackNavigator,
  type BlankStackNavigationEventMap,
  type BlankStackNavigationOptions,
} from 'react-native-screen-transitions/blank-stack';

const { Navigator } = createBlankStackNavigator();

/**
 * Blank-stack options plus `title`: react-navigation's web document title
 * formatter reads `options.title` generically, and expo-router uses it for the
 * <title> tag on static web routes.
 */
export type StackScreenOptions = BlankStackNavigationOptions & { title?: string };

export const Stack = withLayoutContext<
  StackScreenOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  BlankStackNavigationEventMap
>(Navigator);
