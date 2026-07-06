import { Stack, useRouter, useSegments } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.background,
          borderBottomColor: colors.backgroundElement,
        },
      ]}
    >
      {canGoBack && (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={20}
            color={colors.tint}
          />
        </Pressable>
      )}

      <View style={styles.crumbs}>
        {crumbs.map((crumb, i) => (
          <View key={i} style={styles.crumbItem}>
            {i > 0 && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={14}
                color={colors.textSecondary}
                style={styles.separator}
              />
            )}
            <Text
              style={[
                styles.crumbText,
                {
                  color:
                    i === crumbs.length - 1
                      ? colors.tint
                      : colors.textSecondary,
                },
                i === crumbs.length - 1 && styles.crumbTextActive,
              ]}
            >
              {crumb}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function Breadcrumbs() {
  return <Stack screenOptions={{ header: () => <BreadcrumbHeader /> }} />;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  crumbs: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  crumbItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    marginHorizontal: 4,
  },
  crumbText: {
    fontSize: 14,
    fontWeight: "500",
  },
  crumbTextActive: {
    fontWeight: "700",
    fontSize: 15,
  },
});
