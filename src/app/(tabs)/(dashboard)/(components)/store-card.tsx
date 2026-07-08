import { Store } from "@/features/store/store.type";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Image } from "expo-image";

export default function StoreCard({ store }: { store: Store }) {
  return (
    <View className="mb-4 overflow-hidden rounded-xl shadow">
      <View className="flex-row w-full items-center justify-between">
        <View className="w-1/5 p-2">
          <Image source={require("@/assets/images/gold-logo.svg")} style={{ height: 50, width: 50, borderRadius: 25 }} />
        </View>
        <View className="w-3/5 p-2">
          <View className="flex-row items-start justify-between mb-3">
            <Text className="text-lg font-bold text-slate-900">
              {store.name}
            </Text>
          </View>
          <View className="flex-row items-start justify-between mb-3">
            <Text className="text-xs text-slate-500">Spread 300,000</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://maps.google.com/?q=-33.8688,151.2093")
            }
            className="flex-row items-center justify-center rounded-xl border border-main-primary px-5 py-2"
          >
            <Ionicons name="location" size={18} color="#d4af37" />
            <Text className="ml-2 font-semibold text-main-primary">Map</Text>
          </TouchableOpacity>
        </View>
        <View className="w-2/5 p-2">
          <Text className="my-1 text-sm text-slate-500">
            Buy: 13,000,000{"\n"}
            <Text className="text-sm text-slate-500">60,000</Text>
          </Text>
          <Text className="mt-1 text-sm text-emerald-600">
            Sell: 12,700,000{"\n"}
            <Text className="text-sm text-slate-500">60,000</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
