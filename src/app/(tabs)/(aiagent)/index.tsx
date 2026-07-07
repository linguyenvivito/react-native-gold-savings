import { ThemedView } from "@/components/themed-view";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import i18n from "@/i18n";
import { Picker } from "@react-native-picker/picker";
import { useMemo, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function AIAgentScreen() {
  const [goldData, setGoldData] = useState<GoldDataItem[]>(initialGoldData);
  const [form, setForm] = useState<GoldFormState>(initialFormState);

  const totalMoney = useMemo(() => {
    return sumBy(goldData, (item) => item.price * item.value);
  }, [goldData]);

  const updateForm = (key: keyof GoldFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="px-4"
          showsVerticalScrollIndicator={false}
        >
        <Text className="mb-2 text-2xl font-bold text-main-primary">{i18n.t("assets.title")}</Text>
        <Text className="mb-4 text-base font-semibold text-slate-700">Total Money: {formatVND(totalMoney)}</Text>

        <View className="rounded-xl border border-slate-200 bg-white p-3">
          <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">{i18n.t("assets.price")}</Text>
          <TextInput
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
            keyboardType="numeric"
            value={form.price}
            onChangeText={(text) => updateForm("price", text)}
            placeholder="13000"
          />

          <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">{i18n.t("assets.value")}</Text>
          <TextInput
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
            keyboardType="numeric"
            value={form.value}
            onChangeText={(text) => updateForm("value", text)}
            placeholder="1"
          />

          <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">{i18n.t("assets.unit")}</Text>
          <View className="overflow-hidden rounded-lg border border-slate-300 bg-white">
            <Picker
              selectedValue={form.unit}
              onValueChange={(itemValue) => updateForm("unit", itemValue)}
              style={{ height: 50 }}
            >
              {UNIT_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>

          <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">{i18n.t("assets.releaseDate")}</Text>
          <TextInput
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
            value={form.releaseDate}
            onChangeText={(text) => updateForm("releaseDate", text)}
            placeholder="2026-07-02"
          />

          <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">{i18n.t("assets.location")}</Text>
          <TextInput
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
            value={form.location}
            onChangeText={(text) => updateForm("location", text)}
            placeholder={i18n.t("assets.location")}
          />

          <Text className="mb-1.5 mt-2 text-xs font-semibold text-slate-700">{i18n.t("assets.description")}</Text>
          <TextInput
            className="min-h-[72px] rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm"
            style={{ textAlignVertical: "top" }}
            value={form.description}
            onChangeText={(text) => updateForm("description", text)}
            placeholder={i18n.t("assets.description")}
            multiline
          />

          <Pressable className="mt-3.5 items-center rounded-lg bg-amber-600 py-2.5" onPress={handleSubmit}>
            <Text className="text-sm font-bold text-white">{i18n.t("assets.submit")}</Text>
          </Pressable>
        </View>

        <Text className="mb-2.5 mt-4 text-base font-bold text-slate-800">
          {i18n.t("assets.savedGoldData")}
        </Text>
        <View>
          {goldData.map((item, index) => (
            <View key={item.id}>
              <View className="rounded-lg border border-slate-200 bg-white p-2.5">
                <Text className="mb-1 text-sm font-bold text-slate-800">{formatVND(item.price)}</Text>
                <Text className="text-xs text-slate-700">
                  {i18n.t("assets.value")}: {item.value}
                </Text>
                <Text className="text-xs text-slate-700">
                  {i18n.t("assets.unit")}: {item.unit}
                </Text>
                <Text className="text-xs text-slate-700">
                  {i18n.t("assets.releaseDate")}: {item.releaseDate}
                </Text>
                <Text className="text-xs text-slate-700">
                  {i18n.t("assets.location")}: {item.location}
                </Text>
              </View>
              {index < goldData.length - 1 && <View className="h-2" />}
            </View>
          ))}
        </View>
      </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
