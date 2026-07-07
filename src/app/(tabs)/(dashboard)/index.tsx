import DateTimePicker from "@/components/date-picker";
import {
  fetchGoldDataPage,
  type GoldDataRow,
} from "@/features/dashboard/gold-data";
import { Store } from "@/features/store/store.type";
import { ThemedView } from "@/components/themed-view";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import i18n from "@/i18n";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useEffect, useMemo, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import StoreCard from "./store-card";
import { getStores } from "@/features/store/store.router";

export default function DashboardScreen() {
  const PAGE_SIZE = 20;

  const [tableGoldData, setTableGoldData] = useState<GoldDataRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [dataError, setDataError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date("2023-06-01"));
  const [pendingDate, setPendingDate] = useState(new Date("2023-06-01"));
  const [dateInput, setDateInput] = useState("2023-06-01");
  const [showPicker, setShowPicker] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  const filteredMoney = useMemo(() => {
    return sumBy(tableGoldData, (item) => item.price * item.value);
  }, [tableGoldData]);

  const money = useMemo(() => {
    return sumBy(tableGoldData, (item) => item.price * item.value);
  }, [tableGoldData]);

  const totalGold = useMemo(() => {
    return sumBy(tableGoldData, (item) => item.value);
  }, [tableGoldData]);

  const latestWorldPrice = useMemo(() => {
    if (!tableGoldData.length) {
      return null;
    }
    return tableGoldData[0];
  }, [tableGoldData]);

  const onPickDate = () => {
    setPendingDate(selectedDate);
    setShowPicker(true);
  };

  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
        setPendingDate(date);
      }
    } else if (date) {
      setPendingDate(date);
    }
  };

  const onApply = () => {
    setSelectedDate(pendingDate);
    setDateInput(pendingDate.toISOString().slice(0, 10));
    setShowPicker(false);
  };

  const onCancel = () => {
    setPendingDate(selectedDate);
    setShowPicker(false);
  };

  const onDateInputChange = (text: string) => {
    setDateInput(text);
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      const parsed = new Date(text);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
        setPendingDate(parsed);
      }
    }
  };

  const loadGoldData = async (targetPage: number, replace: boolean) => {
    if (replace) {
      setIsLoadingData(true);
    } else {
      setIsLoadingMore(true);
    }

    setDataError(null);

    try {
      const result = await fetchGoldDataPage({
        fromDate: selectedDate.toISOString().slice(0, 10),
        page: targetPage,
        pageSize: PAGE_SIZE,
      });

      setHasMore(result.hasMore);
      setPage(targetPage);
      setTableGoldData((prev) =>
        replace ? result.rows : [...prev, ...result.rows],
      );
    } catch (error) {
      if (replace) {
        setTableGoldData([]);
      }
      setDataError(
        error instanceof Error ? error.message : "Unable to load gold data.",
      );
    } finally {
      if (replace) {
        setIsLoadingData(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  const loadStoreData = async () => {
    try {
      const result = await getStores();
      setStores(result);
    } catch (error) {
      console.error("Failed to load stores:", error);
    }
  };

  useEffect(() => {
    loadGoldData(0, true);
  }, [selectedDate]);

  useEffect(() => {
    loadStoreData();
  }, []);

  const onLoadMore = () => {
    if (isLoadingData || isLoadingMore || !hasMore) {
      return;
    }
    loadGoldData(page + 1, false);
  };

  const tradingViewUrl = "https://www.tradingview.com/symbols/GOLD/";
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
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

      <View style={styles.headerCard} className="flex-row w-full gap-4 p-4">
        {/* Column 1 */}
        <View className="flex-1 p-4 rounded-lg">
          <Text>
            {i18n.t("dashboard.welcomeMessage")}
          </Text>
        </View>

        {/* Column 2 */}
        <View className="flex-1 p-4 rounded-lg">
          <Text>
            {i18n.t("dashboard.rightColumnMessage")}
          </Text>
        </View>
      </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Total Money Card */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>
              {i18n.t("assets.estimatedTotalAssets")}
            </Text>
            <Text style={styles.statValue}>{formatVND(money)}</Text>
          </View>
        </View>

        {/* Your subscription storage Section */}
        <Text style={styles.tableTitle}>
          {i18n.t("dashboard.yourSubscriptionStorage")}
        </Text>

        <View style={styles.filterCard}>
          <View style={{ paddingHorizontal: 15, paddingBottom: 30 }}>
            {stores.map((item) => (
              <StoreCard key={item.id.toString()} store={item} />
            ))}
          </View>
        </View>

        {/* Header */}
        <Text style={styles.screenTitle}>
          {i18n.t("dashboard.worldGoldPrice")}
        </Text>

        {/* World Gold Price Card */}
        <View style={styles.goldsContainer}>
          {NativeWebView ? (
            <View pointerEvents="none" style={styles.webViewWrapper}>
              <NativeWebView
                source={{ uri: tradingViewUrl }}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
                style={styles.webView}
              />
            </View>
          ) : (
            <View style={styles.chartFallbackCard}>
              <Text style={styles.infoText}>
                {i18n.t("dashboard.liveChartUnavailable")}
              </Text>
              <Pressable style={styles.dateButton} onPress={openTradingView}>
                <Text style={styles.dateButtonText}>{i18n.t("dashboard.openGoldChart")}</Text>
              </Pressable>
            </View>
          )}
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: 60,
  },
  headerCard: {

  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    color: "#d4af37",
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  goldsContainer: {
    paddingHorizontal: 16,
    marginBottom: 30,
    gap: 20,
    height: 400,
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#d4af37",
  },
  worldPriceValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#b8860b",
    marginBottom: 8,
  },
  worldMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  worldMetaText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  worldLocationText: {
    fontSize: 13,
    color: "#374151",
  },
  webViewWrapper: {
    height: 370,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  webView: {
    flex: 1,
  },
  chartFallbackCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
  },
  filterCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d4af37",
    marginBottom: 12,
  },
  filterContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  dateDisplay: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  dateLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#d4af37",
  },
  dateInput: {
    fontSize: 15,
    fontWeight: "600",
    color: "#d4af37",
    padding: 0,
  },
  dateButton: {
    backgroundColor: "#d4af37",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  dateButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 13,
  },
  applyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#d4af37",
  },
  applyButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 13,
  },
  filteredResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fffbf0",
    borderLeftWidth: 4,
    borderLeftColor: "#d4af37",
    padding: 12,
    borderRadius: 6,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#b8860b",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b8860b",
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 12,
    color: "#d4af37",
  },
  infoText: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: "#6b7280",
    fontSize: 13,
  },
  errorText: {
    paddingHorizontal: 16,
    marginBottom: 8,
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "600",
  },
  loadMoreButton: {
    marginTop: 8,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#d4af37",
    paddingVertical: 10,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  tableWrapper: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  headerCell: {
    fontWeight: "700",
    fontSize: 12,
    paddingHorizontal: 8,
    color: "#374151",
  },
  cell: {
    fontSize: 13,
    paddingHorizontal: 8,
    color: "#d4af37",
  },
  col1: {
    flex: 1,
  },
  col2: {
    flex: 1,
  },
  col3: {
    flex: 1,
  },
  col4: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 8,
  },
});
