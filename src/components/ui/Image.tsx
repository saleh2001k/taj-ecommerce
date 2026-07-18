/**
 * Image — themed wrapper over `expo-image`.
 *
 * Adds the theme radius, a soft blurhash placeholder (so images fade in instead
 * of popping), and a fixed `aspectRatio` so layout never jumps while loading.
 * `contentFit` defaults to `cover` — right for product photography.
 *
 * No `useAppTheme()`: radius/background come from the single `StyleSheet.create`,
 * so a theme change restyles the frame without re-rendering (same rule as the
 * rest of the kit).
 */
import { Image as ExpoImage, type ImageContentFit } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/** Generic soft placeholder shown while the remote image loads. */
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';

export type ImageProps = {
  uri: string;
  /** width / height. Reserves space so layout doesn't jump. Default 1 (square). */
  aspectRatio?: number;
  contentFit?: ImageContentFit;
  radius?: RadiusToken;
  /** Fills its parent instead of using aspectRatio (for absolute backgrounds). */
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const styles = StyleSheet.create(theme => ({
  // True background fill: absolute, so it never competes with the parent's
  // flow children for height (a flex parent would squeeze a 100%-height child
  // to whatever space its siblings leave over).
  fill: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  frame: (radius: RadiusToken, aspectRatio: number | undefined) => ({
    aspectRatio,
    backgroundColor: theme.colors.skeleton,
    borderRadius: theme.radius[radius],
    overflow: 'hidden',
    width: '100%',
  }),
}));

const EXPO_FILL = { flex: 1 } as const;

export function Image({
  uri,
  aspectRatio = 1,
  contentFit = 'cover',
  radius = 'md',
  fill = false,
  style,
  accessibilityLabel,
}: ImageProps) {
  const frameStyle = [fill ? styles.fill : styles.frame(radius, aspectRatio), style];

  return (
    <View style={frameStyle}>
      <ExpoImage
        source={{ uri }}
        placeholder={{ blurhash: BLURHASH }}
        contentFit={contentFit}
        transition={250}
        style={EXPO_FILL}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}
