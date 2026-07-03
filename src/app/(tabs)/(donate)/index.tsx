import { ThemedView } from "@/components/themed-view";
import { formatVND, sumBy } from "@/features/shared/moneyFomulars";
import i18n from "@/i18n";
import { Picker } from "@react-native-picker/picker";
import { useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

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

export default function DonateScreen() {
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
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{i18n.t("assets.title")}</Text>
        <Text style={styles.total}>Total Money: {formatVND(totalMoney)}</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>{i18n.t("assets.price")}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.price}
            onChangeText={(text) => updateForm("price", text)}
            placeholder="13000"
          />

          <Text style={styles.label}>{i18n.t("assets.value")}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.value}
            onChangeText={(text) => updateForm("value", text)}
            placeholder="1"
          />

          <Text style={styles.label}>{i18n.t("assets.unit")}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.unit}
              onValueChange={(itemValue) => updateForm("unit", itemValue)}
              style={styles.picker}
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

          <Text style={styles.label}>{i18n.t("assets.releaseDate")}</Text>
          <TextInput
            style={styles.input}
            value={form.releaseDate}
            onChangeText={(text) => updateForm("releaseDate", text)}
            placeholder="2026-07-02"
          />

          <Text style={styles.label}>{i18n.t("assets.location")}</Text>
          <TextInput
            style={styles.input}
            value={form.location}
            onChangeText={(text) => updateForm("location", text)}
            placeholder={i18n.t("assets.location")}
          />

          <Text style={styles.label}>{i18n.t("assets.description")}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(text) => updateForm("description", text)}
            placeholder={i18n.t("assets.description")}
            multiline
          />

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>{i18n.t("assets.submit")}</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          {i18n.t("assets.savedGoldData")}
        </Text>
        <FlatList
          scrollEnabled={false}
          data={goldData}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.rowCard}>
              <Text style={styles.rowTitle}>{formatVND(item.price)}</Text>
              <Text style={styles.rowText}>
                {i18n.t("assets.value")}: {item.value}
              </Text>
              <Text style={styles.rowText}>
                {i18n.t("assets.unit")}: {item.unit}
              </Text>
              <Text style={styles.rowText}>
                {i18n.t("assets.releaseDate")}: {item.releaseDate}
              </Text>
              <Text style={styles.rowText}>
                {i18n.t("assets.location")}: {item.location}
              </Text>
            </View>
          )}
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
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  total: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  formCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#ffffff",
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 14,
    backgroundColor: "#d4af37",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "700",
  },
  rowCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  rowText: {
    fontSize: 13,
  },
  separator: {
    height: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
});
