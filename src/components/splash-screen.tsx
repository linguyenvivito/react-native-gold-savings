import { useEffect } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AnimatedIcon } from "@/components/animated-icon";
import { Colors } from "@/constants/theme";
import i18n from "@/i18n";

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    // Auto-complete splash after 4 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleGetStarted = () => {
    onComplete?.();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(800)}
          style={styles.logoContainer}
        >
          <AnimatedIcon />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(300)}
          style={styles.infoContainer}
        >
          <Text style={[styles.appTitle, { color: colors.tint }]}>
            {i18n.t("app.name") || "Gold Savings"}
          </Text>
          <Text style={[styles.tagline, { color: colors.text }]}>
            {i18n.t("app.tagline") || "Track Your Golden Investments"}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(600)}
          style={styles.detailsContainer}
        >
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              {i18n.t("app.version") || "Version"}
            </Text>
            <Text style={[styles.detailValue, { color: colors.tint }]}>
              1.0.0
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              {i18n.t("app.developer") || "Developer"}
            </Text>
            <Text style={[styles.detailValue, { color: colors.tint }]}>
              Gold Savings Team
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.text }]}>
              {i18n.t("app.language") || "Language"}
            </Text>
            <Text style={[styles.detailValue, { color: colors.tint }]}>
              {i18n.locale.toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(900)}
          style={styles.buttonContainer}
        >
          <Pressable
            onPress={handleGetStarted}
            style={[styles.button, { backgroundColor: colors.tint }]}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>
              {i18n.t("app.getStarted") || "Get Started"}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(1200)}
          style={styles.footerContainer}
        >
          <Text style={[styles.footerText, { color: colors.text }]}>
            © 2026 {i18n.t("app.name") || "Gold Savings"}. All rights reserved.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  detailsContainer: {
    width: "100%",
    paddingVertical: 20,
    marginBottom: 30,
    borderRadius: 12,
    backgroundColor: "rgba(212, 175, 55, 0.08)",
    paddingHorizontal: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.2)",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  footerContainer: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
