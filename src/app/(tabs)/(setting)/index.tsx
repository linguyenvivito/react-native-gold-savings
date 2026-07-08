import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { useThemeContext } from "@/context/theme-context";
import i18n from "@/i18n";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { locale, toggleLocale } = useLocale();
  const { colorScheme, toggleTheme } = useThemeContext();
  const [notifications, setNotifications] = useState(true);

  const handleLanguageToggle = async () => {
    await toggleLocale();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ThemedView className="flex-1 bg-amber-50">
      <SafeAreaView className="flex-1 bg-amber-50">
        <View className="px-5 py-5">
          <View className="p-2 flex-row items-center border border-green-600 rounded-xl bg-green-50">
            <Text className="p-3 text-green-600">
              <MaterialCommunityIcons
                name="security"
                size={24}
                className="text-green-600"
              />
            </Text>
            <Text className="text-green-600 font-bold font-mono text-lg">
              {i18n.t("settings.security_data")}
              {"\n"}
              <Text className="text-xs">
                {i18n.t("settings.security_data_info")}
              </Text>
            </Text>
          </View>
        </View>
        <ScrollView
          className="flex-1 bg-amber-50"
          contentContainerClassName="px-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-6">
            <Text className="mb-3 text-xl font-bold text-main-primary font-mono">
              {i18n.t("settings.account")}
            </Text>
            <Pressable className="mb-2 flex-row justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <View className="flex-1 items-center flex-row">
                <Text className="text-sm font-semibold pr-2">
                  <MaterialCommunityIcons
                    name="account"
                    size={20}
                    color="#d4af37"
                  />
                </Text>
                <Text className="text-sm font-semibold">
                  {i18n.t("settings.profileInformation")}
                </Text>
              </View>
              <Text className="text-xs font-medium text-slate-400">•••</Text>
            </Pressable>
            <Pressable className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <View className="flex-1 items-center flex-row">
                <Text className="text-sm font-semibold pr-2">
                  <MaterialCommunityIcons
                    name="lock"
                    size={20}
                    color="#d4af37"
                  />
                </Text>
                <Text className="text-sm font-semibold">
                  {i18n.t("settings.changePassword")}
                </Text>
              </View>
              <Text className="text-xs font-medium text-slate-400">•••</Text>
            </Pressable>
          </View>

          <View className="mb-6">
            <Text className="mb-3 text-xl font-bold text-main-primary font-mono">
              {i18n.t("settings.title")}
            </Text>

            <View className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <View className="flex-1">
                <Text className="mb-1 text-sm font-semibold">
                  {i18n.t("settings.language")}
                </Text>
                <Text className="text-xs font-medium text-slate-400">
                  {locale === "en"
                    ? i18n.t("settings.english")
                    : i18n.t("settings.vietnamese")}
                </Text>
              </View>
              <Pressable
                className={`rounded-md px-3 py-1.5 ${locale === "en" ? "bg-blue-500" : "bg-emerald-500"}`}
                onPress={handleLanguageToggle}
              >
                <Text className="text-xs font-bold text-white">
                  {locale === "en" ? "EN" : "VI"}
                </Text>
              </Pressable>
            </View>

            <View className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <View className="flex-1 items-center flex-row">
                <Text className="text-sm font-semibold pr-2">
                  <MaterialCommunityIcons
                    name="bell"
                    size={20}
                    color="#d4af37"
                  />
                </Text>
                <Text className="text-sm font-semibold">
                  {i18n.t("settings.notifications")}
                </Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#e5e7eb", true: "#a5f3fc" }}
                thumbColor={notifications ? "#3b82f6" : "#9ca3af"}
              />
            </View>

            <View className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <View className="flex-1 items-center flex-row">
                <Text className="text-sm font-semibold pr-2">
                  <MaterialCommunityIcons
                    name="weather-night"
                    size={20}
                    color="#d4af37"
                  />
                </Text>
                <Text className="text-sm font-semibold">
                  {i18n.t("settings.darkMode")}
                </Text>
              </View>
              <Switch
                value={colorScheme === "dark"}
                onValueChange={toggleTheme}
                trackColor={{ false: "#e5e7eb", true: "#fbbf24" }}
                thumbColor={colorScheme === "dark" ? "#d4af37" : "#9ca3af"}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="mb-3 text-xl font-bold text-main-primary font-mono">
              {i18n.t("settings.reference")}
            </Text>
            <Pressable className="mb-2 flex-row items-center justify-between  rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <View className="flex-1 items-center flex-row">
                <Text className="text-sm font-semibold pr-2">
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color="#d4af37"
                  />
                </Text>
                <Text className="text-sm font-semibold">
                  {i18n.t("settings.appVersion")}
                </Text>
              </View>
              <Text className="text-xs font-medium text-slate-400">1.0.0</Text>
            </Pressable>
            <Pressable className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <View className="flex-1 items-center flex-row">
                <Text className="text-sm font-semibold pr-2">
                  <MaterialCommunityIcons
                    name="gold"
                    size={20}
                    color="#d4af37"
                  />
                </Text>
                <Text className="text-sm font-semibold">
                  {i18n.t("settings.aboutGoldSavings")}
                </Text>
              </View>
              <Text className="text-xs font-medium text-slate-400">•••</Text>
            </Pressable>
            <Pressable className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5">
              <View className="flex-1 items-center flex-row">
                <Text className="text-sm font-semibold pr-2">
                  <MaterialCommunityIcons
                    name="file-document"
                    size={20}
                    color="#d4af37"
                  />
                </Text>
                <Text className="text-sm font-semibold">
                  {i18n.t("settings.privacyPolicy")}
                </Text>
              </View>
              <Text className="text-xs font-medium text-slate-400">•••</Text>
            </Pressable>
          </View>

          <View className="mb-10 mt-8">
            <Pressable
              className="rounded-xl bg-red-600 px-4 py-3.5 active:bg-red-700"
              onPress={handleLogout}
            >
              <Text className="text-center text-base font-bold text-white">
                {i18n.t("settings.logout")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
