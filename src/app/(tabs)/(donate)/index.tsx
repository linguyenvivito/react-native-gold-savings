import { ThemedView } from "@/components/themed-view";
import {
    ScrollView,
    StyleSheet,
    Image,
} from "react-native";


export default function DonateScreen() {


  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Network Asset */}
      <Image 
        source={{ uri: 'https://cdn.hdbank.com.vn/hdbank-file/news/editor/95LaBftBbhDnjGKgbDJT20231228154717/taomaqrtaikhoannganhangagribank_1703753546547.png' }} 
        style={{ width: 300, height: 600, alignSelf: 'center', marginBottom: 16 }}
      />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  }
});
