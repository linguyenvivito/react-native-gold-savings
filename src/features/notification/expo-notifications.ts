import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

function isExpoGoClient(): boolean {
  const executionEnvironment = Constants.executionEnvironment;

  // In current Expo SDKs, storeClient indicates Expo Go.
  if (executionEnvironment === "storeClient") {
    return true;
  }

  // Keep legacy fallback for older runtimes.
  const appOwnership = Constants.appOwnership;
  return appOwnership === "expo" || appOwnership === "guest";
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function isPermissionGranted(permission: Notifications.NotificationPermissionsStatus): boolean {
  const candidate = permission as unknown as {
    granted?: boolean;
    status?: string;
  };

  if (typeof candidate.granted === "boolean") {
    return candidate.granted;
  }

  return candidate.status === "granted";
}

export async function initializeExpoNotifications(): Promise<string | null> {
  if (Platform.OS === "web") {
    return null;
  }

  const isExpoGo = isExpoGoClient();
  if (Platform.OS === "android" && isExpoGo) {
    console.warn(
      "[notifications] Android remote push is not available in Expo Go (SDK 53+). Use a development build for push token testing.",
    );
    return null;
  }

  if (!Device.isDevice) {
    console.warn("[notifications] Push notifications require a physical device.");
    return null;
  }

  const existing = await Notifications.getPermissionsAsync();
  let granted = isPermissionGranted(existing);

  if (!granted) {
    const requested = await Notifications.requestPermissionsAsync();
    granted = isPermissionGranted(requested);
  }

  if (!granted) {
    console.warn("[notifications] Notification permission not granted.");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#d4af37",
    });
  }

  const projectId =
    process.env.EXPO_PUBLIC_EXPO_PROJECT_ID?.trim() ||
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.warn("[notifications] Missing Expo projectId for push token registration.");
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch (error) {
    console.warn("[notifications] Failed to get Expo push token.", error);
    return null;
  }
}
