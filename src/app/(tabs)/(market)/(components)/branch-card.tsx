import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

type BranchCardProps = {
  item: {
    id: string;
    name: string;
    address: string;
    phone: string;
    hours: string;
    distance: string;
  };
};

export default function BranchCard({ item }: BranchCardProps) {
  return (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <View className="w-full flex-row justify-between items-start mb-5">
        <View className="w-1/5">
          <Image
            source={require("@/assets/images/gold-logo.svg")}
            style={{ width: 50, height: 50, borderRadius: 50 }}
            className="rounded-full"
          />
        </View>
        <View className="w-3/5">
          <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
          <Text>Spread: 300,000 đ</Text>
        </View>

        <View className="w-1/5 items-end">
          <MaterialCommunityIcons
            name="heart-outline"
            size={20}
            color="#d4af37"
          />
        </View>
      </View>

      <View className="w-full flex-row justify-between items-start">
        <View className="w-1/2 flex-1 border border-amber-200 m-1 rounded-lg p-2 gap-1 mr-2 border-l-4 border-amber-400">
          <View className="flex-row items-center justify-between">
            <Text className="ml-2 text-gray-600 text-sm">Buy in</Text>
            <Text className="ml-2 text-gray-100 text-sm">/ Mace</Text>
          </View>
          <View>
            <Text className="ml-2 text-gray-600 text-lg font-bold">
              30,000,000
            </Text>
          </View>
          <View>
            <Text className="ml-2 text-green-600 text-sm">
              <MaterialCommunityIcons
                name="arrow-up-bold"
                size={10}
                color="green"
              />{" "}
              3,000,000
              </Text>
          </View>
        </View>
        <View className="w-1/2 flex-1 border border-amber-200 m-1 rounded-lg p-2 gap-1 ml-2 border-l-4 border-amber-400">
          <View className="flex-row items-center justify-between">
            <Text className="ml-2 text-gray-600 text-sm">Sell out</Text>
            <Text className="ml-2 text-gray-100 text-sm">/ Mace</Text>
          </View>
          <View>
            <Text className="ml-2 text-gray-600 text-lg font-bold">
              30,000,000
            </Text>
          </View>
          <View>
            <Text className="ml-2 text-red-600 text-sm">
              <MaterialCommunityIcons
                name="arrow-down-bold"
                size={10}
                color="red"
              />{" "}
              3,000,000
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity className="mt-4 bg-yellow-500 rounded-xl py-3 flex-row justify-center items-center">
        <Text className="text-white font-bold mr-2">View details</Text>
      </TouchableOpacity>
    </View>
  );
}
