/**
 * Card — elevated themed surface. Radius comes from the brand (sharp vs round),
 * shadow strength adapts to light/dark.
 *
 * Pass `onPress` to make the whole card tappable: it then renders through the
 * TouchableOpacity-style `Pressable` (dim-on-press, web hover, multi-click
 * guard). Without `onPress` it's a plain static `View` — no interaction cost.
 */
import type { PropsWithChildren } from 'react';
import { View, type GestureResponderEvent, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Pressable } from './button';

export type CardProps = PropsWithChildren<{
  elevated?: boolean;
  padded?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  style?: ViewStyle;
}>;

const styles = StyleSheet.create(theme => ({
  card: (elevated: boolean, padded: boolean) => ({
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borderWidths.thin,
    padding: padded ? theme.spacing.lg : theme.spacing.none,
    ...(elevated ? theme.shadows.md : theme.shadows.none),
  }),
}));

export function Card({ children, elevated = true, padded = true, onPress, style }: CardProps) {
  const cardStyle = [styles.card(elevated, padded), style];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={cardStyle}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
