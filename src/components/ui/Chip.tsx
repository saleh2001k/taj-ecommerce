/**
 * Chip — selectable pill used by the settings pickers (theme / font / radius /
 * mode / lang).
 *
 * The picker previews live: `fontFamily` renders each typeface in its own face,
 * `radius` renders each shape profile in its own curve.
 */
import { Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Label } from './text';
import type { TxKey } from './text/tx';

type ChipContent =
  /** Translated copy. */
  | { tx: TxKey; label?: never }
  /** Raw label — for values that are never translated (typeface names). */
  | { tx?: never; label: string };

export type ChipProps = {
  selected?: boolean;
  onPress?: () => void;
  /** Render the label in a specific font family (for the font picker preview). */
  fontFamily?: string;
  /** Override the corner radius (for the radius picker preview). */
  radius?: number;
} & ChipContent;

const styles = StyleSheet.create(theme => ({
  chip: (selected: boolean, radius: number | undefined) => ({
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.primaryMuted : theme.colors.surface,
    borderColor: selected ? theme.colors.primary : theme.colors.border,
    borderRadius: radius ?? theme.radius.pill,
    borderWidth: theme.borderWidths.thin,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  }),
  pressed: {
    opacity: theme.opacity.pressed,
  },
}));

export function Chip({ tx, label, selected = false, onPress, fontFamily, radius }: ChipProps) {
  const color = selected ? 'primary' : 'text';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip(selected, radius), pressed && styles.pressed]}
    >
      {tx ? (
        <Label tx={tx} color={color} fontFamily={fontFamily} />
      ) : (
        <Label color={color} fontFamily={fontFamily}>
          {label}
        </Label>
      )}
    </Pressable>
  );
}
