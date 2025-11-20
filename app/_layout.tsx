import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/src/hooks';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import "../global.css";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize Firebase (non-blocking)
        // Import Firebase to trigger initialization
        await import('@/src/firebase/firebase');
        
        // Wait a bit for navigation and other resources to be ready
        // This ensures the app is fully loaded before hiding splash
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAppIsReady(true);
      } catch (error) {
        console.error('Error during app initialization:', error);
        setInitializationError(error instanceof Error ? error : new Error('Unknown initialization error'));
        // Still set app as ready so it can render error state
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide splash screen once app is ready and layout is complete
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error hiding splash screen:', e);
      }
    }
  }, [appIsReady]);

  // Handle route protection
  useEffect(() => {
    if (authLoading || !appIsReady) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

    if (!user && !inAuthGroup) {
      // If user is not signed in and the initial segment is not anything in the auth group.
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(tabs)');
    }
  }, [user, segments, authLoading, appIsReady, router]);

  // Don't render until app is ready
  if (!appIsReady) {
    return null;
  }

  // Show error state if initialization failed (optional - can be removed if not needed)
  if (initializationError) {
    console.warn('App initialized with errors:', initializationError.message);
    // Continue rendering - Firebase errors shouldn't block the app
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack>
          {/* Index/Redirect */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          
          {/* Auth Screens */}
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          
          {/* Main App */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Campaign Details */}
          <Stack.Screen 
            name="campaign/[id]" 
            options={{ headerShown: false }} 
          />
          
          {/* Donation Screen */}
          <Stack.Screen 
            name="donate/[campaignId]" 
            options={{ headerShown: false }} 
          />
          
          {/* Profile */}
          <Stack.Screen 
            name="profile" 
            options={{ headerShown: false }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}
