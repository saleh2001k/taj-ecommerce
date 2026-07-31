/**
 * Android's bottom tab bar — a floating, blurred capsule.
 *
 * iOS gets the real UITabBarController through `NativeTabs` (liquid glass,
 * minimize-on-scroll, all free). Android has no equivalent: the Material bar
 * `NativeTabs` renders there is a full-width, opaque strip. So Android runs the
 * JS tab navigator instead and we draw the bar ourselves — a capsule floating
 * OVER the content (which is what gives the blur something to blur), a real
 * hardware-accelerated backdrop blur, a linear-gradient sheen for the glass,
 * and a selection pill that springs from tab to tab.
 *
 * This file is native-only. `FloatingTabBar.web.tsx` stubs it out so the blur
 * module's codegen'd native component never reaches the web bundle (web renders
 * the website nav and never mounts this).
 *
 * ── Nothing re-renders while it animates ──
 * Same contract as the buttons: the pill, the icon cross-fade and the press
 * feedback all live on Reanimated shared values (UI thread). React re-renders
 * this bar only when the focused route, the language or the bar's width change.
 * Colours come from the single `StyleSheet.create` (Unistyles pushes them onto
 * the shadow node from C++) and from `withUnistyles` for the prop-configured
 * native layers — never from `useAppTheme()`.
 */
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router, usePathname, type Href } from 'expo-router';
import { useState, type RefObject } from 'react';
import { Pressable, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet, withUnistyles } from 'react-native-unistyles';

import { Overline, type TxKey } from '@/components/ui';
import { usePressAnimation } from '@/components/ui/button/usePressAnimation';
import { useSettings } from '@/store/settings';
import { isRTL } from '@/theme';
import { withAlpha } from '@/theme/colorUtils';
import { iconSizes } from '@/theme/tokens';
import { GLYPH_VIEW_BOX, TAB_GLYPHS, type TabGlyph } from './tabGlyphs';

/**
 * The backdrop blur (`expo-blur`). `tint` is a PROP, not a style, so Unistyles
 * can't reach it on its own — `withUnistyles` subscribes just this layer to the
 * theme, the same treatment the glyph fills get. The tint also carries the
 * translucent fill that keeps labels legible over a blown-out photo, so no
 * separate overlay is needed.
 */
const Backdrop = withUnistyles(BlurView, theme => ({
  tint: theme.isDark ? ('dark' as const) : ('light' as const),
}));

/**
 * The gradient BEHIND the capsule — a short fade so scrolling content dissolves
 * into the background under the bar instead of hard-cutting at its edge. Kept
 * shallow (and mostly transparent where the capsule sits) so the blur still has
 * real content to sample.
 */
const Scrim = withUnistyles(LinearGradient, theme => ({
  colors: ['transparent', withAlpha(theme.colors.background, 0.4), theme.colors.background] as [
    string,
    string,
    string,
  ],
  locations: [0, 0.45, 1] as [number, number, number],
}));

/** Two fills of the same glyph, cross-faded — `fill` is a prop, not a style. */
const IdlePath = withUnistyles(Path, theme => ({ fill: theme.colors.textMuted }));
const ActivePath = withUnistyles(Path, theme => ({ fill: theme.colors.primary }));

/** Firm but unbouncy — the pill should arrive with the screen, not after it. */
const PILL_SPRING = { damping: 18, mass: 0.8, stiffness: 190 } as const;

/**
 * The capsule is ALWAYS a capsule — it deliberately opts out of the theme's
 * shape axis (`theme.radius.pill` flattens to 4 under `minimal` and 0 under
 * `sharp`). A floating bar that isn't fully round reads as a misplaced sheet.
 */
const CAPSULE_RADIUS = 999;

const ICON_SIZE = iconSizes.lg;
const FOCUS_SCALE = 1.08;
const PRESS_SCALE = 0.92;
const IDLE_LABEL_OPACITY = 0.55;

/**
 * Blur intensity (`expo-blur`, 1–100). `blurReductionFactor` (default 4) divides
 * this on Android to match iOS, so ~65 reads as a solid frost. `expo-blur`'s
 * Android path is hardware-accelerated (RenderNode on SDK 31+) — unlike the old
 * software-capture library — so this is far cheaper per frame while scrolling.
 */
