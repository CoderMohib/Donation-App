import { CampaignCard } from "@/src/components/cards";
import { SearchBar } from "@/src/components/inputs";
import { DashboardLayout } from "@/src/components/layouts";
import { FilterTabs, ProfileDropdown } from "@/src/components/navigation";
import { CampaignListSkeleton } from "@/src/components/skeletons";
import { getCampaigns, searchCampaigns } from "@/src/firebase";
import { Campaign } from "@/src/types";
import { asyncHandler } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

export default function ExploreScreen() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filterTabs = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in_progress" },
    { label: "Completed", value: "completed" },
    { label: "Ended", value: "ended" },
  ];

  useEffect(() => {
    loadCampaigns();
  }, [activeFilter]);

  const loadCampaigns = async () => {
    // Show skeleton only when changing filters (not initial load)
    if (!loading) {
      setFilterLoading(true);
    }

    const [data, error] = await asyncHandler(
      getCampaigns({
        status:
          activeFilter === "all"
            ? undefined
            : (activeFilter as Campaign["status"]),
      })
    );

    if (data) {
      // Filter out draft campaigns for public explore screen
      const publicCampaigns =
        activeFilter === "all"
          ? data.filter((campaign) => campaign.status !== "draft")
          : data;
      setCampaigns(publicCampaigns);
    }
    setLoading(false);
    setFilterLoading(false);
    setRefreshing(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      loadCampaigns();
      return;
    }

    const [data, error] = await asyncHandler(searchCampaigns(query));
    if (data) {
      // Filter out draft campaigns from search results
      const publicCampaigns = data.filter(
        (campaign) => campaign.status !== "draft"
      );
      setCampaigns(publicCampaigns);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchQuery("");
    loadCampaigns();
  };

  return (
    <DashboardLayout
      title="Explore Campaigns"
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
      rightAction={<ProfileDropdown />}
    >
      <View className="flex-1">
        {/* Search Bar */}
        <View className="px-4 pt-4">
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search campaigns..."
            onClear={() => handleSearch("")}
            className="mb-2"
          />
        </View>

        {/* Filter Tabs */}
        <View className="px-2 mb-3">
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </View>

        {/* Skeleton Loader */}
        {filterLoading ? <CampaignListSkeleton count={3} /> : null}

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
                {searchQuery ? "No campaigns found" : "No campaigns available"}
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
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
              contentContainerStyle={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </DashboardLayout>
  );
}
