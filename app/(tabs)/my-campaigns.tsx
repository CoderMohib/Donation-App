import { CampaignCard } from '@/src/components/cards';
import { SearchBar } from '@/src/components/inputs';
import { DashboardLayout } from '@/src/components/layouts';
import { FilterTabs } from '@/src/components/navigation';
import { deleteCampaign, startCampaign } from '@/src/firebase/firestore';
import { useAuth, useCampaigns } from '@/src/hooks';
import { Campaign } from '@/src/types';
import { asyncHandler } from '@/src/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Ended', value: 'ended' },
];

export default function MyCampaignsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user's campaigns
  const { campaigns, loading, error } = useCampaigns({
    ownerId: user?.id,
    status: selectedStatus === 'all' ? undefined : (selectedStatus as Campaign['status']),
  });

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleStartCampaign = async (campaignId: string, title: string) => {
    Alert.alert(
      'Start Campaign',
      `Are you sure you want to start "${title}"? Once started, it will be visible to all users.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start',
          style: 'default',
          onPress: async () => {
            const [, error] = await asyncHandler(startCampaign(campaignId));
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              Alert.alert('Success', 'Campaign started successfully!');
            }
          },
        },
      ]
    );
  };

  const handleDeleteCampaign = async (campaignId: string, title: string) => {
    Alert.alert(
      'Delete Campaign',
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const [, error] = await asyncHandler(deleteCampaign(campaignId));
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              Alert.alert('Success', 'Campaign deleted successfully!');
            }
          },
        },
      ]
    );
  };

  const handleEditCampaign = (campaignId: string) => {
    router.push({
      pathname: '/campaign/edit/[id]',
      params: { id: campaignId },
    });
  };

  const renderCampaignActions = (campaign: Campaign) => (
    <View className="flex-row gap-2 mt-3">
      {/* Edit Button */}
      <TouchableOpacity
        onPress={() => handleEditCampaign(campaign.id)}
        className="flex-1 bg-blue-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
      >
        <Ionicons name="pencil" size={16} color="white" />
        <Text className="text-white font-semibold ml-2">Edit</Text>
      </TouchableOpacity>

      {/* Start Button (only for drafts) */}
      {campaign.status === 'draft' && (
        <TouchableOpacity
          onPress={() => handleStartCampaign(campaign.id, campaign.title)}
          className="flex-1 bg-green-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="play" size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Start</Text>
        </TouchableOpacity>
      )}

      {/* Delete Button (only for drafts) */}
      {campaign.status === 'draft' && (
        <TouchableOpacity
          onPress={() => handleDeleteCampaign(campaign.id, campaign.title)}
          className="bg-red-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="trash" size={16} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <View className="mb-4">
      <CampaignCard
        campaign={item}
        onPress={() =>
          router.push({
            pathname: '/campaign/[id]',
            params: { id: item.id },
          })
        }
      />
      {renderCampaignActions(item)}
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">📝</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2">
        No Campaigns Yet
      </Text>
      <Text className="text-gray-500 text-center mb-6 px-8">
        {selectedStatus === 'all'
          ? "You haven't created any campaigns yet. Start your first campaign today!"
          : `You don't have any ${selectedStatus} campaigns.`}
      </Text>
      {selectedStatus === 'all' && (
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/create-campaign')}
          className="bg-purple-600 rounded-full px-6 py-3"
        >
          <Text className="text-white font-semibold">Create Campaign</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderError = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">⚠️</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2">
        Error Loading Campaigns
      </Text>
      <Text className="text-gray-500 text-center px-8">
        {error?.message || 'Something went wrong'}
      </Text>
    </View>
  );

  return (
    <DashboardLayout title="My Campaigns" showBackButton={false} scrollable={false}>
      <View className="flex-1">
        {/* Search Bar */}
        <View className="px-4 pt-4">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search my campaigns..."
          />
        </View>

        {/* Filter Tabs */}
        <FilterTabs
          tabs={STATUS_FILTERS}
          activeTab={selectedStatus}
          onTabChange={setSelectedStatus}
        />

        {/* Campaigns List */}
        {error ? (
          renderError()
        ) : (
          <FlatList
            data={filteredCampaigns}
            renderItem={renderCampaign}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
            ListEmptyComponent={loading ? null : renderEmptyState()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </DashboardLayout>
  );
}
