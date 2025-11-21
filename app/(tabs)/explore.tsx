import { CampaignCard } from '@/src/components/cards';
import { SearchBar } from '@/src/components/inputs';
import { DashboardLayout } from '@/src/components/layouts';
import { FilterTabs } from '@/src/components/navigation';
import { getCampaigns, searchCampaigns } from '@/src/firebase';
import { Campaign } from '@/src/types';
import { asyncHandler } from '@/src/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTabs = [
    { label: 'All', value: 'all' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ];

  useEffect(() => {
    loadCampaigns();
  }, [activeFilter]);

  const loadCampaigns = async () => {
    const [data, error] = await asyncHandler(
      getCampaigns({
        status: activeFilter === 'all' ? undefined : (activeFilter as Campaign['status']),
      })
    );

    if (data) {
      setCampaigns(data);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      loadCampaigns();
      return;
    }

    const [data, error] = await asyncHandler(searchCampaigns(query));
    if (data) {
      setCampaigns(data);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    loadCampaigns();
  };

  return (
    <DashboardLayout title="Explore Campaigns" scrollable={false}>
      <View className="flex-1">
        {/* Search Bar */}
        <View className="px-4 pt-4">
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search campaigns..."
            onClear={() => handleSearch('')}
            className='mb-2'
          />
        </View>

        {/* Filter Tabs */}
        <View className="px-2">
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </View>

        {/* Campaigns List */}
        <View className="flex-1 px-4">
          {loading ? (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-500">Loading campaigns...</Text>
            </View>
          ) : campaigns.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Ionicons name="search-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 mt-4 text-center">
                {searchQuery ? 'No campaigns found' : 'No campaigns available'}
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
      </View>
    </DashboardLayout>
  );
}
