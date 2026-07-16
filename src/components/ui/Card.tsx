/**
 * Card — elevated themed surface. Radius comes from the brand (sharp vs round),
 * shadow strength adapts to light/dark.
 */
import type { PropsWithChildren } from 'react';
import { View, type ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type CardProps = PropsWithChildren<{
  elevated?: boolean;
  padded?: boolean;
  style?: ViewStyle;
}>;

const styles = StyleSheet.create((theme) => ({
  card: (elevated: boolean, padded: boolean) => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borderWidths.thin,
    borderColor: theme.colors.border,
    padding: padded ? theme.spacing.lg : theme.spacing.none,
    ...(elevated ? theme.shadows.md : theme.shadows.none),
  }),
}));

export function Card({ children, elevated = true, padded = true, style }: CardProps) {
  return <View style={[styles.card(elevated, padded), style]}>{children}</View>;
}
