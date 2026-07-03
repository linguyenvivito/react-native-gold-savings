import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { Colors } from "@/constants/theme";
import i18n from "@/i18n";

export default function AppTabs() {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.tabIconDefault,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      {/* Dashboard Tab */}
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: i18n.t("tabs.dashboard"),
          tabBarLabel: i18n.t("tabs.dashboard"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-pie"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Auth Tab */}
      <Tabs.Screen
        name="(auth)"
        options={{
          title: i18n.t("tabs.auth"),
          tabBarLabel: i18n.t("tabs.auth"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="lock" size={size} color={color} />
          ),
        }}
      />

      {/* Assets Tab */}
      <Tabs.Screen
        name="(asset)"
        options={{
          title: i18n.t("tabs.assets"),
          tabBarLabel: i18n.t("tabs.assets"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="star" size={size} color={color} />
          ),
        }}
      />

      {/* Setting Tab */}
      <Tabs.Screen
        name="(setting)"
        options={{
          title: i18n.t("tabs.settings"),
          tabBarLabel: i18n.t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
