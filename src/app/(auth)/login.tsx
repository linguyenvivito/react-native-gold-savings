import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import i18n from "@/i18n";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.replace("/(tabs)/(dashboard)");
    }
  }, [isLoading, isLoggedIn, router]);

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      Alert.alert("Missing Information", "Please enter email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await login(normalizedEmail, password);
      if (success) {
        router.replace("/(tabs)/(dashboard)");
      } else {
        Alert.alert(
          "Login Failed",
          "Invalid email/password or account not confirmed.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || !email.trim() || !password;

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerClassName="min-h-full grow justify-center px-5 pb-10"
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-8 items-center">
              <Text className="mb-2 text-4xl font-extrabold text-main-primary">
                {i18n.t("auth.welcomeBack") || "Welcome Back"}
              </Text>
              <Text className="text-base font-medium text-slate-500">
                {i18n.t("auth.signIn") || "Sign in to your account"}
              </Text>
            </View>

            <View className="mb-6">
              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  {i18n.t("auth.email") || "Email"}
                </Text>
                <TextInput
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-main-primary"
                  placeholder={i18n.t("auth.enterEmail") || "Enter your email"}
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
              </View>

              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-slate-700">
                  {i18n.t("auth.password") || "Password"}
                </Text>
                <TextInput
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-main-primary"
                  placeholder={i18n.t("auth.enterPassword") || "Enter your password"}
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
              </View>

              <Pressable
                className="mt-2 rounded-xl bg-amber-600 px-4 py-3.5 active:bg-amber-700"
                onPress={handleLogin}
                disabled={isButtonDisabled}
                style={({ pressed }) => ({
                  opacity: isButtonDisabled ? 0.6 : pressed ? 0.8 : 1,
                })}
              >
                <Text className="text-center text-base font-bold text-white">
                  {isSubmitting ? i18n.t("auth.signingIn") || "Signing In..." : i18n.t("auth.login") || "Login"}
                </Text>
              </Pressable>
            </View>

            <View className="mb-4 items-center">
              <Link
                href="/(auth)/forgot-password"
                className="py-2 text-sm font-semibold text-main-primary"
              >
                {i18n.t("auth.forgotPassword") || "Forgot Password?"}
              </Link>
            </View>

            <View className="flex-row items-center justify-center">
              <Text className="text-sm text-slate-500">
                {i18n.t("auth.noAccount") || "Don't have an account?"}{" "}
              </Text>
              <Link
                href="/(auth)/register"
                className="px-1 text-sm font-bold text-main-primary"
              >
                {i18n.t("auth.register") || "Register"}
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}
