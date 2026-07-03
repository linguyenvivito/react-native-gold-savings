import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";
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

      {/* AI Agent Tab */}
      <Tabs.Screen
        name="(aiagent)"
        options={{
          title: i18n.t("tabs.aiagent"),
          tabBarLabel: "",
          tabBarIcon: () => (
            <View style={[styles.fab, { backgroundColor: colors.tint }]}>
              <MaterialCommunityIcons name="robot" size={26} color="#fff" />
            </View>
          ),
          tabBarItemStyle: styles.fabItem,
        }}
      />

      {/* Donate Tab */}
      <Tabs.Screen
        name="(donate)"
        options={{
          title: i18n.t("tabs.donate"),
          tabBarLabel: i18n.t("tabs.donate"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hand-heart"
              size={size}
              color={color}
            />
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

      {/* Auth Tab — hidden from tab bar */}
      <Tabs.Screen name="(auth)" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fabItem: {
    marginTop: -22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
  },
});
