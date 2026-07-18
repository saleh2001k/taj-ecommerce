/**
 * Fullscreen product photo viewer.
 */
import { useLocalSearchParams } from 'expo-router';
import { Platform, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppHeader, Caption, Image, PBold, Screen } from '@/components/ui';
import { formatPrice, getProduct } from '@/data/products';
import { Stack } from '@/navigation/stack';

export default function PhotoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);

  if (!product) {
    return <Screen header={<AppHeader close />} />;
  }

  return (
    <View style={Platform.OS === 'web' ? styles.rootWeb : styles.root}>
      <Stack.Screen options={{ title: product.name }} />

      <View style={styles.photoBox}>
        <Image
          uri={product.image}
          aspectRatio={0.85}
          radius="none"
          accessibilityLabel={product.name}
        />
      </View>

      <View style={styles.caption}>
        <PBold color="onOverlay">{product.name}</PBold>
        <Caption color="onOverlay">{formatPrice(product.price)}</Caption>
      </View>

      <AppHeader variant="overlay" close />
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  caption: {
    alignItems: 'center',
    bottom: rt.insets.bottom + theme.spacing.xl,
    gap: theme.spacing.xxs,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  photoBox: {
    justifyContent: 'center',
    width: '100%',
  },
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
  },
  rootWeb: {
    backgroundColor: theme.colors.background,
    height: rt.screen.height,
    justifyContent: 'center',
  },
}));
