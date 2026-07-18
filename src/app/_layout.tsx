import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from 'expo-router';
import { LocaleDirContext } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';

// Side-effect: i18next must be initialized before any screen calls t().
// (Web static rendering imports route modules outside the /index.ts entry.)
import '@/i18n';
import { Stack } from '@/navigation/stack';
import { bagSheet, dropdown, slideOver, zoomIn } from '@/navigation/transitions';
import { useSettings } from '@/store/settings';
import { isRTL, ThemeController, useAppFonts, useAppTheme } from '@/theme';

export {
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

/** Build a React Navigation theme from the active Unistyles theme. */
function useNavigationTheme(): Theme {
  const theme = useAppTheme();
  const base = theme.isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.accent,
    },
  };
}

export default function RootLayout() {
  const [loaded, error] = useAppFonts();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const theme = useAppTheme();
  const navigationTheme = useNavigationTheme();
  const { t } = useTranslation();
  const language = useSettings(s => s.language);
  const rtl = isRTL(language);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <KeyboardProvider>
          {/* Keeps Unistyles in sync with persisted brand/mode/font + OS scheme. */}
          <ThemeController />
          {/* Navigation reads its direction from LocaleDirContext, which
              defaults to the CACHED startup I18nManager constant. Track the
              live language instead so push/pop animations and the iOS
              swipe-back gesture mirror on a runtime flip (react-native-rtl). */}
          <LocaleDirContext.Provider value={rtl ? 'rtl' : 'ltr'}>
            <ThemeProvider value={navigationTheme}>
              <StatusBar style={theme.isDark ? 'light' : 'dark'} />
              {/* Blank stack (react-native-screen-transitions): every push,
                  gesture and shared-element morph is a Reanimated worklet, so
                  Android and web animate the same as iOS. There is no native
                  header anywhere — screens draw their own chrome (`AppHeader`);
                  `title` still feeds the web <title>. */}
              <Stack>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="product/[id]" options={{ ...slideOver(rtl), title: '' }} />
                <Stack.Screen name="photo/[id]" options={{ ...slideOver(rtl), title: '' }} />
                <Stack.Screen name="component/[slug]" options={{ ...zoomIn(), title: '' }} />
                <Stack.Screen
                  name="preferences"
                  options={{ ...slideOver(rtl), title: t('preferences.title') }}
                />
                <Stack.Screen
                  name="orders"
                  options={{ ...slideOver(rtl), title: t('orders.title') }}
                />
                <Stack.Screen
                  name="wishlist"
                  options={{ ...slideOver(rtl), title: t('wishlist.title') }}
                />
                <Stack.Screen name="search" options={{ ...dropdown(), title: t('search.title') }} />
                <Stack.Screen name="bag" options={{ ...bagSheet(), title: t('bag.title') }} />
              </Stack>
            </ThemeProvider>
          </LocaleDirContext.Provider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create(theme => ({
  // Backgrounds the whole navigator — the blank stack has no per-screen
  // `contentStyle`, so the root supplies the colour behind transitions.
  flex: { backgroundColor: theme.colors.background, flex: 1 },
}));
