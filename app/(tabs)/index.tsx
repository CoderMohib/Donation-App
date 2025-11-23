import { CampaignCard } from "@/src/components/cards";
import { DashboardLayout } from "@/src/components/layouts";
import { ProfileDropdown } from "@/src/components/navigation";
import { CampaignListSkeleton } from "@/src/components/skeletons";
import { subscribeToCampaigns } from "@/src/firebase";
import { Campaign } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";

const CAMPAIGNS_PER_PAGE = 20;

export default function HomeScreen() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Shuffle array to show random campaigns
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Subscribe to real-time campaign updates
    const unsubscribe = subscribeToCampaigns(
      (campaignsData) => {
        // Randomize the order for discovery
        setCampaigns(shuffleArray(campaignsData));
        setLoading(false);
        setRefreshing(false);
      },
      {
        status: "in_progress", // Only show active campaigns on home screen
        limitCount: CAMPAIGNS_PER_PAGE,
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // The subscription will automatically update the data
    setTimeout(() => setRefreshing(false), 1000);
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
      rightAction={<ProfileDropdown />}
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
