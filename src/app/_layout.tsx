import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide native splash after a brief delay
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="splash"
      >
        {/* Splash Screen - shown first */}
        <Stack.Screen name="splash" />

        {/* Main App Tabs */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
