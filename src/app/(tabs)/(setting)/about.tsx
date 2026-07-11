import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView, Text } from "react-native";

export default function AboutScreen() {
  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="items-center justify-center px-5 pb-10"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full rounded-lg bg-white p-5 shadow-md">
            <Text className="text-center text-lg font-bold text-slate-800">
              About Gold Savings
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
