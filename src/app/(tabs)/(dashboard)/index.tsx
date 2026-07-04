import DateTimePicker from "@/components/date-picker";
import {
  fetchGoldDataPage,
  type GoldDataRow,
} from "@/features/dashboard/gold-data";
import { ThemedView } from "@/components/themed-view";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import i18n from "@/i18n";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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

  const filteredMoney = useMemo(() => {
    return sumBy(tableGoldData, (item) => item.price * item.value);
  }, [tableGoldData]);

  const money = useMemo(() => {
    return sumBy(tableGoldData, (item) => item.price * item.value);
  }, [tableGoldData]);

  const totalGold = useMemo(() => {
    return sumBy(tableGoldData, (item) => item.value);
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
      setDataError(error instanceof Error ? error.message : "Unable to load gold data.");
    } finally {
      if (replace) {
        setIsLoadingData(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    loadGoldData(0, true);
  }, [selectedDate]);

  const onLoadMore = () => {
    if (isLoadingData || isLoadingMore || !hasMore) {
      return;
    }
    loadGoldData(page + 1, false);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.screenTitle}>{i18n.t("dashboard.title")}</Text>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Total Money Card */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>{i18n.t("assets.totalMoney")}</Text>
            <Text style={styles.statValue}>{formatVND(money)}</Text>
          </View>

          {/* Total Gold Card */}
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>
              {i18n.t("dashboard.totalGold")}
            </Text>
            <Text style={styles.statValue}>{totalGold} oz</Text>
          </View>
        </View>

        {/* Filter Section */}
        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>
            {i18n.t("dashboard.filterByDate")}
          </Text>
          <View style={styles.filterContent}>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateLabel}>{i18n.t("dashboard.from")}:</Text>
              <TextInput
                style={styles.dateInput}
                value={dateInput}
                onChangeText={onDateInputChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                keyboardType="numbers-and-punctuation"
                maxLength={10}
              />
            </View>
            {!showPicker && (
              <Pressable style={styles.dateButton} onPress={onPickDate}>
                <Text style={styles.dateButtonText}>
                  {i18n.t("dashboard.pickDate")}
                </Text>
              </Pressable>
            )}
          </View>

          {showPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={pendingDate}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
              {Platform.OS !== "android" && (
                <View style={styles.pickerActions}>
                  <Pressable style={styles.cancelButton} onPress={onCancel}>
                    <Text style={styles.cancelButtonText}>
                      {i18n.t("common.cancel")}
                    </Text>
                  </Pressable>
                  <Pressable style={styles.applyButton} onPress={onApply}>
                    <Text style={styles.applyButtonText}>
                      {i18n.t("common.apply")}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}

          {/* Filtered Money */}
          <View style={styles.filteredResult}>
            <Text style={styles.resultLabel}>
              {i18n.t("dashboard.filteredMoney")}
            </Text>
            <Text style={styles.resultValue}>{formatVND(filteredMoney)}</Text>
          </View>
        </View>

        {/* Table Section */}
        <Text style={styles.tableTitle}>{i18n.t("dashboard.goldRecords")}</Text>

        {isLoadingData && <Text style={styles.infoText}>Loading gold data...</Text>}
        {dataError && <Text style={styles.errorText}>Failed to load: {dataError}</Text>}

        <View style={styles.tableWrapper}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.col1]}>
              {i18n.t("assets.price")}
            </Text>
            <Text style={[styles.headerCell, styles.col2]}>
              {i18n.t("assets.value")}
            </Text>
            <Text style={[styles.headerCell, styles.col3]}>
              {i18n.t("assets.unit")}
            </Text>
            <Text style={[styles.headerCell, styles.col4]}>
              {i18n.t("assets.releaseDate")}
            </Text>
          </View>

          <FlatList
            scrollEnabled={false}
            data={tableGoldData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable>
                <View style={styles.tableRow}>
                  <Text style={[styles.cell, styles.col1]}>
                    {formatVND(item.price)}
                  </Text>
                  <Text style={[styles.cell, styles.col2]}>{item.value}</Text>
                  <Text style={[styles.cell, styles.col3]} numberOfLines={1}>
                    {item.unit}
                  </Text>
                  <Text style={[styles.cell, styles.col4]}>
                    {item.releaseDate}
                  </Text>
                </View>
              </Pressable>
            )}
          />

          {hasMore && (
            <Pressable style={styles.loadMoreButton} onPress={onLoadMore}>
              <Text style={styles.loadMoreText}>
                {isLoadingMore ? "Loading more..." : "Load more"}
              </Text>
            </Pressable>
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
