import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import i18n from "@/i18n";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

import Animated, { FadeInDown } from "react-native-reanimated";
import { AnimatedIcon } from "@/components/animated-icon";

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { anonymousLogin } = useAuth();
  const router = useRouter();

  const handleAnonymousLogin = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await anonymousLogin();
      if (success) {
        router.replace("/(tabs)/(dashboard)");
        return;
      }

      Alert.alert("Login Failed", "Unable to start an anonymous session.");
    } catch (error) {
      console.error("Error during anonymous login:", error);
      Alert.alert("Login Failed", "Unable to start an anonymous session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="min-h-full grow items-center justify-center px-5 pb-10"
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
            <Text
              className="mb-2 text-4xl font-bold"
              style={{ color: colors.tint }}
            >
              {i18n.t("app.name") || "Gold Savings"}
            </Text>
            <Text className="text-base" style={{ color: colors.text }}>
              {i18n.t("app.tagline") || "Track Your Golden Investments"}
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(800).delay(600)}
            className="mb-8 w-full rounded-xl px-4 py-5"
          >
            <View>
              <View className="mb-6 items-center">
                <Pressable
                  onPress={handleAnonymousLogin}
                  disabled={isSubmitting}
                  className="rounded-xl bg-amber-600 px-4 py-3.5 active:bg-amber-700"
                  style={({ pressed }) => ({
                    opacity: isSubmitting ? 0.6 : pressed ? 0.8 : 1,
                  })}
                >
                  <Text className="text-base font-bold text-white">
                    {isSubmitting ? "Signing In..." : "Anonymous Login"}
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row items-center justify-center">
                <Link
                  href="/(auth)/login"
                  className="rounded-xl bg-amber-600 px-4 py-3.5 active:bg-amber-700 text-base font-bold text-white"
                >
                  Sign in with credentials
                </Link>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
