/**
 * Screen transition configs for the root stack (react-native-screen-transitions).
 *
 * Every config runs as a Reanimated worklet on the UI thread, on iOS, Android
 * and web alike. Presets from the library are used where they fit; the custom
 * ones below keep the store's editorial feel (restrained slides, soft dims)
 * instead of bouncy demo physics.
 *
 * Progress semantics (library convention): a screen's `progress` is 0 while
 * entering, 1 at rest, and →2 as the screen above it covers it. One
 * interpolator therefore describes both the push and the "pushed over" states.
 */
import { Platform } from 'react-native';
import { interpolate, interpolateColor } from 'react-native-reanimated';
import Transition from 'react-native-screen-transitions';

import type { StackScreenOptions } from './stack';

const IS_WEB = Platform.OS === 'web';

/** How far the covered screen parallax-slides while a push happens over it. */
const UNDER_PARALLAX = 0.3;

/**
 * Classic push: the incoming screen slides in from the trailing edge with an
 * iOS-style edge-activated back gesture; the screen beneath parallaxes away
 * behind a soft dim. `rtl` mirrors the whole gesture+slide (runtime language
 * flip — the layout re-renders and hands fresh options to the navigator).
 */
export function slideOver(rtl: boolean): StackScreenOptions {
  const dir = rtl ? -1 : 1;
  return {
    gestureEnabled: true,
    gestureDirection: rtl ? 'horizontal-inverted' : 'horizontal',
    gestureActivationArea: 'edge',
    screenStyleInterpolator: ({ progress, layouts: { screen } }) => {
      'worklet';
      const x = interpolate(
        progress,
        [0, 1, 2],
        [screen.width * dir, 0, -screen.width * UNDER_PARALLAX * dir],
      );
      return {
        content: { style: { transform: [{ translateX: x }] } },
        backdrop: {
          style: {
            backgroundColor: interpolateColor(
              progress,
              [0, 1],
              ['rgba(0,0,0,0)', 'rgba(0,0,0,0.18)'],
            ),
          },
        },
      };
    },
    transitionSpec: { open: Transition.Specs.DefaultSpec, close: Transition.Specs.DefaultSpec },
  };
}

/**
 * Cross-platform sheet: slides up from the bottom, swipe-down to dismiss.
 * Replaces the old iOS-only native `presentation: 'modal'` so Android and web
 * get the same motion.
 */
export function sheet(): StackScreenOptions {
  return Transition.Presets.SlideFromBottom();
}

/** Search drops down over the shop and swipes back up to dismiss. */
export function dropdown(): StackScreenOptions {
  return Transition.Presets.SlideFromTop();
}

/** Gallery detail pages scale in — playful is fine in the dev style guide. */
export function zoomIn(): StackScreenOptions {
  return Transition.Presets.ZoomIn();
}

/**
 * Bag: a real snap-point sheet. Rests at 62% of the screen, drags up to
 * fullscreen, swipes down (or backdrop-taps) to dismiss. The scroll list
 * inside coordinates with the gesture via `Transition.ScrollView`.
 */
export function bagSheet(): StackScreenOptions {
  return {
    gestureEnabled: true,
    gestureDirection: 'vertical',
    snapPoints: [0.62, 1],
    initialSnapIndex: 0,
    // 'dismiss' puts the content layer in box-none, which react-native-web
    // renders as pointer-events:none on every child — so web keeps 'block'
    // (no tap-outside-to-close there; the close swipe/back still works).
    backdropBehavior: IS_WEB ? 'block' : 'dismiss',
    expandViaScrollView: true,
    screenStyleInterpolator: ({ progress, layouts: { screen } }) => {
      'worklet';
      const y = interpolate(progress, [0, 1, 2], [screen.height, 0, 0]);
      return {
        content: { style: { transform: [{ translateY: y }] } },
        backdrop: {
          style: {
            backgroundColor: interpolateColor(
              progress,
              [0, 1],
              ['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)'],
            ),
          },
        },
        // The screen is full-height and translated down by `y` when resting at
        // a partial snap — an absolutely-bottomed footer would sit below the
        // viewport. Counter-translate it so the checkout bar stays pinned to
        // the visible bottom at every snap, fading in as the sheet settles.
        [BAG_FOOTER_STYLE_ID]: {
          style: {
            opacity: interpolate(progress, [0, 0.45, 0.62], [0, 0, 1], 'clamp'),
            transform: [{ translateY: -y }],
          },
        },
      };
    },
    transitionSpec: {
      open: Transition.Specs.DefaultSnapSpec,
      close: Transition.Specs.DefaultSnapSpec,
    },
  };
}

/** styleId of the bag sheet's pinned checkout footer (see `bagSheet`). */
export const BAG_FOOTER_STYLE_ID = 'bag-footer';
