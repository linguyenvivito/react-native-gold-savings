import { ThemedView } from "@/components/themed-view";
import i18n from "@/i18n";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    setSubmitted(true);
    alert("Password reset link sent to " + email);
  };

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="min-h-full grow justify-center px-5 pb-10"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 items-center">
            <Text className="mb-2 text-4xl font-extrabold text-main-primary">{i18n.t("auth.forgotPassword") || "Forgot Password"}</Text>
            <Text className="text-center text-base font-medium leading-6 text-slate-500">
              {i18n.t("auth.enterEmailForReset") || "Enter your email to receive a password reset link"}
            </Text>
          </View>

          {!submitted ? (
            <View className="mb-6">
              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-slate-700">{i18n.t("auth.email") || "Email Address"}</Text>
                <TextInput
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-main-primary"
                  placeholder={i18n.t("auth.enterEmail") || "Enter your email"}
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!submitted}
                />
              </View>

              <Pressable
                className="mt-2 rounded-xl bg-amber-600 px-4 py-3.5 active:bg-amber-700"
                onPress={handleResetPassword}
              >
                <Text className="text-center text-base font-bold text-white">{i18n.t("auth.sendResetLink") || "Send Reset Link"}</Text>
              </Pressable>
            </View>
          ) : (
            <View className="mb-6 items-center rounded-xl border border-emerald-100 bg-emerald-50 p-5">
              <Text className="mb-2 text-lg font-bold text-emerald-900">{i18n.t("auth.checkYourEmail") || "Check Your Email"}</Text>
              <Text className="text-center text-sm font-medium leading-5 text-emerald-700">
                {i18n.t("auth.passwordResetLinkSent", { email }) || `We've sent a password reset link to ${email}. Please check your inbox and follow the instructions to reset your password.`}
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-slate-500">{i18n.t("auth.rememberYourPassword") || "Remember your password?"} </Text>
            <Link href="/login" className="px-1 text-sm font-bold text-main-primary">
              {i18n.t("auth.login") || "Login"}
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
