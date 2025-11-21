import { CampaignCard } from "@/src/components/cards";
import { ConfirmDialog, Toast } from "@/src/components/feedback";
import { SearchBar } from "@/src/components/inputs";
import { DashboardLayout } from "@/src/components/layouts";
import { FilterTabs } from "@/src/components/navigation";
import { CampaignListSkeleton } from "@/src/components/skeletons";
import {
  deleteCampaign,
  startCampaign,
  updateUserCampaignStats,
} from "@/src/firebase/firestore";
import { useAuth, useCampaigns, useToast } from "@/src/hooks";
import { Campaign } from "@/src/types";
import { asyncHandler } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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

export default function MyCampaignsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLimit, setCurrentLimit] = useState(20);
  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean;
    type: "start" | "delete" | null;
    campaignId: string;
    campaignTitle: string;
  }>({ visible: false, type: null, campaignId: "", campaignTitle: "" });

  // Fetch user's campaigns
  const { campaigns, loading, error } = useCampaigns({
    ownerId: user?.id,
    status:
      selectedStatus === "all"
        ? undefined
        : (selectedStatus as Campaign["status"]),
    limitCount: currentLimit,
  });

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.shortDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleStartCampaign = async (campaignId: string, title: string) => {
    setConfirmDialog({
      visible: true,
      type: "start",
      campaignId,
      campaignTitle: title,
    });
  };

  const handleDeleteCampaign = async (campaignId: string, title: string) => {
    setConfirmDialog({
      visible: true,
      type: "delete",
      campaignId,
      campaignTitle: title,
    });
  };

  const handleConfirmAction = async () => {
    const { type, campaignId } = confirmDialog;
    setConfirmDialog({
      visible: false,
      type: null,
      campaignId: "",
      campaignTitle: "",
    });

    if (type === "start") {
      const [, error] = await asyncHandler(startCampaign(campaignId));
      if (error) {
        showError(error.message || "Failed to start campaign");
      } else {
        showSuccess("Campaign started successfully!");
      }
    } else if (type === "delete") {
      const [, error] = await asyncHandler(deleteCampaign(campaignId));
      if (error) {
        showError(error.message || "Failed to delete campaign");
      } else {
        // Update user's campaign count
        if (user?.id) {
          await asyncHandler(updateUserCampaignStats(user.id, -1));
        }
        showSuccess("Campaign deleted successfully!");
      }
    }
  };

  const handleCancelAction = () => {
    setConfirmDialog({
      visible: false,
      type: null,
      campaignId: "",
      campaignTitle: "",
    });
  };

  const [loadingMore, setLoadingMore] = useState(false);
  const hasMore = campaigns.length >= currentLimit;

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setCurrentLimit((prev) => prev + 20);
    // The hook will automatically refetch with new limit
    setTimeout(() => setLoadingMore(false), 500);
  };

  const handleEditCampaign = (campaignId: string) => {
    router.push({
      pathname: "/campaign/edit/[id]",
      params: { id: campaignId },
    });
  };

  const renderCampaignActions = (campaign: Campaign) => (
    <View className="flex-row gap-3 mt-4 px-1 mb-6">
      {/* Edit Button */}
      <TouchableOpacity
        onPress={() => handleEditCampaign(campaign.id)}
        className="flex-1 bg-secondary-500 rounded-full py-3 px-4 flex-row items-center justify-center"
        style={{
          shadowColor: "#4894a8",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="pencil" size={18} color="white" />
        <Text className="text-white font-bold ml-2 text-base">Edit</Text>
      </TouchableOpacity>

      {/* Start Button (only for drafts) */}
      {campaign.status === "draft" && (
        <TouchableOpacity
          onPress={() => handleStartCampaign(campaign.id, campaign.title)}
          className="flex-1 bg-primary-500 rounded-full py-3 px-4 flex-row items-center justify-center"
          style={{
            shadowColor: "#ff7a5e",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="play-circle" size={18} color="white" />
          <Text className="text-white font-bold ml-2 text-base">Start</Text>
        </TouchableOpacity>
      )}

      {/* Delete Button (only for drafts) */}
      {campaign.status === "draft" && (
        <TouchableOpacity
          onPress={() => handleDeleteCampaign(campaign.id, campaign.title)}
          className="bg-primary-700 rounded-full py-3 px-6 flex-row items-center justify-center"
          style={{
            shadowColor: "#e04020",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
            minWidth: 56,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="trash" size={18} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <View className="mb-2">
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

  const renderEmptyState = () => {
    // Check if we're showing empty due to search/filter
    const hasActiveSearch = searchQuery.trim().length > 0;
    const isFiltered = selectedStatus !== "all";
    const hasNoCampaignsAtAll =
      campaigns.length === 0 && !hasActiveSearch && !isFiltered;

    // No search results (but user has campaigns)
    if (hasActiveSearch || (isFiltered && campaigns.length > 0)) {
      return (
        <View className="flex-1 items-center justify-center py-20 px-6">
          {/* Search icon */}
          <View className="bg-gray-100 rounded-full p-6 mb-6">
            <Ionicons name="search-outline" size={64} color="#9CA3AF" />
          </View>

          <Text className="text-gray-900 text-2xl font-bold mb-3 text-center">
            No Campaigns Found
          </Text>
          <Text className="text-gray-600 text-center mb-8 px-4 leading-6">
            {hasActiveSearch
              ? `No campaigns match "${searchQuery}". Try a different search term.`
              : `You don't have any ${selectedStatus} campaigns.`}
          </Text>
          {hasActiveSearch && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="bg-secondary-500 rounded-full px-8 py-4 flex-row items-center"
              style={{
                shadowColor: "#4894a8",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-bold text-base">
                Clear Search
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // No campaigns at all
    return (
      <View className="flex-1 items-center justify-center py-20 px-6">
        {/* Icon with gradient background */}
        <View className="bg-secondary-100 rounded-full p-6 mb-6">
          <Ionicons name="folder-open-outline" size={64} color="#4894a8" />
        </View>

        <Text className="text-gray-900 text-2xl font-bold mb-3 text-center">
          No Campaigns Yet
        </Text>
        <Text className="text-gray-600 text-center mb-8 px-4 leading-6">
          You haven't created any campaigns yet. Start your first campaign today
          and make a difference!
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/create-campaign")}
          className="bg-primary-500 rounded-full px-8 py-4 flex-row items-center"
          style={{
            shadowColor: "#ff7a5e",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="add-circle"
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="text-white font-bold text-base">
            Create Your First Campaign
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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

  return (
    <DashboardLayout
      title="My Campaigns"
      showBackButton={false}
      scrollable={false}
      leftAction={
        <View className="w-10 h-10 items-center justify-center">
          <Image
            source={require("@/assets/logo.png")}
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>
      }
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <ConfirmDialog
        visible={confirmDialog.visible}
        title={
          confirmDialog.type === "start" ? "Start Campaign" : "Delete Campaign"
        }
        message={
          confirmDialog.type === "start"
            ? `Are you sure you want to start "${confirmDialog.campaignTitle}"? Once started, it will be visible to all users.`
            : `Are you sure you want to delete "${confirmDialog.campaignTitle}"? This action cannot be undone.`
        }
        confirmText={
          confirmDialog.type === "start" ? "Start Campaign" : "Delete Campaign"
        }
        confirmColor={confirmDialog.type === "delete" ? "danger" : "primary"}
        icon={confirmDialog.type === "start" ? "rocket" : "trash"}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
      <View className="flex-1">
        {/* Search Bar */}
        <View className="px-4 pt-4">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search my campaigns..."
            className="mb-2"
          />
        </View>

        {/* Filter Tabs */}
        <View className="mb-3">
          <FilterTabs
            tabs={STATUS_FILTERS}
            activeTab={selectedStatus}
            onTabChange={setSelectedStatus}
          />
        </View>

        {/* Campaigns List */}
        {loading ? (
          <View className="px-4">
            <CampaignListSkeleton count={6} />
          </View>
        ) : error ? (
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
            ListEmptyComponent={renderEmptyState()}
            ListFooterComponent={
              hasMore && filteredCampaigns.length > 0 && !loading ? (
                <View className="py-4">
                  {loadingMore ? (
                    <View className="flex-row items-center justify-center py-4">
                      <ActivityIndicator size="small" color="#ff7a5e" />
                      <Text className="text-gray-500 ml-2">
                        Loading more...
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleLoadMore}
                      className="bg-secondary-500 rounded-full py-4 px-6 mx-4 flex-row items-center justify-center"
                      style={{
                        shadowColor: "#4894a8",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 6,
                      }}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={20}
                        color="white"
                        style={{ marginRight: 8 }}
                      />
                      <Text className="text-white font-bold text-base">
                        Load More Campaigns
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : null
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </DashboardLayout>
  );
}
