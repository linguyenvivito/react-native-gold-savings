import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import i18n from "@/i18n";
import { useRouter } from "expo-router";
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

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const success = await register(username, email, password);
    if (!success) {
      alert("Registration failed. Email may already be in use.");
      return;
    }

    alert("Registration successful. Please check your email confirmation, then login.");
    router.replace("/(auth)/login");
  };

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="min-h-full grow justify-center px-5 pb-10"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 items-center">
            <Text className="mb-2 text-4xl font-extrabold text-main-primary">{i18n.t("auth.register") || "Create Account"}</Text>
            <Text className="text-base font-medium text-slate-500">{i18n.t("auth.signUp") || "Join us today"}</Text>
          </View>

          <View className="mb-6">
            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">{i18n.t("auth.username") || "Username"}</Text>
              <TextInput
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-main-primary"
                placeholder={i18n.t("auth.enterUsername") || "Enter your username"}
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">{i18n.t("auth.email") || "Email"}</Text>
              <TextInput
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-main-primary"
                placeholder={i18n.t("auth.enterEmail") || "Enter your email"}
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">{i18n.t("auth.password") || "Password"}</Text>
              <TextInput
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-main-primary"
                placeholder={i18n.t("auth.enterPassword") || "Enter your password"}
                placeholderTextColor="#9ca3af"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-slate-700">{i18n.t("auth.confirmPassword") || "Confirm Password"}</Text>
              <TextInput
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-base text-main-primary"
                placeholder={i18n.t("auth.enterConfirmPassword") || "Confirm your password"}
                placeholderTextColor="#9ca3af"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <Pressable
              className="mt-2 rounded-xl bg-amber-600 px-4 py-3.5 active:bg-amber-700"
              onPress={handleRegister}
            >
              <Text className="text-center text-base font-bold text-white">{i18n.t("auth.createAccount") || "Create Account"}</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center justify-center">
            <Text className="text-sm text-slate-500">{i18n.t("auth.alreadyHaveAccount") || "Already have an account?"} </Text>
            <Link href="/(auth)/login" className="px-1 text-sm font-bold text-main-primary">
              {i18n.t("auth.login") || "Login"}
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
