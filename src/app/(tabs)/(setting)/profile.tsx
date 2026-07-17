import { ThemedView } from "@/components/themed-view";
import { useProfiles } from "@/context/profile-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, View, ScrollView, Text } from "react-native";

export default function ProfileScreen() {
  const { profiles, isLoadingProfiles, profileError } = useProfiles();
  const profile = profiles[0];

  return (
    <ThemedView className="flex-1 bg-slate-50">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="min-h-full grow px-5 pb-10 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {isLoadingProfiles ? (
            <View className="flex-1 items-center justify-center py-16">
              <ActivityIndicator color="#d4af37" />
              <Text className="mt-3 text-sm font-medium text-slate-500">
                Loading profile...
              </Text>
            </View>
          ) : profileError ? (
            <View className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
              <Text className="text-base font-bold text-red-700">
                Unable to load profile
              </Text>
              <Text className="mt-1 text-sm text-red-600">{profileError}</Text>
            </View>
          ) : profile ? (
            <View>
              <View className="mb-5 rounded-xl border border-slate-200 bg-white px-5 py-5">
                <Text className="text-xs font-bold uppercase text-main-primary">
                  Profile information
                </Text>
                <Text className="mt-3 text-2xl font-bold text-slate-900">
                  {profile.fullName || "Unnamed profile"}
                </Text>
                <Text className="mt-1 text-sm font-medium text-slate-500">
                  {profile.phone || "No phone number"}
                </Text>
              </View>

              <View className="mb-5 rounded-xl border border-slate-200 bg-white px-5 py-5">
                <Text className="mb-3 text-lg font-bold text-slate-900">
                  Gold accounts
                </Text>
                {profile.goldAccounts.length > 0 ? (
                  profile.goldAccounts.map((account) => (
                    <View
                      key={account.id}
                      className="mb-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3"
                    >
                      <Text className="text-base font-bold text-slate-900">
                        {account.accountName}
                      </Text>
                      <Text className="mt-1 text-xs font-medium text-slate-500">
                        {account.transactions.length} transactions
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-sm font-medium text-slate-500">
                    No gold accounts yet.
                  </Text>
                )}
              </View>

              <View className="rounded-xl border border-slate-200 bg-white px-5 py-5">
                <Text className="mb-3 text-lg font-bold text-slate-900">
                  Favourite stores
                </Text>
                {profile.favouriteStores.length > 0 ? (
                  profile.favouriteStores.flatMap((favouriteStore) => favouriteStore.stores).map((store) => (
                    <View
                      key={store.id}
                      className="mb-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <Text className="text-base font-semibold text-slate-900">
                        {store?.name || "Unnamed store"}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-sm font-medium text-slate-500">
                    No favourite stores yet.
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <Text className="text-base font-bold text-slate-900">
                No profile found
              </Text>
              <Text className="mt-1 text-sm text-slate-500">
                Your account does not have profile data yet.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
