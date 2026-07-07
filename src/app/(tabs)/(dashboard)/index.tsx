import { ThemedView } from "@/components/themed-view";
import {
  fetchGoldDataPage,
  type GoldDataRow,
} from "@/features/dashboard/gold-data";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import { getStores } from "@/features/store/store.router";
import { Store } from "@/features/store/store.type";
import i18n from "@/i18n";
import { useEffect, useMemo, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import StoreCard from "./(components)/store-card";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

export default function DashboardScreen() {
  const PAGE_SIZE = 20;

  const [tableGoldData, setTableGoldData] = useState<GoldDataRow[]>([]);
  const [selectedDate] = useState(new Date("2023-06-01"));
  const [stores, setStores] = useState<Store[]>([]);

  const totalEstimatedAssets = useMemo(() => {
    return sumBy(tableGoldData, (item) => item.price * item.value) || 999000000;
  }, [tableGoldData]);

  useEffect(() => {
    const loadGoldData = async () => {
      try {
        const result = await fetchGoldDataPage({
          fromDate: selectedDate.toISOString().slice(0, 10),
          page: 0,
          pageSize: PAGE_SIZE,
        });
        setTableGoldData(result.rows);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadGoldData();
  }, [selectedDate]);

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const result = await getStores();
        setStores(result);
      } catch (error) {
        console.error("Failed to load stores:", error);
      }
    };

    loadStoreData();
  }, []);

  const tradingViewUrl =
    "https://www.tradingview-widget.com/embed-widget/single-quote/?locale=vi_VN#%7B%22symbol%22%3A%22PEPPERSTONE%3AXAUUSD%22%2C%22width%22%3A300%2C%22height%22%3A126%2C%22isTransparent%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22utm_source%22%3A%22sjc.com.vn%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22single-quote%22%2C%22page-uri%22%3A%22sjc.com.vn%2Fbieu-do-gia-vang%22%7D";
  const NativeWebView =
    Platform.OS === "ios" || Platform.OS === "android"
      ? require("react-native-webview").WebView
      : null;

  const openTradingView = async () => {
    try {
      await Linking.openURL(tradingViewUrl);
    } catch (error) {
      console.error("Failed to open gold price chart:", error);
    }
  };

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="px-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex-row gap-3 px-4 pb-4">
            <View className="w-2/3 flex-row flex-wrap ounded-xl items-center">
              <View className="flex-row items-center gap-1">
                <Image
                  source={require("@/assets/images/logo.svg")}
                  style={{ width: 50, height: 50 }}
                  className="float-left mr-2"
                />
                <Text className="float-left text-main-primary font-bold font-mono text-xl uppercase">
                  {i18n.t("dashboard.appName")}
                </Text>
              </View>
            </View>
            <View className="w-1/3 rounded-xl items-center justify-center">
              <View className="flex-row items-center gap-1 border border-amber-400 bg-amber-50 px-2 py-1 rounded-lg">
                <MaterialCommunityIcons
                name="hand-heart"
                size={18}
                color="#d4af37"
              />
              </View>
            </View>
          </View>

          <View className="mb-5 gap-3 px-4">
            <View className="rounded-xl border border-slate-200 p-4">
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {i18n.t("assets.estimatedTotalAssets")}
              </Text>
              <Text className="text-2xl font-bold text-main-primary">
                {formatVND(totalEstimatedAssets)}
              </Text>
            </View>
          </View>

          <Text className="mb-3 px-4 text-xl font-bold text-main-primary items-center font-mono">
            <MaterialCommunityIcons name="store" size={24} color="#d4af37" /> {i18n.t("dashboard.yourSubscriptionStorage")}
          </Text>

          <View className="mx-4 mb-5 rounded-xl border border-slate-200 p-4">
            <View className="px-1 pb-5">
              {stores.map((item) => (
                <StoreCard key={item.id.toString()} store={item} />
              ))}
            </View>
          </View>

          <Text className="mb-4 px-4 pt-2 text-xl font-bold text-main-primary font-mono ">
            <MaterialCommunityIcons name="gold" size={24} color="#d4af37" /> {i18n.t("dashboard.worldGoldPrice")}
          </Text>

          <View className="mb-6 h-[400px] gap-4 px-4">
            {NativeWebView ? (
              <View
                pointerEvents="none"
                className="h-[100px] overflow-hidden rounded-xl border border-slate-200"
              >
                <NativeWebView
                  source={{ uri: tradingViewUrl }}
                  javaScriptEnabled
                  domStorageEnabled
                  scrollEnabled={false}
                  style={{ flex: 1 }}
                />
              </View>
            ) : (
              <View className="gap-3 rounded-xl border border-slate-200 p-4">
                <Text className="mb-1 px-1 text-sm text-slate-500">
                  {i18n.t("dashboard.liveChartUnavailable")}
                </Text>
                <Pressable
                  className="self-start rounded-lg bg-main-primary px-4 py-2.5"
                  onPress={openTradingView}
                >
                  <Text className="text-sm font-semibold text-white">
                    {i18n.t("dashboard.openGoldChart")}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
