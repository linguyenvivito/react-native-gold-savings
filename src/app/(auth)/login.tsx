import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/context/auth-context";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

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
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
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

            {/* Login Button */}
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                isButtonDisabled && styles.loginButtonDisabled,
                pressed && styles.loginButtonPressed,
              ]}
              onPress={handleLogin}
              disabled={isButtonDisabled}
            >
              <Text style={styles.loginButtonText}>
                {isSubmitting ? "Signing In..." : "Login"}
              </Text>
            </Pressable>
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            <Link href="/(auth)/forgot-password" style={styles.link}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </Link>
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" style={styles.registerLink}>
              <Text style={styles.registerLinkText}>Register</Text>
            </Link>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#d4af37",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#d4af37",
  },
  loginButton: {
    backgroundColor: "#d4af37",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  loginButtonPressed: {
    backgroundColor: "#c9a227",
    opacity: 0.8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  linksContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  link: {
    paddingVertical: 8,
  },
  linkText: {
    color: "#d4af37",
    fontSize: 14,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: "#6b7280",
    fontSize: 14,
  },
  registerLink: {
    paddingHorizontal: 4,
  },
  registerLinkText: {
    color: "#d4af37",
    fontSize: 14,
    fontWeight: "700",
  },
});
