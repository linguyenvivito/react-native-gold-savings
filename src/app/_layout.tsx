import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import SplashScreenComponent from "@/components/splash-screen";

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashDone, setSplashDone] = useState(false);
  const router = useRouter();

  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  const handleSplashDone = () => {
    setSplashDone(true);
  };

  useEffect(() => {
    if (splashDone) {
      router.replace("/(tabs)/(dashboard)/dashboard");
    }
  }, [splashDone]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {!splashDone && <SplashScreenComponent onComplete={handleSplashDone} />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </ThemeProvider>
  );
}
