import UpdateCard from "@/src/components/cards/UpdateCard";
import { subscribeToCampaignUpdates } from "@/src/firebase/firestore";
import { CampaignUpdate } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CampaignUpdatesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [updates, setUpdates] = useState<CampaignUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToCampaignUpdates(id, (fetchedUpdates) => {
      setUpdates(fetchedUpdates);
      setLoading(false);
      setRefreshing(false);
    });
    return () => unsubscribe();
  }, [id]);

  const handleRefresh = () => setRefreshing(true);

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center py-16">
      <Ionicons name="megaphone-outline" size={64} color="#d1d5db" />
      <Text className="mt-4 text-2xl font-semibold text-gray-900">
        No Updates Yet
      </Text>
      <Text className="mt-2 text-base text-gray-600 text-center px-8">
        The campaign creator hasn't posted any updates yet.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-[#f9fafb]">
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Campaign Updates
          </Text>
          <View className="w-6" />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#f9fafb]">
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">
          Campaign Updates
        </Text>
        <View className="w-6" />
      </View>
      <FlatList
        data={updates}
        renderItem={({ item }) => <UpdateCard update={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#10b981"]}
            tintColor="#10b981"
          />
        }
      />
    </View>
  );
}
