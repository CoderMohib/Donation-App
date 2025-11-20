import { CampaignCard } from '@/src/components/cards';
import { DashboardLayout } from '@/src/components/layouts';
import { getCampaigns } from '@/src/firebase';
import { Campaign } from '@/src/types';
import { asyncHandler } from '@/src/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  const loadCampaigns = async () => {
    const [data, error] = await asyncHandler(
      getCampaigns({
        status: filter === 'all' ? undefined : filter,
      })
    );

    if (data) {
      setCampaigns(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadCampaigns();
  }, [filter]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadCampaigns();
  };

  const FilterButton = ({ label, value }: { label: string; value: typeof filter }) => (
    <TouchableOpacity
      onPress={() => setFilter(value)}
      className={`px-4 py-2 rounded-full mr-2 ${
        filter === value ? 'bg-purple-600' : 'bg-gray-200'
      }`}
    >
      <Text
        className={`font-semibold ${
          filter === value ? 'text-white' : 'text-gray-700'
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <DashboardLayout
      title="Campaigns"
      rightAction={
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="person-circle-outline" size={28} color="#7C3AED" />
        </TouchableOpacity>
      }
    >
      {/* Header Section */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Make a Difference Today
        </Text>
        <Text className="text-gray-600 mb-4">
          Support causes that matter to you
        </Text>

        {/* Filter Buttons */}
        <View className="flex-row mb-4">
          <FilterButton label="Active" value="active" />
          <FilterButton label="All" value="all" />
          <FilterButton label="Completed" value="completed" />
        </View>
      </View>

      {/* Campaigns List */}
      <View className="px-4">
        {loading ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500">Loading campaigns...</Text>
          </View>
        ) : campaigns.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">
              No campaigns found
            </Text>
          </View>
        ) : (
          <FlatList
            data={campaigns}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CampaignCard
                campaign={item}
                onPress={() => router.push(`/campaign/${item.id}`)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </DashboardLayout>
  );
}
