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
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BranchCard from "./(components)/branch-card";

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

export const branches = [
  {
    id: "1",
    name: "PNJ Nguyễn Huệ",
    address: "123 Nguyễn Huệ, Quận 1",
    phone: "028 3822 1111",
    hours: "08:00 - 21:00",
    distance: "0.8 km",
  },
  {
    id: "2",
    name: "PNJ Lê Lợi",
    address: "210 Lê Lợi, Quận 1",
    phone: "028 3822 2222",
    hours: "08:00 - 21:00",
    distance: "1.2 km",
  },
  {
    id: "3",
    name: "PNJ Võ Văn Tần",
    address: "55 Võ Văn Tần, Quận 3",
    phone: "028 3930 3333",
    hours: "08:00 - 21:00",
    distance: "2.5 km",
  },
  {
    id: "4",
    name: "PNJ Phan Xích Long",
    address: "85 Phan Xích Long, Phú Nhuận",
    phone: "028 3999 4444",
    hours: "08:00 - 21:00",
    distance: "3.1 km",
  },
  {
    id: "5",
    name: "PNJ Cộng Hòa",
    address: "450 Cộng Hòa, Tân Bình",
    phone: "028 3811 5555",
    hours: "08:00 - 21:00",
    distance: "4.2 km",
  },
  {
    id: "6",
    name: "PNJ Gò Vấp",
    address: "220 Quang Trung, Gò Vấp",
    phone: "028 3899 6666",
    hours: "08:00 - 21:00",
    distance: "5.5 km",
  },
  {
    id: "7",
    name: "PNJ Thủ Đức",
    address: "35 Võ Văn Ngân, Thủ Đức",
    phone: "028 3722 7777",
    hours: "08:00 - 21:00",
    distance: "8.3 km",
  },
  {
    id: "8",
    name: "PNJ Bình Thạnh",
    address: "420 Điện Biên Phủ, Bình Thạnh",
    phone: "028 3512 8888",
    hours: "08:00 - 21:00",
    distance: "6.8 km",
  },
  {
    id: "9",
    name: "PNJ Quận 7",
    address: "120 Nguyễn Thị Thập, Quận 7",
    phone: "028 3777 9999",
    hours: "08:00 - 21:00",
    distance: "9.4 km",
  },
  {
    id: "10",
    name: "PNJ Tân Phú",
    address: "560 Lũy Bán Bích, Tân Phú",
    phone: "028 3810 0000",
    hours: "08:00 - 21:00",
    distance: "7.9 km",
  },
];

export default function MarketScreen() {
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
    <ThemedView className="flex-1 bg-amber-50">
      <SafeAreaView className="flex-1 bg-amber-50">
        <View className="px-5 pt-5">
          <Text className="text-3xl font-bold text-gray-900">
            Gold Branches
          </Text>

          <Text className="text-gray-500 mt-1">
            Find the nearest gold store
          </Text>

          <View className="mt-5 flex-row items-center bg-white rounded-xl px-4 h-14 border border-gray-200">
            <TextInput
              placeholder="Search branch..."
              className="flex-1 ml-3 text-base"
            />
          </View>
        </View>

        <FlatList
          className="mt-5"
          data={branches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BranchCard item={item} />}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}
        />
      </SafeAreaView>
    </ThemedView>
  );
}
