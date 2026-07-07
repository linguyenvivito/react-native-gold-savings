import { Stack, useRouter, useSegments } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

const SEGMENT_LABELS: Record<string, string> = {
  "(dashboard)": "Dashboard",
  "(asset)": "Assets",
  "(aiagent)": "AI Agent",
  "(donate)": "Donate",
  "(setting)": "Settings",
  "(auth)": "Account",
  login: "Login",
  register: "Register",
  "forgot-password": "Forgot Password",
};

function BreadcrumbHeader() {
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const crumbs = segments
    .filter((s) => SEGMENT_LABELS[s])
    .map((s) => SEGMENT_LABELS[s]);

  if (crumbs.length === 0) return null;

  const canGoBack = crumbs.length > 1;

  return <></>;
}

export default function Breadcrumbs() {
  return <Stack screenOptions={{ header: () => <BreadcrumbHeader /> }} />;
}
