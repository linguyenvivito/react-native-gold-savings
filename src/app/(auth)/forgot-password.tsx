import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
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
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a password reset link
            </Text>
          </View>

          {!submitted ? (
            <>
              {/* Form */}
              <View style={styles.form}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!submitted}
                  />
                </View>

                {/* Reset Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.resetButton,
                    pressed && styles.resetButtonPressed,
                  ]}
                  onPress={handleResetPassword}
                >
                  <Text style={styles.resetButtonText}>Send Reset Link</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successMessage}>
                We've sent a password reset link to {email}. Please check your
                inbox and follow the instructions to reset your password.
              </Text>
            </View>
          )}

          {/* Back to Login Link */}
          <View style={styles.backContainer}>
            <Text style={styles.backText}>Remember your password? </Text>
            <Link href="/login" style={styles.backLink}>
              <Text style={styles.backLinkText}>Login</Text>
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
    textAlign: "center",
    lineHeight: 24,
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
  resetButton: {
    backgroundColor: "#d4af37",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  resetButtonPressed: {
    backgroundColor: "#c9a227",
    opacity: 0.8,
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  successContainer: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#d1fae5",
    borderRadius: 10,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#065f46",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    fontWeight: "500",
    color: "#047857",
    textAlign: "center",
    lineHeight: 20,
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    color: "#6b7280",
    fontSize: 14,
  },
  backLink: {
    paddingHorizontal: 4,
  },
  backLinkText: {
    color: "#d4af37",
    fontSize: 14,
    fontWeight: "700",
  },
});
