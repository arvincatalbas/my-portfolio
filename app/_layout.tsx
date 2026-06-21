import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { Platform } from 'react-native';
import Colors from '@/constants/Colors';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {Platform.OS === 'web' && (
        <style>{`
          /* SweetAlert Premium Theme Styles */
          .swal2-container {
            background-color: rgba(0, 0, 0, 0.4) !important;
            backdrop-filter: blur(4px) !important;
            -webkit-backdrop-filter: blur(4px) !important;
            z-index: 99999999 !important;
          }
          .swal2-popup.swal-premium-popup {
            border-radius: 24px !important;
            border: 1px solid ${themeColors.border} !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35) !important;
            font-family: 'Outfit', 'Montserrat', sans-serif !important;
          }
          .swal2-styled.swal2-confirm {
            border-radius: 12px !important;
            font-family: 'Outfit', 'Montserrat', sans-serif !important;
            font-weight: 600 !important;
            padding: 10px 24px !important;
            font-size: 15px !important;
          }
          .swal2-styled.swal2-cancel {
            border-radius: 12px !important;
            font-family: 'Outfit', 'Montserrat', sans-serif !important;
            font-weight: 600 !important;
            padding: 10px 24px !important;
            font-size: 15px !important;
          }
          .swal2-icon {
            border-width: 3px !important;
          }
        `}</style>
      )}
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

