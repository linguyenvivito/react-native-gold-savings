import DateTimePicker from "@/components/date-picker";
import { ThemedView } from "@/components/themed-view";
import {
  AddTransactionFormValues,
  useAddTransactionModal,
} from "@/context/add-transaction-modal-context";
import { useAssets } from "@/context/asset-context";
import { GoldTempRow } from "@/features/asset/gold.type";
import { getOrders } from "@/features/order/order.router";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import i18n from "@/i18n";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

export default function AssetScreen() {
  const [tableGoldData, setTableGoldData] = useState<GoldTempRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [dataError, setDataError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date("2023-06-01"));
  const [pendingDate, setPendingDate] = useState(new Date("2023-06-01"));
  const [dateInput, setDateInput] = useState("2023-06-01");
  const [showPicker, setShowPicker] = useState(false);
  const [todayPrice, setTodayPrice] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { assets, isLoadingAssets, assetError } = useAssets();
  const { openAddTransactionModal, setDefaultAddTransactionSubmitHandler } = useAddTransactionModal();

  const handleAddTransaction = (values: AddTransactionFormValues) => {
    const newRow: GoldTempRow = {
      id: Date.now().toString(),
      product_type: values.product_type,
      value: values.value,
      purity: values.purity,
      price: values.price,
      weight_unit: values.weight_unit,
      side: values.type ? "buy" : "sell",
      releaseDate: values.releaseDate || new Date().toISOString().slice(0, 10),
      location: values.location || "Manual",
      description: values.description || `Invoice: ${values.invoice || "N/A"}`,
      quantity: values.value,
    };

    setTableGoldData((prev) => [newRow, ...prev]);
  };

  useEffect(() => {
    setDefaultAddTransactionSubmitHandler(handleAddTransaction);

    return () => {
      setDefaultAddTransactionSubmitHandler(undefined);
    };
  }, [handleAddTransaction, setDefaultAddTransactionSubmitHandler]);

  const filteredMoney = useMemo(() => {
    return sumBy(
      tableGoldData,
      (item) => (item.side === "buy" ? 1 : 0) * item.price * item.quantity,
    );
  }, [tableGoldData]);

  const estimatedMoney = useMemo(() => {
    return sumBy(
      tableGoldData,
      (item) =>
        (item.side === "buy" ? 1 : 0) * (todayPrice ?? 0) * item.quantity,
    );
  }, [tableGoldData, todayPrice]);

  const money = useMemo(() => {
    return sumBy(
      tableGoldData,
      (item) => (item.side === "buy" ? 1 : 0) * item.price * item.quantity,
    );
  }, [tableGoldData]);

  const totalGold = useMemo(() => {
    return sumBy(
      tableGoldData,
      (item) => (item.side === "buy" ? 1 : 0) * item.quantity,
    );
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

  // const loadGoldData = async (targetPage: number, replace: boolean) => {
  //   if (replace) {
  //     setIsLoadingData(true);
  //   } else {
  //     setIsLoadingMore(true);
  //   }

  //   setDataError(null);

  //   try {
  //     const result = await fetchGoldDataPage({
  //       fromDate: selectedDate.toISOString().slice(0, 10),
  //       page: targetPage,
  //       pageSize: PAGE_SIZE,
  //     });

  //     setHasMore(result.hasMore);
  //     setPage(targetPage);
  //     setTableGoldData((prev) =>
  //       replace ? result.rows : [...prev, ...result.rows],
  //     );
  //   } catch (error) {
  //     if (replace) {
  //       setTableGoldData([]);
  //     }
  //     setDataError(error instanceof Error ? error.message : "Unable to load gold data.");
  //   } finally {
  //     if (replace) {
  //       setIsLoadingData(false);
  //     } else {
  //       setIsLoadingMore(false);
  //     }
  //   }
  // };

  const loadGoldTemp = async (targetPage: number, replace: boolean) => {
    if (replace) {
      setIsLoadingData(true);
    } else {
      setIsLoadingMore(true);
    }

    setDataError(null);

    try {
      const orders = await getOrders();
      const goldTempData: GoldTempRow[] = orders.map((order) => ({
        id: order.id.toString(),
        value: 0,
        product_type:
          assets.find((asset) => asset.id === order.assetId)
            ?.product_type.toLowerCase() ?? "unknown",
        purity:
          Number(assets.find((asset) => asset.id === order.assetId)?.purity) || 0,
        price: order.price,
        weight_unit:
          assets.find((asset) => asset.id === order.assetId)
            ?.weight_unit.toLowerCase() ?? "unknown",
        side: order.side.toLowerCase(),
        releaseDate: order.createdAt,
        location: "Test Location",
        description: "Test Description",
        quantity: order.quantity,
      }));

      setHasMore(false);
      setPage(targetPage);
      setTableGoldData(
        (prev) => (replace ? goldTempData : [...prev, ...goldTempData])
      );
    } catch (error) {
      if (replace) {
        setTableGoldData([]);
      }
      setDataError(
        error instanceof Error ? error.message : "Unable to load orders.",
      );
    } finally {
      if (replace) {
        setIsLoadingData(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (isLoadingAssets) {
      return;
    }

    if (assetError) {
      setDataError(assetError);
      setIsLoadingData(false);
      return;
    }

    // loadGoldData(0, true);
    loadGoldTemp(0, true);
  }, [selectedDate, assets, isLoadingAssets, assetError]);

  const onLoadMore = () => {
    if (isLoadingData || isLoadingMore || !hasMore) {
      return;
    }
    // loadGoldData(page + 1, false);
  };

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="py-5 px-4 w-full flex-row">
          <View className="w-2/3 rounded-xl">
            <Text className="px-2 text-main-primary font-bold font-mono text-xl uppercase">
              {i18n.t("assets.assetManagement")}
            </Text>
          </View>
          <View className="w-1/3 rounded-xl items-end">
            <View className="flex-row items-center gap-1 border border-amber-400 bg-amber-50 px-2 py-1 rounded-lg">
              <Pressable
                className="px-1"
                onPress={() =>
                  openAddTransactionModal({
                    onSubmit: handleAddTransaction,
                  })
                }
              >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={18}
                color="#d4af37"
              />
              </Pressable>
    
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-5 gap-3">
            <View className="rounded-xl border border-slate-200 p-4">
              <Text className="mb-1 text-xs font-semibold text-slate-500">
                {i18n.t("assets.estimatedTotalAssets")}
              </Text>
              <Text className="text-2xl font-bold text-main-primary">
                {formatVND(estimatedMoney)}
              </Text>
              <Pressable
                className="mt-3 self-start rounded-lg bg-slate-900 px-3.5 py-2.5"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-xs font-bold text-white">
                  {i18n.t("assets.setTodayPrice")}
                </Text>
              </Pressable>

              {/* Modal Component */}
              <Modal
                animationType="slide" // Options: 'none', 'slide', 'fade'
                transparent={true} // Allows background overlay to show through
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // Handles hardware back button (Android)
              >
                <View className="flex-1 items-center justify-center bg-slate-900/45">
                  <View className="w-[86%] max-w-[360px] rounded-2xl p-5">
                    <Text className="mb-1 text-xl font-extrabold text-slate-900">
                      {i18n.t("assets.todaysGoldPrice")}
                    </Text>
                    <Text className="mb-3.5 text-xs text-slate-500">
                      {i18n.t("assets.enterPricePerMace")}
                    </Text>
                    <TextInput
                      placeholder={i18n.t("assets.enterTodaysPrice")}
                      className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-base font-bold text-slate-900"
                      placeholderTextColor="#9ca3af"
                      value={todayPrice !== null ? todayPrice.toString() : ""}
                      onChangeText={(text) =>
                        setTodayPrice(text !== "" ? parseFloat(text) : null)
                      }
                      keyboardType="decimal-pad"
                    />

                    <View className="flex-row justify-end gap-2.5">
                      <Pressable
                        className="rounded-lg border border-slate-300 bg-slate-100 px-3.5 py-2.5"
                        onPress={() => setModalVisible(false)}
                      >
                        <Text className="text-xs font-bold text-slate-700">
                          Cancel
                        </Text>
                      </Pressable>
                      <Pressable
                        className="rounded-lg bg-amber-600 px-3.5 py-2.5"
                        onPress={() => setModalVisible(false)}
                      >
                        <Text className="text-xs font-bold text-white">
                          Apply
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            <View className="rounded-xl border border-slate-200 p-4">
              <Text className="mb-1 text-xs font-semibold text-slate-500">
                {i18n.t("assets.totalInvestment")}
              </Text>
              <Text className="text-2xl font-bold text-main-primary">
                {formatVND(money)}
              </Text>
            </View>

            <View className="rounded-xl border border-slate-200 p-4">
              <Text className="mb-1 text-xs font-semibold text-slate-500">
                {i18n.t("dashboard.totalGold")}
              </Text>
              <Text className="text-2xl font-bold text-main-primary">
                {totalGold} {i18n.t("assets.mace")}
              </Text>
            </View>
          </View>

          <View className="mb-5 rounded-xl border border-slate-200 p-4">
            <Text className="mb-3 text-sm font-semibold text-slate-500">
              {i18n.t("dashboard.filterByDate")}
            </Text>
            <View className="mb-3 flex-row items-center gap-2.5">
              <View className="flex-1 rounded-lg border border-slate-300 bg-slate-100 p-2.5">
                <Text className="mb-1 text-xs text-slate-500">
                  {i18n.t("dashboard.from")}:
                </Text>
                <TextInput
                  className="p-0 text-sm font-semibold"
                  value={dateInput}
                  onChangeText={onDateInputChange}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                />
              </View>
              {!showPicker && (
                <Pressable
                  className="rounded-lg bg-slate-900 px-3.5 py-2.5"
                  onPress={onPickDate}
                >
                  <Text className="text-xs font-semibold text-white">
                    {i18n.t("dashboard.pickDate")}
                  </Text>
                </Pressable>
              )}
            </View>
            
            {showPicker && (
              <View
                className={`mb-3 text-xl bg-slate-500 font-mono py-2.5 rounded-lg`}
              >
                <View className="overflow-hidden">
                  <DateTimePicker
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    value={pendingDate}
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                  {Platform.OS !== "android" && (
                    <View className="mt-2 flex-row justify-end gap-2">
                      <Pressable
                        className="rounded-lg border border-slate-200 px-4 py-2"
                        onPress={onCancel}
                      >
                        <Text className="text-xs font-semibold text-white">
                          {i18n.t("common.cancel")}
                        </Text>
                      </Pressable>
                      <Pressable
                        className="rounded-lg bg-slate-900 px-4 py-2"
                        onPress={onApply}
                      >
                        <Text className="text-xs font-semibold text-white">
                          {i18n.t("common.apply")}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View className="flex-row items-center justify-between rounded-md border-l-4 border-amber-600 bg-slate-100 p-3">
              <Text className="text-xs font-semibold">
                {i18n.t("dashboard.filteredMoney")}
              </Text>
              <Text className="text-base font-bold text-emerald-700">
                {formatVND(filteredMoney)}
              </Text>
            </View>
          </View>

          <Text className="mb-3 text-xl font-bold text-main-primary font-mono">
            {i18n.t("dashboard.goldRecords")}
          </Text>

          {isLoadingData && (
            <Text className="mb-2 px-4 text-xs text-slate-500">
              Loading gold data...
            </Text>
          )}
          {dataError && (
            <Text className="mb-2 px-4 text-xs font-semibold text-red-600">
              Failed to load: {dataError}
            </Text>
          )}

          <View className="mb-5 overflow-hidden rounded-lg border border-slate-200">
            <View className="w-full flex-row border-b border-slate-200 bg-slate-100 py-2.5">
              <Text className="w-2/5 px-2 font-mono text-sm font-bold text-slate-700">
                {i18n.t("assets.product")}
              </Text>
              <Text className="w-2/5 px-2 font-mono text-sm font-bold text-slate-700">
                {i18n.t("assets.price")}
                {"\n"}
                {i18n.t("assets.value")}
                {"/"}
                {i18n.t("assets.unit")}
              </Text>
              <Text className="w-1/5 px-2 font-mono text-sm font-bold text-slate-700">
                
              </Text>
            </View>

            <View className="pb-2 bg-white">
              {tableGoldData.map((item) => (
                <Pressable key={item.id.toString()}>
                  <View className="w-full flex-row border-b border-slate-200 py-2.5">
                    <Text
                      className={`w-2/5 px-2 font-mono text-sm ${item.side === "buy" ? "text-emerald-700" : "text-rose-600"}`}
                    >
                      {i18n.t("assets." + item.product_type)} -{" "}
                      {item.purity}
                    </Text>
                    <Text
                      className={`w-2/5 px-2 font-mono text-sm ${item.side === "buy" ? "text-emerald-700" : "text-rose-600"}`}
                    >
                      <Text className="font-bold">{formatVND(item.price)}</Text>
                      {"\n"}
                      <Text className="italic text-xs">
                        {item.quantity}
                        {"/"}
                        {i18n.t("assets." + item.weight_unit)}
                      </Text>
                    </Text>
                    <Text
                      className={`w-1/5 px-2 font-bold font-mono text-sm ${item.side === "buy" ? "text-emerald-700" : "text-rose-600"}`}
                    >
                      {i18n.t("assets." + item.side)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            {hasMore && (
              <Pressable
                className="mx-3 mb-2 mt-2 items-center rounded-lg bg-amber-600 py-2.5"
                onPress={onLoadMore}
              >
                <Text className="text-xs font-bold text-white">
                  {isLoadingMore ? "Loading more..." : "Load more"}
                </Text>
              </Pressable>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
