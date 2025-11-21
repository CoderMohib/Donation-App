import { CampaignCard } from "@/src/components/cards";
import { DashboardLayout } from "@/src/components/layouts";
import { CampaignListSkeleton } from "@/src/components/skeletons";
import { getCampaigns } from "@/src/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { Campaign } from "@/src/types";
import { asyncHandler } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CAMPAIGNS_PER_PAGE = 20;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentLimit, setCurrentLimit] = useState(CAMPAIGNS_PER_PAGE);

  // Shuffle array to show random campaigns
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadCampaigns = async (
    limit: number = CAMPAIGNS_PER_PAGE,
    isRefresh: boolean = false
  ) => {
    const [data, error] = await asyncHandler(
      getCampaigns({
        status: "in_progress", // Only show active campaigns on home screen
        limitCount: limit,
      })
    );

    if (data) {
      // Randomize the order for discovery
      setCampaigns(shuffleArray(data));
      // Check if there might be more campaigns
      setHasMore(data.length >= limit);
    }

    setLoading(false);
    setRefreshing(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentLimit(CAMPAIGNS_PER_PAGE);
    setHasMore(true);
    loadCampaigns(CAMPAIGNS_PER_PAGE, true);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const newLimit = currentLimit + CAMPAIGNS_PER_PAGE;
    setCurrentLimit(newLimit);
    await loadCampaigns(newLimit);
  };

  return (
    <DashboardLayout
      title="Campaigns"
      leftAction={
        <View className="w-10 h-10 items-center justify-center">
          <Image
            source={require("@/assets/logo.png")}
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>
      }
      rightAction={
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="w-10 h-10 items-center justify-center"
        >
          {user?.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              className="w-9 h-9 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person-circle-outline" size={30} color="#ff7a5e" />
          )}
        </TouchableOpacity>
      }
      scrollable={false}
    >
      {/* Header Section */}
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Discover Campaigns
        </Text>
        <Text className="text-gray-600 mb-1">
          Explore diverse causes and make an impact today
        </Text>
        <Text className="text-sm text-gray-500">
          Showing {campaigns.length} active campaigns • Pull down to refresh
        </Text>
      </View>

      {/* Campaigns List */}
      {loading ? (
        <View className="px-4">
          <CampaignListSkeleton count={3} />
        </View>
      ) : (
        <FlatList
          data={campaigns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CampaignCard
              campaign={item}
              onPress={() => router.push(`/campaign/${item.id}`)}
              onDonatePress={() =>
                router.push({
                  pathname: "/donate/[campaignId]",
                  params: { campaignId: item.id },
                })
              }
            />
          )}
          contentContainerStyle={{
            paddingHorizontal: 16,
            flexGrow: 1,
            paddingBottom: 20,
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <View className="bg-gray-100 rounded-full p-6 mb-4">
                <Ionicons name="search-outline" size={64} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 text-xl font-bold mb-2">
                No Campaigns Yet
              </Text>
              <Text className="text-gray-600 text-center px-8 mb-4">
                No active campaigns found. Pull down to refresh and check for
                new campaigns!
              </Text>
              <View className="flex-row items-center bg-blue-50 px-4 py-3 rounded-full">
                <Ionicons
                  name="arrow-down"
                  size={20}
                  color="#3B82F6"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-blue-600 font-medium">
                  Pull to refresh
                </Text>
              </View>
            </View>
          }
          ListFooterComponent={
            hasMore && campaigns.length > 0 ? (
              <View className="py-4">
                {loadingMore ? (
                  <View className="flex-row items-center justify-center py-4">
                    <ActivityIndicator size="small" color="#ff7a5e" />
                    <Text className="text-gray-500 ml-2">Loading more...</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleLoadMore}
                    className="bg-primary-500 rounded-full py-4 px-6 mx-4 flex-row items-center justify-center"
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#ff7a5e"]}
              tintColor="#ff7a5e"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </DashboardLayout>
  );
}
