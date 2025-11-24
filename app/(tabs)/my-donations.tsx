import { PrimaryButton } from "@/src/components/buttons";
import { DonationCard } from "@/src/components/cards";
import { DashboardLayout } from "@/src/components/layouts";
import { ProfileDropdown } from "@/src/components/navigation";
import { auth, getUserDonations } from "@/src/firebase";
import { Donation } from "@/src/types";
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

const DONATIONS_PER_PAGE = 10;

export default function MyDonationsScreen() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(DONATIONS_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async (limit: number = DONATIONS_PER_PAGE) => {
    const user = auth?.currentUser;
    if (!user) {
      
      setLoading(false);
      return;
    }

    
    const [data, error] = await asyncHandler(getUserDonations(user.uid, limit));

    if (error) {
      console.error("My Donations: Error loading donations:", error);
    }

    if (data) {
      setDonations(data);
      // Check if there might be more donations
      setHasMore(data.length >= limit);
    } else {
      
      setHasMore(false);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const newLimit = currentLimit + DONATIONS_PER_PAGE;
    setCurrentLimit(newLimit);
    await loadDonations(newLimit);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentLimit(DONATIONS_PER_PAGE);
    await loadDonations(DONATIONS_PER_PAGE);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <DashboardLayout title="My Donations">
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ff7a5e" />
          <Text className="text-gray-500 mt-4">Loading...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (!auth?.currentUser) {
    return (
      <DashboardLayout title="My Donations">
        <View className="items-center justify-center py-20 px-4">
          <Ionicons name="lock-closed-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 mt-4 text-center">
            Please log in to view your donations
          </Text>
          <View className="mt-4">
            <PrimaryButton
              title="Login"
              onPress={() => router.push("/login")}
              size="medium"
            />
          </View>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Donations"
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
      <View className="px-4 py-6 flex-1">
        {donations.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">
              You haven't made any donations yet
            </Text>
            <View className="mt-4">
              <PrimaryButton
                title="Browse Campaigns"
                onPress={() => router.push("/(tabs)")}
                size="medium"
              />
            </View>
          </View>
        ) : (
          <>
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Your Donation History
            </Text>
            <FlatList
              data={donations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DonationCard donation={item} showCampaign />
              )}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#ff7a5e"]}
                  tintColor="#ff7a5e"
                />
              }
              ListFooterComponent={
                hasMore && donations.length > 0 ? (
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
                          Load More Donations
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null
              }
            />
          </>
        )}
      </View>
    </DashboardLayout>
  );
}
