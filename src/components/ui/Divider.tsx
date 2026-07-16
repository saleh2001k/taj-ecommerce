/** Divider — hairline separator in the theme border color. */
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
  divider: {
    height: theme.borderWidths.thin,
    alignSelf: 'stretch',
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
}));

export function Divider() {
  return <View style={styles.divider} />;
}
