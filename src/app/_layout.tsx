import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import SplashScreenComponent from "@/components/splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide native splash after a brief delay
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleSplashDone = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreenComponent onComplete={handleSplashDone} />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Main App Tabs */}
        <Stack.Screen name="(tabs)" />

        {/* Auth Routes */}
        <Stack.Screen name="(auth)" />
      </Stack>
    </ThemeProvider>
  );
}
