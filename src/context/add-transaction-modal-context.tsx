import { Picker } from "@react-native-picker/picker";
import { createContext, useContext, useMemo, useRef, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import i18n from "@/i18n";

export type AddTransactionFormValues = {
  type: boolean;
  store: string;
  goldType: string;
  price: number;
  asyncPrice: number;
  value: number;
  unit: string;
  releaseDate: string;
  location: string;
  invoice: string;
  description: string;
};

type SelectOption = {
  label: string;
  value: string;
};

type OpenAddTransactionModalOptions = {
  initialValues?: Partial<AddTransactionFormValues>;
  onSubmit?: (values: AddTransactionFormValues) => void | Promise<void>;
};

type AddTransactionModalContextValue = {
  openAddTransactionModal: (options?: OpenAddTransactionModalOptions) => void;
  closeAddTransactionModal: () => void;
  setDefaultAddTransactionSubmitHandler: (
    handler?: (values: AddTransactionFormValues) => void | Promise<void>,
  ) => void;
};

const AddTransactionModalContext = createContext<AddTransactionModalContextValue | undefined>(
  undefined,
);

const initialFormState: AddTransactionFormValues = {
  type: true,
  store: "kim_mon",
  goldType: "RING_9999",
  price: 0,
  asyncPrice: 0,
  value: 0,
  unit: "mace",
  releaseDate: "",
  location: "",
  invoice: "",
  description: "",
};

const UNIT_OPTIONS: SelectOption[] = [
  { label: i18n.t("assets.fen"), value: "fen" },
  { label: i18n.t("assets.mace"), value: "mace" },
  { label: i18n.t("assets.tael"), value: "tael" },
];

const STORE_OPTIONS: SelectOption[] = [
  { label: "Kim Mon", value: "kim_mon" },
  { label: "Another Store", value: "another_store" },
];

const GOLD_TYPE_OPTIONS: SelectOption[] = [
  { label: "RING_9999", value: "RING_9999" },
  { label: "BAR_9999", value: "BAR_9999" },
];

export function AddTransactionModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<AddTransactionFormValues>(initialFormState);
  const submitRef = useRef<OpenAddTransactionModalOptions["onSubmit"]>(undefined);
  const defaultSubmitRef = useRef<OpenAddTransactionModalOptions["onSubmit"]>(undefined);

  const updateForm = (key: keyof AddTransactionFormValues, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseNumberField = (value: string): number => {
    const sanitized = value.replace(/,/g, "").trim();
    if (!sanitized) {
      return 0;
    }

    const parsed = Number(sanitized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getOptionLabel = (options: SelectOption[], selectedValue: string): string => {
    return options.find((option) => option.value === selectedValue)?.label ?? selectedValue;
  };

  const closeAddTransactionModal = () => {
    submitRef.current = undefined;
    setVisible(false);
    setForm(initialFormState);
  };

  const openAddTransactionModal = (options?: OpenAddTransactionModalOptions) => {
    submitRef.current = options?.onSubmit ?? defaultSubmitRef.current;
    setForm({
      ...initialFormState,
      ...options?.initialValues,
    });
    setVisible(true);
  };

  const setDefaultAddTransactionSubmitHandler = (
    handler?: (values: AddTransactionFormValues) => void | Promise<void>,
  ) => {
    defaultSubmitRef.current = handler;
  };

  const openIosSelector = (
    key: "store" | "goldType" | "unit",
    options: SelectOption[],
    pickerTitle: string,
  ) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: pickerTitle,
        options: [...options.map((option) => option.label), i18n.t("common.cancel")],
        cancelButtonIndex: options.length,
      },
      (buttonIndex) => {
        if (buttonIndex >= 0 && buttonIndex < options.length) {
          updateForm(key, options[buttonIndex].value);
        }
      },
    );
  };

  const handleSubmit = async () => {
    const price = Number(form.price);
    const asyncPrice = Number(form.asyncPrice);
    const value = Number(form.value);

    if (!price || price <= 0) {
      Alert.alert("Invalid input", "Price must be greater than 0.");
      return;
    }

    if (!value || value <= 0) {
      Alert.alert("Invalid input", "Value must be greater than 0.");
      return;
    }

    if (!asyncPrice || asyncPrice <= 0) {
      Alert.alert("Invalid input", "Async price must be greater than 0.");
      return;
    }

    if (!form.releaseDate.trim()) {
      Alert.alert("Invalid input", "Release date is required (YYYY-MM-DD).");
      return;
    }

    await submitRef.current?.(form);
    closeAddTransactionModal();
  };

  const value = useMemo(
    () => ({
      openAddTransactionModal,
      closeAddTransactionModal,
      setDefaultAddTransactionSubmitHandler,
    }),
    [],
  );

  return (
    <AddTransactionModalContext.Provider value={value}>
      {children}

      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={closeAddTransactionModal}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="max-h-[90%] rounded-t-2xl bg-white px-4 pb-6 pt-3">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-base font-bold text-slate-800">{i18n.t("assets.addTransaction")}</Text>
              <Pressable
                className="rounded-lg bg-slate-200 px-3 py-1.5"
                onPress={closeAddTransactionModal}
              >
                <Text className="text-xs font-semibold text-slate-700">{i18n.t("common.close")}</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="rounded-xl border border-slate-200 bg-white p-3">
                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {form.type ? i18n.t("assets.buy") : i18n.t("assets.sell")}
                </Text>
                <Switch
                  trackColor={{ false: "#00ff00", true: "#ff0000" }}
                  thumbColor="#fff"
                  ios_backgroundColor="#00ff00"
                  value={form.type}
                  onValueChange={(nextValue) => updateForm("type", nextValue)}
                  className="scale-90"
                />

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.store")}
                </Text>
                {Platform.OS === "ios" ? (
                  <Pressable
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                    onPress={() => openIosSelector("store", STORE_OPTIONS, i18n.t("assets.store"))}
                  >
                    <Text className="text-sm text-slate-800">
                      {getOptionLabel(STORE_OPTIONS, form.store)}
                    </Text>
                  </Pressable>
                ) : (
                  <View className="overflow-hidden rounded-lg border border-slate-300 bg-white">
                    <Picker
                      selectedValue={form.store}
                      onValueChange={(itemValue) => updateForm("store", String(itemValue))}
                    >
                      {STORE_OPTIONS.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                      ))}
                    </Picker>
                  </View>
                )}

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.type")}
                </Text>
                {Platform.OS === "ios" ? (
                  <Pressable
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                    onPress={() => openIosSelector("goldType", GOLD_TYPE_OPTIONS, i18n.t("assets.type"))}
                  >
                    <Text className="text-sm text-slate-800">
                      {getOptionLabel(GOLD_TYPE_OPTIONS, form.goldType)}
                    </Text>
                  </Pressable>
                ) : (
                  <View className="overflow-hidden rounded-lg border border-slate-300 bg-white">
                    <Picker
                      selectedValue={form.goldType}
                      onValueChange={(itemValue) => updateForm("goldType", String(itemValue))}
                    >
                      {GOLD_TYPE_OPTIONS.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                      ))}
                    </Picker>
                  </View>
                )}

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.price")}
                </Text>
                <TextInput
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
                  keyboardType="numeric"
                  value={form.price ? form.price.toString() : ""}
                  onChangeText={(text) => updateForm("price", parseNumberField(text))}
                  placeholder="13000"
                />

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.value")}
                </Text>
                <TextInput
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
                  keyboardType="numeric"
                  value={form.value ? form.value.toString() : ""}
                  onChangeText={(text) => updateForm("value", parseNumberField(text))}
                  placeholder="1"
                />

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.unit")}
                </Text>
                {Platform.OS === "ios" ? (
                  <Pressable
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                    onPress={() => openIosSelector("unit", UNIT_OPTIONS, i18n.t("assets.unit"))}
                  >
                    <Text className="text-sm text-slate-800">
                      {getOptionLabel(UNIT_OPTIONS, form.unit)}
                    </Text>
                  </Pressable>
                ) : (
                  <View className="overflow-hidden rounded-lg border border-slate-300 bg-white">
                    <Picker
                      selectedValue={form.unit}
                      onValueChange={(itemValue) => updateForm("unit", String(itemValue))}
                      style={{ height: 50 }}
                    >
                      {UNIT_OPTIONS.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                      ))}
                    </Picker>
                  </View>
                )}

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.asyncPrice")}
                </Text>
                <TextInput
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
                  keyboardType="numeric"
                  value={form.asyncPrice ? form.asyncPrice.toString() : ""}
                  onChangeText={(text) => updateForm("asyncPrice", parseNumberField(text))}
                  placeholder="13000"
                />

                <View className="mb-1.5 mt-2">
                  <Text className="text-xs font-semibold text-slate-700">
                    {i18n.t("assets.asyncValue")}
                  </Text>
                  <Text className="text-xs font-semibold text-slate-700">
                    @{formatCurrency(form.asyncPrice * form.value)}
                  </Text>
                </View>

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.releaseDate")}
                </Text>
                <TextInput
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
                  value={form.releaseDate}
                  onChangeText={(text) => updateForm("releaseDate", text)}
                  placeholder="2026-07-02"
                />

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.location")}
                </Text>
                <TextInput
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
                  value={form.location}
                  onChangeText={(text) => updateForm("location", text)}
                  placeholder={i18n.t("assets.location")}
                />

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.invoice")}
                </Text>
                <TextInput
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
                  value={form.invoice}
                  onChangeText={(text) => updateForm("invoice", text)}
                  placeholder="INV-2026-001"
                />

                <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">
                  {i18n.t("assets.description")}
                </Text>
                <TextInput
                  className="min-h-[72px] rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
                  style={{ textAlignVertical: "top" }}
                  value={form.description}
                  onChangeText={(text) => updateForm("description", text)}
                  placeholder={i18n.t("assets.description")}
                  multiline
                />

                <Pressable
                  className="mt-3.5 items-center rounded-lg bg-amber-600 py-2.5"
                  onPress={() => {
                    handleSubmit().catch((error) => {
                      const message =
                        error instanceof Error ? error.message : "Unable to submit transaction.";
                      Alert.alert("Submission failed", message);
                    });
                  }}
                >
                  <Text className="text-sm font-bold text-white">
                    {i18n.t("assets.submit")}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </AddTransactionModalContext.Provider>
  );
}

export function useAddTransactionModal() {
  const context = useContext(AddTransactionModalContext);
  if (!context) {
    throw new Error("useAddTransactionModal must be used within AddTransactionModalProvider");
  }
  return context;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}