import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";

import { Colors } from "@/constants/theme";
import { useAddTransactionModal } from "@/context/add-transaction-modal-context";
import { useCenterTabMode } from "@/hooks/use-center-tab-mode";
import i18n from "@/i18n";
import { triggerSpeechIntent } from "@/features/ai/speech-intent";

export default function AppTabs() {
  const scheme = useColorScheme() ?? "light";
  const colors = Colors[scheme];
  const { openAddTransactionModal } = useAddTransactionModal();
  const { centerTabMode, remainingAiUses, recordAiAgentUsage } = useCenterTabMode();
  const isAddTransactionMode = centerTabMode === "add-transaction";

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
          height: 68,
          overflow: "visible", // allow FAB to overflow above bar
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

      {/* AI Agent Tab — center FAB */}
      <Tabs.Screen
        name="(aiagent)"
        listeners={{
          tabPress: (event) => {
            if (isAddTransactionMode) {
              event.preventDefault();
              openAddTransactionModal({ title: "Add Transaction" });
              return;
            }

            recordAiAgentUsage().catch(() => undefined);
            triggerSpeechIntent();
          },
        }}
        options={{
          title: isAddTransactionMode ? "Add Transaction" : i18n.t("tabs.aiagent"),
          tabBarLabel: "",
          tabBarIcon: () => (
            <View
              className="h-[60px] w-[60px] items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.tint,
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
              }}
            >
              <MaterialCommunityIcons
                name={isAddTransactionMode ? "plus" : "robot"}
                size={28}
                color="#fff"
              />
              {!isAddTransactionMode && (
                <View
                  className="absolute -right-1 -top-1 min-w-[22px] items-center rounded-full bg-white px-1.5 py-0.5"
                  style={{ elevation: 4 }}
                >
                  <Text className="text-[10px] font-bold text-main-primary">
                    {remainingAiUses}
                  </Text>
                </View>
              )}
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

      {/* Auth Other — hidden from other bar */}
      <Tabs.Screen name="(others)" options={{ href: null }} />
    </Tabs>
  );
}
