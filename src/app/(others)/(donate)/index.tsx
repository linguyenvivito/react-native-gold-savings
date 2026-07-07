import { ThemedView } from "@/components/themed-view";
import { ScrollView, Image, SafeAreaView, View } from "react-native";

export default function DonateScreen() {
  return (
    <ThemedView className="flex-1 bg-slate-50">
      <ScrollView
        contentContainerClassName="px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center pt-10 mt-10">
          {/* Network Asset */}
          <Image
            source={{
              uri: "https://cdn.hdbank.com.vn/hdbank-file/news/editor/95LaBftBbhDnjGKgbDJT20231228154717/taomaqrtaikhoannganhangagribank_1703753546547.png",
            }}
            className="mb-4 self-center"
            style={{ width: 300, height: 600 }}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
