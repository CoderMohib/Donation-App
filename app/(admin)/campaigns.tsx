import { CampaignCard } from "@/src/components/cards";
import { SearchBar } from "@/src/components/inputs";
import { DashboardLayout } from "@/src/components/layouts";
import { FilterTabs } from "@/src/components/navigation";
import { CampaignListSkeleton } from "@/src/components/skeletons/CampaignCardSkeleton";
import {
  deleteCampaign,
  endCampaign,
  startCampaign,
} from "@/src/firebase/firestore";
import { useAuth, useCampaigns } from "@/src/hooks";
import { Campaign } from "@/src/types";
import { asyncHandler } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Active", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Ended", value: "ended" },
];

export default function AdminCampaignsScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(10);

  // Fetch all campaigns (no ownerId filter for admin)
  const { campaigns, loading, error } = useCampaigns({
    status:
      selectedStatus === "all"
        ? undefined
        : (selectedStatus as Campaign["status"]),
  });

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.shortDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      campaign.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Limit displayed campaigns for pagination
  const displayedCampaigns = filteredCampaigns.slice(0, displayLimit);
  const hasMore = filteredCampaigns.length > displayLimit;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/(tabs)");
    }
  }, [user, authLoading]);

  // Reset display limit when filters or search change
  useEffect(() => {
    setDisplayLimit(10);
  }, [selectedStatus, searchQuery]);

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  const handleStartCampaign = async (campaignId: string, title: string) => {
    Alert.alert(
      "Start Campaign",
      `Are you sure you want to start "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          style: "default",
          onPress: async () => {
            const [, error] = await asyncHandler(startCampaign(campaignId));
            if (error) {
              Alert.alert("Error", error.message);
            } else {
              Alert.alert("Success", "Campaign started successfully!");
            }
          },
        },
      ]
    );
  };

  const handleEndCampaign = async (campaignId: string, title: string) => {
    Alert.alert(
      "End Campaign",
      `Are you sure you want to end "${title}"? This will prevent further donations.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End",
          style: "destructive",
          onPress: async () => {
            const [, error] = await asyncHandler(endCampaign(campaignId));
            if (error) {
              Alert.alert("Error", error.message);
            } else {
              Alert.alert("Success", "Campaign ended successfully!");
            }
          },
        },
      ]
    );
  };

  const handleDeleteCampaign = async (campaignId: string, title: string) => {
    Alert.alert(
      "Delete Campaign",
      `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const [, error] = await asyncHandler(deleteCampaign(campaignId));
            if (error) {
              Alert.alert("Error", error.message);
            } else {
              Alert.alert("Success", "Campaign deleted successfully!");
            }
          },
        },
      ]
    );
  };

  const handleEditCampaign = (campaignId: string) => {
    router.push({
      pathname: "/campaign/edit/[id]",
      params: { id: campaignId },
    });
  };

  const renderCampaignActions = (campaign: Campaign) => (
    <View className="flex-row gap-2 mt-3 flex-wrap">
      {/* Edit Button */}
      <TouchableOpacity
        onPress={() => handleEditCampaign(campaign.id)}
        className="bg-blue-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
      >
        <Ionicons name="pencil" size={16} color="white" />
        <Text className="text-white font-semibold ml-2">Edit</Text>
      </TouchableOpacity>

      {/* Start Button (only for drafts) */}
      {campaign.status === "draft" && (
        <TouchableOpacity
          onPress={() => handleStartCampaign(campaign.id, campaign.title)}
          className="bg-green-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="play" size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Start</Text>
        </TouchableOpacity>
      )}

      {/* End Button (only for in_progress) */}
      {campaign.status === "in_progress" && (
        <TouchableOpacity
          onPress={() => handleEndCampaign(campaign.id, campaign.title)}
          className="bg-orange-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="stop" size={16} color="white" />
          <Text className="text-white font-semibold ml-2">End</Text>
        </TouchableOpacity>
      )}

      {/* Delete Button */}
      <TouchableOpacity
        onPress={() => handleDeleteCampaign(campaign.id, campaign.title)}
        className="bg-red-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
      >
        <Ionicons name="trash" size={16} color="white" />
        <Text className="text-white font-semibold ml-2">Delete</Text>
      </TouchableOpacity>

      {/* Owner Info */}
      <View className="w-full mt-2 pt-2 border-t border-gray-200">
        <Text className="text-gray-500 text-xs">
          Created by:{" "}
          <Text className="text-gray-900">{campaign.ownerName}</Text>
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View className="py-4">
        <TouchableOpacity
          onPress={handleLoadMore}
          className="bg-primary-500 rounded-full py-3 px-6 mx-4"
        >
          <Text className="text-white font-semibold text-center">
            Load More Campaigns
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <View className="mb-4">
      <CampaignCard
        campaign={item}
        onPress={() =>
          router.push({
            pathname: "/campaign/[id]",
            params: { id: item.id },
          })
        }
      />
      {renderCampaignActions(item)}
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">💼</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2">
        No Campaigns Found
      </Text>
      <Text className="text-gray-500 text-center px-8">
        {searchQuery
          ? "Try a different search term"
          : selectedStatus === "all"
            ? "No campaigns in the system yet"
            : `No ${selectedStatus === "in_progress" ? "active" : selectedStatus} campaigns found`}
      </Text>
    </View>
  );

  const renderError = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">⚠️</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2">
        Error Loading Campaigns
      </Text>
      <Text className="text-gray-500 text-center px-8">
        {error?.message || "Something went wrong"}
      </Text>
    </View>
  );

  if (authLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#ff7a5e" />
      </View>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardLayout
      title="Manage Campaigns"
      showBackButton={false}
      scrollable={false}
    >
      <View className=" bg-gray-50">
        {/* Search Bar */}
        <View className="px-4 pt-1">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search campaigns..."
            className="mb-0"
          />
        </View>

        {/* Filter Tabs */}
        <View className="px-2">
          <FilterTabs
            tabs={STATUS_FILTERS}
            activeTab={selectedStatus}
            onTabChange={setSelectedStatus}
          />
        </View>

        {/* Campaigns List */}
        {error ? (
          renderError()
        ) : loading ? (
          <CampaignListSkeleton count={5} />
        ) : (
          <FlatList
            data={displayedCampaigns}
            renderItem={renderCampaign}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 100,
            }}
            ListEmptyComponent={renderEmptyState()}
            ListFooterComponent={renderFooter}
            onEndReached={hasMore ? handleLoadMore : undefined}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </DashboardLayout>
  );
}
