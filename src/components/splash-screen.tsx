import { useEffect } from "react";
import {
    Pressable,
    ScrollView,
    Text,
    useColorScheme,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { AnimatedIcon } from "@/components/animated-icon";
import { Colors } from "@/constants/theme";
import i18n from "@/i18n";
import { SafeAreaView } from "react-native-safe-area-context";

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    // Auto-complete splash after 5 seconds
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
      className="absolute inset-0 z-[9999]"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerClassName="min-h-full grow items-center justify-center px-5 py-10"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(800)}
          className="mb-8 h-[200px] w-[200px] items-center justify-center"
        >
          <AnimatedIcon />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(300)}
          className="mb-10 items-center"
        >
          <Text className="mb-2 text-4xl font-bold" style={{ color: colors.tint }}>
            {i18n.t("app.name") || "Gold Savings"}
          </Text>
          <Text className="text-base" style={{ color: colors.text }}>
            {i18n.t("app.tagline") || "Track Your Golden Investments"}
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(600)}
          className="mb-8 w-full rounded-xl px-4 py-5"
          style={{ backgroundColor: "rgba(212, 175, 55, 0.08)" }}
        >
          <View className="flex-row items-center justify-between border-b border-amber-200 py-2.5">
            <Text className="text-sm font-medium" style={{ color: colors.text }}>
              {i18n.t("app.version") || "Version"}
            </Text>
            <Text className="text-sm font-semibold" style={{ color: colors.tint }}>
              1.0.0
            </Text>
          </View>

          <View className="flex-row items-center justify-between border-b border-amber-200 py-2.5">
            <Text className="text-sm font-medium" style={{ color: colors.text }}>
              {i18n.t("app.developer") || "Developer"}
            </Text>
            <Text className="text-sm font-semibold" style={{ color: colors.tint }}>
              Minh Tuan Nguyen
            </Text>
          </View>

          <View className="flex-row items-center justify-between border-b border-amber-200 py-2.5">
            <Text className="text-sm font-medium" style={{ color: colors.text }}>
              {i18n.t("app.language") || "Language"}
            </Text>
            <Text className="text-sm font-semibold" style={{ color: colors.tint }}>
              {i18n.locale.toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(900)}
          className="mb-5 w-full"
        >
          <Pressable
            onPress={handleGetStarted}
            className="items-center justify-center rounded-lg px-6 py-3.5"
            style={{ backgroundColor: colors.tint }}
          >
            <Text className="text-base font-semibold" style={{ color: colors.background }}>
              {i18n.t("app.getStarted") || "Get Started"}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(1200)}
          className="mt-5"
        >
          <Text className="text-center text-xs" style={{ color: colors.text }}>
            © 2026 {i18n.t("app.name") || "Gold Savings"}. All rights reserved.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
