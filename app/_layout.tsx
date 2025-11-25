import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth, useNotifications } from "@/src/hooks";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import "react-native-reanimated";
import "../global.css";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, isLoading: authLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Initialize notifications
  useNotifications();

  const [appIsReady, setAppIsReady] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(
    null
  );

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize Firebase (non-blocking)
        // Import Firebase to trigger initialization
        await import("@/src/firebase/firebase");

        // Reduced delay for faster initial load
        await new Promise((resolve) => setTimeout(resolve, 100));

        setAppIsReady(true);
      } catch (error) {
        console.error("Error during app initialization:", error);
        setInitializationError(
          error instanceof Error
            ? error
            : new Error("Unknown initialization error")
        );
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
        console.warn("Error hiding splash screen:", e);
      }
    }
  }, [user?.role, user?.id, segments[0], authLoading, appIsReady]);

  // Show loading screen while app is initializing or auth is loading
  if (!appIsReady || authLoading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <Image
          source={require("../assets/app_logo.png")}
          className="w-32 h-32 mb-6"
          resizeMode="contain"
        />
        <Text className="text-white text-3xl font-bold mb-2">Donation App</Text>
        <ActivityIndicator size="large" color="#ff7a5e" className="mt-4" />
        <Text className="text-gray-400 mt-3 text-sm">Loading...</Text>
      </View>
    );
  }

  // Show error state if initialization failed (optional - can be removed if not needed)
  if (initializationError) {
    console.warn("App initialized with errors:", initializationError.message);
    // Continue rendering - Firebase errors shouldn't block the app
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack>
          {/* Index/Redirect */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Auth Screens */}
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen
            name="email-verification"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="forgot-password"
            options={{ headerShown: false }}
          />

          {/* Main App - User Tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* Admin Tabs */}
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />

          {/* Campaign Details */}
          <Stack.Screen name="campaign/[id]" options={{ headerShown: false }} />

          {/* Campaign Edit */}
          <Stack.Screen
            name="campaign/edit/[id]"
            options={{ headerShown: false }}
          />

          {/* Donation Screen */}
          <Stack.Screen
            name="donate/[campaignId]"
            options={{ headerShown: false }}
          />

          {/* Campaign Updates */}

          <Stack.Screen
            name="campaign/updates"
            options={{ headerShown: false }}
          />

          {/* Settings Screen */}
          <Stack.Screen name="settings" options={{ headerShown: false }} />

          {/* Notifications Screen */}
          <Stack.Screen name="notifications" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </View>
    </ThemeProvider>
  );
}
