import { ThemedView } from "@/components/themed-view";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import i18n from "@/i18n";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BranchCard from "./(components)/branch-card";
import { Store } from "@/features/transaction/store.type";
import { getStores } from "@/features/transaction/store.router";

type GoldDataItem = {
  id: string;
  price: number;
  value: number;
  unit: string;
  currency: "VND";
  releaseDate: string;
  location: string;
  description: string;
};

type GoldFormState = {
  price: string;
  value: string;
  unit: string;
  releaseDate: string;
  location: string;
  description: string;
};

const initialGoldData: GoldDataItem[] = [
  {
    id: "1",
    price: 13000,
    value: 1,
    unit: "mace",
    currency: "VND",
    releaseDate: "2023-01-01",
    location: "Location 1",
    description: "Sample record",
  },
];

const initialFormState: GoldFormState = {
  price: "",
  value: "",
  unit: "mace",
  releaseDate: "",
  location: "",
  description: "",
};

const UNIT_OPTIONS = [
  { label: i18n.t("assets.fen"), value: "fen" },
  { label: i18n.t("assets.mace"), value: "mace" },
  { label: i18n.t("assets.tael"), value: "tael" },
];

type MarketTab = "domestic" | "world";

const normalizeSearchText = (value: string): string => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
};

export default function MarketScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const [goldData, setGoldData] = useState<GoldDataItem[]>(initialGoldData);
  const [form, setForm] = useState<GoldFormState>(initialFormState);
  const [searchQuery, setSearchQuery] = useState("");
  const [marketTab, setMarketTab] = useState<MarketTab>("domestic");

  const tradingViewUrl =
    "https://www.tradingview-widget.com/embed-widget/single-quote/?locale=vi_VN#%7B%22symbol%22%3A%22PEPPERSTONE%3AXAUUSD%22%2C%22width%22%3A300%2C%22height%22%3A126%2C%22isTransparent%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22utm_source%22%3A%22sjc.com.vn%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22single-quote%22%2C%22page-uri%22%3A%22sjc.com.vn%2Fbieu-do-gia-vang%22%7D";

  const tradingViewOverviewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: #0F0F0F;
            overflow: hidden;
          }

          .tradingview-widget-container,
          .tradingview-widget-container__widget {
            width: 100%;
            height: 100%;
          }

          .tradingview-widget-copyright {
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <div class="tradingview-widget-copyright">
            <a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank">
              <span class="blue-text">World markets</span>
            </a>
            by TradingView
          </div>
        </div>
        <script
          type="text/javascript"
          src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
          async
        >
          {
            "lineWidth": 2,
            "lineType": 0,
            "chartType": "area",
            "fontColor": "rgb(106, 109, 120)",
            "gridLineColor": "rgba(242, 242, 242, 0.06)",
            "volumeUpColor": "rgba(34, 171, 148, 0.5)",
            "volumeDownColor": "rgba(247, 82, 95, 0.5)",
            "backgroundColor": "#0F0F0F",
            "widgetFontColor": "#DBDBDB",
            "upColor": "#22ab94",
            "downColor": "#f7525f",
            "borderUpColor": "#22ab94",
            "borderDownColor": "#f7525f",
            "wickUpColor": "#22ab94",
            "wickDownColor": "#f7525f",
            "colorTheme": "dark",
            "isTransparent": false,
            "locale": "en",
            "chartOnly": false,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "symbols": [["OANDA:XAUUSD|1D"], ["TVC:GOLD|1D"]],
            "dateRanges": ["1d|1", "1m|30", "3m|60", "12m|1D", "60m|1W", "all|1M"],
            "fontSize": "10",
            "headerFontSize": "medium",
            "autosize": true,
            "width": "100%",
            "height": "100%",
            "noTimeScale": false,
            "hideDateRanges": false,
            "hideMarketStatus": false,
            "hideSymbolLogo": false
          }
        </script>
      </body>
    </html>`;
  const NativeWebView =
    Platform.OS === "ios" || Platform.OS === "android"
      ? require("react-native-webview").WebView
      : null;

  const totalMoney = useMemo(() => {
    return sumBy(goldData, (item) => item.price * item.value);
  }, [goldData]);

  const filteredStores = useMemo(() => {
    const normalizedQuery = normalizeSearchText(searchQuery);

    if (!normalizedQuery) {
      return stores;
    }

    return stores.filter((store) => {
      const searchableText = normalizeSearchText(
        `${store.name} ${store.address} ${store.phone}`,
      );

      return searchableText.includes(normalizedQuery);
    });
  }, [searchQuery, stores]);

  const updateForm = (key: keyof GoldFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openTradingView = async () => {
    try {
      await Linking.openURL(tradingViewUrl);
    } catch (error) {
      console.error("Failed to open gold price chart:", error);
    }
  };

  const handleSubmit = () => {
    const price = Number(form.price);
    const value = Number(form.value);

    if (!price || price <= 0) {
      Alert.alert("Invalid input", "Price must be greater than 0.");
      return;
    }

    if (!value || value <= 0) {
      Alert.alert("Invalid input", "Value must be greater than 0.");
      return;
    }

    if (!form.releaseDate.trim()) {
      Alert.alert("Invalid input", "Release date is required (YYYY-MM-DD).");
      return;
    }

    const newItem: GoldDataItem = {
      id: Date.now().toString(),
      price,
      value,
      unit: form.unit.trim() || "mace",
      currency: "VND",
      releaseDate: form.releaseDate.trim(),
      location: form.location.trim() || "Unknown",
      description: form.description.trim(),
    };

    setGoldData((prev) => [newItem, ...prev]);
    setForm(initialFormState);
    Alert.alert("Success", "Gold data submitted.");
  };



  const fetchStores = async () => {
    try {
      const result = await getStores();
      setStores(result);
    } catch (error) {
      console.error("Failed to load stores:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <ThemedView className="flex-1 bg-amber-50">
      <SafeAreaView className="flex-1 bg-amber-50">
        <View className="px-5 pt-5">
          <View className="mt-4 flex-row rounded-2xl bg-white p-1">
            <Pressable
              className={`flex-1 rounded-xl px-4 py-3 ${
                marketTab === "domestic" ? "bg-main-primary" : "bg-transparent"
              }`}
              onPress={() => setMarketTab("domestic")}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  marketTab === "domestic" ? "text-white" : "text-slate-600"
                }`}
              >
                {i18n.t("market.domesticMarket")}
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-xl px-4 py-3 ${
                marketTab === "world" ? "bg-main-primary" : "bg-transparent"
              }`}
              onPress={() => setMarketTab("world")}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  marketTab === "world" ? "text-white" : "text-slate-600"
                }`}
              >
                {i18n.t("market.worldMarket")}
              </Text>
            </Pressable>
          </View>

          <Text className="mt-4 text-gray-500">
            {marketTab === "domestic"
              ? i18n.t("market.findNearestGoldStore")
              : i18n.t("dashboard.worldGoldPrice")}
          </Text>

          {marketTab === "domestic" && (
            <View className="mt-5 flex-row items-center rounded-xl border border-gray-200 bg-white px-4 h-14">
              <TextInput
                placeholder={i18n.t("market.searchBranches")}
                className="ml-3 flex-1 text-base"
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}
        </View>

        {marketTab === "domestic" ? (
          <FlatList
            className="mt-5"
            data={filteredStores}
            renderItem={({ item }) => <BranchCard item={item} />}
            ListEmptyComponent={
              <View className="items-center px-5 py-10">
                <Text className="text-center text-sm text-slate-500">
                  No branches found.
                </Text>
              </View>
            }
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 30,
            }}
          />
        ) : (
          <ScrollView
            className="mt-5 flex-1"
            contentContainerClassName="px-5 pb-8"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <Text className="text-base font-bold text-main-primary">
                {i18n.t("dashboard.worldGoldPrice")}
              </Text>

              {NativeWebView ? (
                <>
                  <View
                    className="h-[450px] rounded-xl border border-slate-200"
                  >
                    <NativeWebView
                      originWhitelist={["*"]}
                      source={{ html: tradingViewOverviewHtml }}
                      domStorageEnabled
                      scrollEnabled={true}
                      style={{ flex: 1 }}
                    />
                  </View>

                  <View
                    pointerEvents="none"
                    className="h-[140px] overflow-hidden rounded-xl border border-slate-200"
                  >
                    <NativeWebView
                      source={{ uri: tradingViewUrl }}
                      javaScriptEnabled
                      domStorageEnabled
                      scrollEnabled={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                </>
              ) : (
                <View className="gap-3 rounded-xl border border-slate-200 p-4">
                  <Text className="text-sm text-slate-500">
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
        )}
      </SafeAreaView>
    </ThemedView>
  );
}
