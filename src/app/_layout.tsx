import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import { LocaleDirContext } from 'expo-router/react-navigation';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import 'react-native-reanimated';

// Side-effect: i18next must be initialized before any screen calls t().
// (Web static rendering imports route modules outside the /index.ts entry.)
import '@/i18n';
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
  const language = useSettings((s) => s.language);

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
          <LocaleDirContext.Provider value={isRTL(language) ? 'rtl' : 'ltr'}>
            <ThemeProvider value={navigationTheme}>
              <StatusBar style={theme.isDark ? 'light' : 'dark'} />
              <Stack
                screenOptions={{
                  contentStyle: { backgroundColor: theme.colors.background },
                  headerStyle: { backgroundColor: theme.colors.surface },
                  headerTintColor: theme.colors.text,
                  headerTitleStyle: { fontFamily: theme.typography.family.semibold },
                }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: 'modal', title: t('modal.title') }}
                />
              </Stack>
            </ThemeProvider>
          </LocaleDirContext.Provider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // `flex: 1` is layout structure, not a themeable design token.
  flex: { flex: 1 },
});
