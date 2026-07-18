/** Divider — hairline separator in the theme border color. */
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create(theme => ({
  divider: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.border,
    height: theme.borderWidths.thin,
    marginVertical: theme.spacing.md,
  },
}));

export function Divider() {
  return <View style={styles.divider} />;
}
