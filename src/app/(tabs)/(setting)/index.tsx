import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import i18n from "@/i18n";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { locale, toggleLocale } = useLocale();
  const [notifications, setNotifications] = useState(true);

  const handleLanguageToggle = async () => {
    await toggleLocale();
    router.replace("/(auth)/login");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.title}>{i18n.t("settings.title")}</Text>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t("settings.account")}</Text>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {i18n.t("settings.profileInformation")}
              </Text>
              <Text style={styles.settingValue}>•••</Text>
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {i18n.t("settings.changePassword")}
              </Text>
              <Text style={styles.settingValue}>•••</Text>
            </Pressable>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t("settings.preferences")}</Text>

            {/* Language Setting */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Text style={styles.settingLabel}>{i18n.t("settings.language")}</Text>
                <Text style={styles.settingValue}>
                  {locale === "en"
                    ? i18n.t("settings.english")
                    : i18n.t("settings.vietnamese")}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: locale === "en" ? "#3b82f6" : "#10b981",
                  },
                ]}
                onPress={handleLanguageToggle}
              >
                <Text style={styles.toggleButtonText}>
                  {locale === "en" ? "EN" : "VI"}
                </Text>
              </Pressable>
            </View>

            {/* Notifications Setting */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {i18n.t("settings.notifications")}
              </Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#e5e7eb", true: "#a5f3fc" }}
                thumbColor={notifications ? "#3b82f6" : "#9ca3af"}
              />
            </View>
          </View>

          {/* App Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t("settings.app")}</Text>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>{i18n.t("settings.appVersion")}</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>
                {i18n.t("settings.aboutGoldSavings")}
              </Text>
              <Text style={styles.settingValue}>•••</Text>
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>{i18n.t("settings.privacyPolicy")}</Text>
              <Text style={styles.settingValue}>•••</Text>
            </Pressable>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>{i18n.t("settings.logout")}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#d4af37",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d4af37",
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9ca3af",
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  logoutSection: {
    marginTop: 32,
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  logoutButtonPressed: {
    backgroundColor: "#b91c1c",
    opacity: 0.8,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
