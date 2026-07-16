/**
 * Chip — selectable pill used by the settings pickers (theme / font / radius /
 * mode / lang).
 *
 * The picker previews live: `fontFamily` renders each typeface in its own face,
 * `radius` renders each shape profile in its own curve.
 */
import { Pressable, Text as RNText } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** Render the label in a specific font family (for the font picker preview). */
  fontFamily?: string;
  /** Override the corner radius (for the radius picker preview). */
  radius?: number;
};

const styles = StyleSheet.create((theme) => ({
  chip: (selected: boolean, radius: number | undefined) => ({
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: radius ?? theme.radius.pill,
    borderWidth: theme.borderWidths.thin,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: selected
      ? theme.colors.primaryMuted
      : theme.colors.surface,
    borderColor: selected ? theme.colors.primary : theme.colors.border,
  }),
  label: (selected: boolean, fontFamily: string | undefined) => ({
    color: selected ? theme.colors.primary : theme.colors.text,
    fontFamily: fontFamily ?? theme.typography.family.medium,
    fontSize: theme.typography.sizes.sm,
  }),
  pressed: {
    opacity: theme.opacity.pressed,
  },
}));

export function Chip({
  label,
  selected = false,
  onPress,
  fontFamily,
  radius,
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip(selected, radius),
        pressed && styles.pressed,
      ]}
    >
      <RNText style={styles.label(selected, fontFamily)}>{label}</RNText>
    </Pressable>
  );
}
