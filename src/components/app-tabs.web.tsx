import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useLocale } from "@/context/locale-context";
import i18n from "@/i18n";
import { triggerSpeechIntent } from "@/features/ai/speech-intent";

export default function AppTabs() {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const { locale } = useLocale();

  return (
    <Tabs
      key={locale}
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
        listeners={{
          tabPress: () => {
            triggerSpeechIntent();
          },
        }}
        options={{
          title: i18n.t("tabs.aiagent"),
          tabBarLabel: "",
          tabBarIcon: () => (
            <View
              className="h-[60px] w-[60px] items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.tint,
                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              }}
            >
              <MaterialCommunityIcons name="robot" size={26} color="#fff" />
            </View>
          ),
          tabBarItemStyle: {
            marginTop: -22,
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          },
        }}
      />

      {/* Market Tab */}
      <Tabs.Screen
        name="(market)"
        options={{
          title: i18n.t("tabs.market"),
          tabBarLabel: i18n.t("tabs.market"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="currency-usd"
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
