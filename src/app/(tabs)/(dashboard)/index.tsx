import { ThemedView } from "@/components/themed-view";
import {
} from "@/features/dashboard/gold-data";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import { getStores } from "@/features/store/store.router";
import { Store } from "@/features/store/store.type";
import i18n from "@/i18n";
import { useEffect, useMemo, useState } from "react";
import {
  Linking,
  Modal,
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
import Svg, { G, Circle, Text as TextSVG } from "react-native-svg";

export default function DashboardScreen() {
  const PAGE_SIZE = 20;
  const donationQrUri =
    "https://cdn.hdbank.com.vn/hdbank-file/news/editor/95LaBftBbhDnjGKgbDJT20231228154717/taomaqrtaikhoannganhangagribank_1703753546547.png";

  const [tableGoldData, setTableGoldData] = useState<any[]>([]);
  const [selectedDate] = useState(new Date("2023-06-01"));
  const [stores, setStores] = useState<Store[]>([]);
  const [isDonationModalVisible, setIsDonationModalVisible] = useState(false);

  const totalEstimatedAssets = useMemo(() => {
    return sumBy(tableGoldData, (item) => item.price * item.value) || 999000000;
  }, [tableGoldData]);

  useEffect(() => {

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

  const data = [
      { count: 12, active: false, color: "#2c240967", label: i18n.t("dashboard.targetGoldBought") },
      { count: 8, active: true, color: "#d4af37", label: i18n.t("dashboard.gold") },
    ],
    size = 200,
    strokeWidth = 20;

  // 1. Calculate dimensions dynamically
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // 2. Aggregate total item count
  const totalItems = data.reduce((sum, item) => sum + item.count, 0);

  // 3. Keep track of running accumulated percentages to rotate segments correctly
  let accumulatedPercentage = 0;

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="w-full flex-row">
          <View className="w-2/3 rounded-xl items-start ps-2">
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
          <View className="w-1/3 rounded-xl justify-center items-end pe-2">
            <Pressable
              className="flex-row gap-1 rounded-lg border border-amber-400 bg-amber-50 px-2 py-1"
              onPress={() => setIsDonationModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="hand-heart"
                size={18}
                color="#d4af37"
              />
            </Pressable>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent
          visible={isDonationModalVisible}
          onRequestClose={() => setIsDonationModalVisible(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/45 px-4">
            <View className="w-full max-w-[360px] rounded-2xl bg-white p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <View>
                  <Text className="text-lg font-bold text-main-primary">
                    {i18n.t("tabs.donate")}
                  </Text>
                  <Text className="text-xs text-slate-500">
                    {i18n.t("dashboard.rightColumnMessage")}
                  </Text>
                </View>
                <Pressable
                  className="rounded-lg bg-slate-100 px-3 py-1.5"
                  onPress={() => setIsDonationModalVisible(false)}
                >
                  <Text className="text-xs font-semibold text-slate-700">
                    {i18n.t("common.cancel")}
                  </Text>
                </Pressable>
              </View>

              <Image
                source={{ uri: donationQrUri }}
                style={{ width: "100%", height: 420 }}
                contentFit="contain"
              />
            </View>
          </View>
        </Modal>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4"
          showsVerticalScrollIndicator={true}
        >
          <View className="w-full flex-row gap-3 pb-4"></View>

          <View className="mb-5 gap-3">
            <View className="rounded-xl border border-slate-200 p-4">
              <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {i18n.t("assets.estimatedTotalAssets")}
              </Text>
              <Text className="text-2xl font-bold text-main-primary">
                {formatVND(totalEstimatedAssets)}
              </Text>
            </View>
          </View>

          <Text className="mb-3 text-xl font-bold text-main-primary items-center font-mono">
            {i18n.t("dashboard.targetGoldBought")}
          </Text>

          <View className="rounded-xl border border-slate-200 p-4 mb-5">
            <View
              style={{ width: size, height: size }}
              className="self-center mb-5"
            >
              <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <G rotation="-90" origin={`${center}, ${center}`}>
                  {/* Base Gray Background Track */}
                  <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="#E5E5EA"
                    strokeWidth={strokeWidth}
                  />

                  {/* Dynamic Category Segments */}
                  {totalItems > 0 &&
                    data.map((item, index) => {
                      const percentage = item.count / totalItems;
                      const strokeDashoffset =
                        circumference - circumference * percentage;
                      const rotationAngle = accumulatedPercentage * 360;

                      // Update the offset accumulator for the next loop segment
                      accumulatedPercentage += percentage;

                      return (
                        <Circle
                          key={index}
                          cx={center}
                          cy={center}
                          r={radius}
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          // Rotates each chunk sequentially so segments stack continuously
                          transform={`rotate(${rotationAngle} ${center} ${center})`}
                          strokeLinecap="round"
                        />
                      );
                    })}
                </G>

                {/* Center Typography (Total Items Analytics Indicator) */}
                <TextSVG
                  x={center}
                  y={center - 5}
                  textAnchor="middle"
                  fontSize={size * 0.16}
                  fontWeight="bold"
                  fill="green"
                >
                  {data.find((item) => item.active)?.count ?? 0}
                </TextSVG>
                <TextSVG
                  x={center}
                  y={center + 18}
                  textAnchor="middle"
                  fontSize={size * 0.07}
                  fontWeight="600"
                  fill="#8E8E93"
                  letterSpacing={0.5}
                >
                  {i18n.t("dashboard.targetGoldAt")}
                </TextSVG>
                <TextSVG
                  x={center}
                  y={center + 40}
                  textAnchor="middle"
                  fontSize={size * 0.09}
                  fontWeight="600"
                  fill="red"
                  letterSpacing={0.5}
                >
                  {totalItems}
                </TextSVG>
              </Svg>
            </View>
          </View>

          <Text className="mb-3 text-xl font-bold text-main-primary items-center font-mono">
            {i18n.t("dashboard.yourSubscriptionStorage")}
          </Text>

          <View className="mb-5 rounded-xl border border-slate-200 bg-white">
            <View className="py-5">
              {stores.map((item) => (
                <StoreCard key={item.id.toString()} store={item} />
              ))}
            </View>
          </View>

          <Text className="mb-4 pt-2 text-xl font-bold text-main-primary font-mono ">
            {i18n.t("dashboard.worldGoldPrice")}
          </Text>

          <View className="mb-6 h-[400px] gap-4">
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
