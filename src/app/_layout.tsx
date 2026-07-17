import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "../../global.css";

import SplashScreenComponent from "@/components/splash-screen";
import { AddTransactionModalProvider } from "@/context/add-transaction-modal-context";
import { ProfileProvider } from "@/context/profile-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { LocaleProvider, useLocale } from "@/context/locale-context";
import { initializeExpoNotifications } from "@/features/notification/expo-notifications";
import {
  registerPushTokenForUser,
  resolveBackendUserId,
} from "@/features/notification/notification.router";
import { ThemeContextProvider, useThemeContext } from "@/context/theme-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";

ExpoSplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isLoggedIn, isLoading, currentUser } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const lastRegisteredTokenKey = useRef<string | null>(null);

  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    let mounted = true;

    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (event) => {
        if (!mounted) {
          return;
        }
        console.log("[notifications] Received", event.request.identifier);
      },
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (!mounted) {
          return;
        }
        console.log(
          "[notifications] Opened",
          response.notification.request.identifier,
        );
      });

    const bootstrap = async () => {
      const token = await initializeExpoNotifications();
      if (!token) {
        return;
      }

      console.log("[notifications] Expo push token", token);

      const backendUserId = resolveBackendUserId(currentUser);
      if (!backendUserId) {
        console.warn(
          "[notifications] Missing backend user id; token not persisted.",
        );
        return;
      }

      const registrationKey = `${backendUserId}:${token}`;
      if (lastRegisteredTokenKey.current === registrationKey) {
        return;
      }

      try {
        const registered = await registerPushTokenForUser(
          backendUserId,
          token,
          "expo",
        );
        if (registered) {
          lastRegisteredTokenKey.current = registrationKey;
          console.log(
            "[notifications] Push token registered to backend user",
            backendUserId,
          );
        }
      } catch (error) {
        console.warn("[notifications] Failed to register push token", error);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [currentUser]);

  const ready = splashDone && !isLoading;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      {ready && !isLoggedIn && <Redirect href="/(auth)/auth" />}
      {ready && isLoggedIn && <Redirect href="/(tabs)/(dashboard)" />}
      {!splashDone && (
        <SplashScreenComponent onComplete={() => setSplashDone(true)} />
      )}
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeContextProvider>
      <LocaleProvider>
        <RootLayoutContent />
        {/* Place Toast component here at the root level */}
        <Toast />
      </LocaleProvider>
    </ThemeContextProvider>
  );
}

function RootLayoutContent() {
  const { isReady: localeReady } = useLocale();
  const { colorScheme } = useThemeContext();

  if (!localeReady) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ProfileProvider>
          <AddTransactionModalProvider>
            <RootNavigator />
          </AddTransactionModalProvider>
        </ProfileProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
