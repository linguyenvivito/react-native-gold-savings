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
import Toast from 'react-native-toast-message';

export default function AnonymousScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const { updateAnonymousUser } = useAuth();

  useEffect(() => {
     Alert.alert(
          "test",
          "test",
        );
  }, []);

  const handleUpdate = async () => {
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
      const success = await updateAnonymousUser(normalizedEmail, password);
      if (success) {
        triggerSuccessAlert();
      } else {
        Alert.alert(
          "Update Failed",
          "Unable to update your profile.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = isSubmitting || !email.trim() || !password;

  const triggerSuccessAlert = () => {
    Toast.show({
      type: 'success',
      text1: 'Success!',
      text2: 'Your profile has been updated smoothly. 👋',
      position: 'bottom',
      visibilityTime: 2000,
      autoHide: true,
      bottomOffset: 120,
    });
  };

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerClassName="justify-center px-5 pb-10"
            showsVerticalScrollIndicator={false}
          >

            <Text className="mb-4 text-center text-lg font-semibold text-slate-700">
              Your current user ID: {currentUser?.id || "No user logged in"}
            </Text>

            <View className="mb-6 mt-5">
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
                  placeholder={
                    i18n.t("auth.enterPassword") || "Enter your password"
                  }
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleUpdate}
                />
              </View>

              <Pressable
                className="mt-2 rounded-xl bg-amber-600 px-4 py-3.5 active:bg-amber-700"
                onPress={handleUpdate}
                disabled={isButtonDisabled}
                style={({ pressed }) => ({
                  opacity: isButtonDisabled ? 0.6 : pressed ? 0.8 : 1,
                })}
              >
                <Text className="text-center text-base font-bold text-white">
                  {isSubmitting
                    ? i18n.t("auth.updating") || "Updating..."
                    : i18n.t("auth.update") || "Update"}
                </Text>
              </Pressable>
            </View>
            

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}
