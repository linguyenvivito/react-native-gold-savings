import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView } from "react-native";

export default function PrivacyScreen() {
  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="min-h-full grow items-center justify-center px-5 pb-10"
          showsVerticalScrollIndicator={false}
        >
          <View>
            Privacy
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}