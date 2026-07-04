import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
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
  const colorScheme = useColorScheme();
  const { logout } = useAuth();
  const [language, setLanguage] = useState(i18n.locale);
  const [notifications, setNotifications] = useState(true);

  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "vi" : "en";
    setLanguage(newLanguage);
    i18n.locale = newLanguage;
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Text style={styles.title}>Settings</Text>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>Profile Information</Text>
              <Text style={styles.settingValue}>•••</Text>
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingValue}>•••</Text>
            </Pressable>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            {/* Language Setting */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingValue}>
                  {language === "en" ? "English" : "Tiếng Việt"}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: language === "en" ? "#3b82f6" : "#10b981",
                  },
                ]}
                onPress={handleLanguageToggle}
              >
                <Text style={styles.toggleButtonText}>
                  {language === "en" ? "EN" : "VI"}
                </Text>
              </Pressable>
            </View>

            {/* Notifications Setting */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Notifications</Text>
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
            <Text style={styles.sectionTitle}>App</Text>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>App Version</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>About Gold Savings</Text>
              <Text style={styles.settingValue}>•••</Text>
            </Pressable>
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
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
              <Text style={styles.logoutButtonText}>Logout</Text>
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