const BLUR_INTENSITY = 65;

/**
 * Geometry for the pill's animated wrapper — a PLAIN object, deliberately not a
 * Unistyles style. Unistyles styles handed to a Reanimated-driven component
 * don't survive re-application on re-render (the same rule the transition
 * presets follow: plain styles on the animated view, Unistyles on a plain inner
 * View). The pill re-renders on every tab change, so it has to obey it.
 */
const PILL_LAYOUT = { bottom: 0, position: 'absolute', top: 0 } as const;
/** How far a label may shrink before it's allowed to truncate ("Components"). */
const MIN_LABEL_SCALE = 0.7;

export type TabBarItem = {
  /** Stable key for the row (the route file name — index/shop/…). */
  name: string;
  /** Route this tab points at ('/', '/shop', …). Drives navigation AND active state. */
  href: string;
  labelKey: TxKey;
  /** Material Symbols name — the key the filled glyph is drawn from. */
  md: TabGlyph;
};

export type FloatingTabBarProps = {
  /** Icon + label + href for each route, in the order the tabs should appear. */
  items: readonly TabBarItem[];
  /**
   * Android: ref to the `BlurTargetView` that wraps the SCREENS. `expo-blur`
   * samples that view for the backdrop; without a target it renders a flat tint
   * (the native `BlurView` forces `blurMethod` to `none` when the ref is empty).
   *
   * The bar renders as a SIBLING of that target, never inside it: a `BlurView`
   * nested in its own `BlurTargetView` makes the hardware RenderNode tree
   * self-reference — `prepareTree` recurses until the render thread stack
   * overflows (SIGSEGV). Undefined on iOS, where the blur samples the window.
   */
  blurTarget?: RefObject<View | null>;
};

/**
 * Driven by the ROUTER, not React Navigation's tab-bar props. It lives OUTSIDE
 * the `<Tabs>` navigator (so it can sit outside the blur target — see
 * `blurTarget`): it reads the active tab from `usePathname` and switches tabs
 * with `router.navigate`, instead of `state`/`navigation`.
 */
export function FloatingTabBar({ items, blurTarget }: FloatingTabBarProps) {
  // Subscribed on purpose: a runtime language flip mirrors the row, and the
  // pill's translateX is physical, so it has to flip with it.
  const language = useSettings(s => s.language);
  const rtl = isRTL(language);
  const pathname = usePathname();

  // Active tab = the item whose href matches the current path. Clamp to 0 so the
  // pill always has a home if a transient path doesn't match any tab.
  const activeIndex = Math.max(
    0,
    items.findIndex(i => i.href === pathname),
  );

  // The pill's WIDTH is a real layout value, so it stays a plain style measured
  // once (and on rotation); only translateX is animated. Animating width would
  // put a layout pass on every frame of the spring.
  const [rowWidth, setRowWidth] = useState(0);
  const itemWidth = rowWidth / items.length;

  const progress = useDerivedValue(() => withSpring(activeIndex, PILL_SPRING), [activeIndex]);

  // Width rides along in the animated style rather than in a Unistyles dynamic
  // function — see PILL_LAYOUT. It only changes on measure, never per frame.
  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * itemWidth * (rtl ? -1 : 1) }],
    width: itemWidth,
  }));

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <Scrim pointerEvents="none" style={styles.layer} />

      <View style={styles.wrapper}>
        <Backdrop
          style={styles.bar}
          intensity={BLUR_INTENSITY}
          blurMethod="dimezisBlurView"
          blurTarget={blurTarget}
        >
          <View
            style={styles.row}
            onLayout={(e: LayoutChangeEvent) => setRowWidth(e.nativeEvent.layout.width)}
          >
            {/* No `left`/`right`: an absolute child without either sits at the
                row's START edge, which is the right edge under RTL — exactly
                where route 0 renders once the row mirrors. */}
            <Animated.View pointerEvents="none" style={[PILL_LAYOUT, pillStyle]}>
              <View style={styles.pill} />
            </Animated.View>

            {items.map((item, index) => (
              <TabBarButton
                key={item.name}
                item={item}
                index={index}
                focused={index === activeIndex}
                progress={progress}
                onPress={() => {
                  if (index !== activeIndex) router.navigate(item.href as Href);
                }}
              />
            ))}
          </View>
        </Backdrop>
      </View>
    </View>
  );
}

