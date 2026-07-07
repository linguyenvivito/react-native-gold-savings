import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import "../../global.css";

import SplashScreenComponent from "@/components/splash-screen";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { LocaleProvider, useLocale } from "@/context/locale-context";

ExpoSplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  const ready = splashDone && !isLoading;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      {ready && !isLoggedIn && <Redirect href="/(auth)/login" />}
      {ready && isLoggedIn && <Redirect href="/(tabs)/(dashboard)" />}
      {!splashDone && (
        <SplashScreenComponent onComplete={() => setSplashDone(true)} />
      )}
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <LocaleProvider>
      <RootLayoutContent colorScheme={colorScheme} />
    </LocaleProvider>
  );
}

function RootLayoutContent({
  colorScheme,
}: {
  colorScheme: "light" | "dark" | null | undefined;
}) {
  const { isReady } = useLocale();

  if (!isReady) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