type TabBarButtonProps = {
  item: TabBarItem;
  /** Position in the row — compared against the spring to derive focus. */
  index: number;
  focused: boolean;
  progress: SharedValue<number>;
  onPress: () => void;
};

function TabBarButton({ item, index, focused, progress, onPress }: TabBarButtonProps) {
  const { pressed, handlers } = usePressAnimation();

  // 1 when the pill is centred on this tab, 0 once it has moved a full slot
  // away — so both neighbours cross-fade *during* the spring, not after it.
  const focus = useDerivedValue(() =>
    interpolate(progress.value, [index - 1, index, index + 1], [0, 1, 0], Extrapolation.CLAMP),
  );

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + focus.value * (FOCUS_SCALE - 1) - pressed.value * (1 - PRESS_SCALE) }],
  }));
  const idleStyle = useAnimatedStyle(() => ({ opacity: 1 - focus.value }));
  const activeStyle = useAnimatedStyle(() => ({ opacity: focus.value }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity: IDLE_LABEL_OPACITY + focus.value * (1 - IDLE_LABEL_OPACITY),
  }));

  return (
    // A PLAIN Pressable, not `createAnimatedComponent(Pressable)`: Pressable
    // re-renders on press-in and re-applies its own `style` to the underlying
    // view, which wipes whatever Reanimated wrote there. The press animation
    // therefore lives on inner views that Pressable never touches.
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onPressIn={handlers.onPressIn}
      onPressOut={handlers.onPressOut}
      style={styles.item}
    >
      <Animated.View style={[styles.icon, iconStyle]}>
        <Animated.View style={idleStyle}>
          <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox={GLYPH_VIEW_BOX}>
            <IdlePath d={TAB_GLYPHS[item.md]} />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.layer, activeStyle]}>
          <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox={GLYPH_VIEW_BOX}>
            <ActivePath d={TAB_GLYPHS[item.md]} />
          </Svg>
        </Animated.View>
      </Animated.View>

      {/* `alignSelf: stretch` is what makes `adjustsFontSizeToFit` work: it
          needs a BOUNDED width to shrink against, and a centred child in a
          column sizes to its own content. Without it "Components" just spills
          past the tab. */}
      <Animated.View style={[styles.label, labelStyle]}>
        <Overline
          tx={item.labelKey}
          color="text"
          align="center"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={MIN_LABEL_SCALE}
          style={styles.labelText}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  bar: {
    borderColor: theme.colors.border,
    borderRadius: CAPSULE_RADIUS,
    borderWidth: theme.borderWidths.thin,
    flex: 1,
    // Clips the blur to the capsule.
    overflow: 'hidden',
    padding: theme.spacing.sm,
  },
  icon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
  },
  item: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    alignSelf: 'stretch',
  },
  labelText: {
    // Buys back a little horizontal room before the auto-shrink has to kick in.
    letterSpacing: theme.typography.letterSpacing.tight,
    paddingHorizontal: theme.spacing.xxs,
  },
  /** Stacked background/foreground layer — the scrim, the blur, the lit glyph. */
  layer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  // Appearance only — it fills the animated wrapper that owns the geometry.
  pill: {
    backgroundColor: theme.colors.primaryMuted,
    borderRadius: CAPSULE_RADIUS,
    flex: 1,
  },
  // Spans the capsule AND the gradient behind it, so the scrim has a box to
  // fill. `box-none` keeps the dead space around the capsule tappable.
  root: {
    bottom: 0,
    height:
      rt.insets.bottom + theme.layout.floatingTabBarHeight + theme.spacing.sm + theme.spacing.xxl,
    justifyContent: 'flex-end',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  // Holds the shadow, because the capsule below it clips (`overflow: hidden`)
  // and would clip its own shadow with it. `borderRadius` alone gives Android
  // the outline its elevation shadow is cast from.
  wrapper: {
    borderRadius: CAPSULE_RADIUS,
    height: theme.layout.floatingTabBarHeight,
    marginBottom: rt.insets.bottom + theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
    ...theme.shadows.lg,
  },
}));
