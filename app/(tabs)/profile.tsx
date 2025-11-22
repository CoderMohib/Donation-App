import { PrimaryButton } from "@/src/components/buttons";
import { CampaignCard, DonationCard } from "@/src/components/cards";
import { ConfirmDialog, Toast } from "@/src/components/feedback";
import { DashboardLayout } from "@/src/components/layouts";
import { getCurrentUser, getUserDonations, logOut } from "@/src/firebase";
import { useCampaigns, useToast } from "@/src/hooks";
import { Donation, User } from "@/src/types";
import { asyncHandler, formatCurrency } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { toast, showError, hideToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [totalDonated, setTotalDonated] = useState(0);

  // Fetch user's campaigns (limited to 3 for preview)
  const { campaigns, loading: campaignsLoading } = useCampaigns({
    ownerId: user?.id,
    limitCount: 3, // Only show 3 campaigns on profile
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async (isRefreshing = false) => {
    if (!isRefreshing) {
      setLoading(true);
    }

    const [userData, userError] = await asyncHandler(getCurrentUser());

    if (userData) {
      setUser(userData);

      // Load user's donations
      const [donationsData, donationsError] = await asyncHandler(
        getUserDonations(userData.id, 10)
      );

      if (donationsData) {
        setDonations(donationsData);
        const total = donationsData.reduce((sum, d) => sum + d.amount, 0);
        setTotalDonated(total);
      }
    }

    if (isRefreshing) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData(true);
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutDialog(false);
    setIsLoggingOut(true);
    const [_, error] = await asyncHandler(logOut());
    if (!error) {
      // Small delay to ensure auth state clears
      setTimeout(() => {
        router.replace("/login");
      }, 100);
    } else {
      setIsLoggingOut(false);
      showError("Failed to logout. Please try again.");
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  if (loading || isLoggingOut) {
    return (
      <DashboardLayout title="Profile">
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ff7a5e" />
          <Text className="text-gray-500 mt-4">
            {isLoggingOut ? "Logging out..." : "Loading..."}
          </Text>
        </View>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout title="Profile">
        <View className="items-center justify-center py-20">
          <Text className="text-gray-500">Please log in</Text>
          <PrimaryButton
            title="Login"
            onPress={() => router.push("/login")}
            size="medium"
          />
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Profile"
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
      rightAction={
        <TouchableOpacity
          onPress={handleLogout}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      }
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <ConfirmDialog
        visible={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        confirmColor="danger"
        icon="log-out"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff7a5e"]}
            tintColor="#ff7a5e"
          />
        }
      >
        <View className="px-4 py-5">
          {/* Profile Header */}
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <View className="items-center mb-4">
              {/* Profile Image */}
              <LinearGradient
                colors={["#67c3d7", "#ff9580"]} // cyan to coral gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 86,
                  height: 86,
                  borderRadius: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <Text className="text-white text-4xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                )}
              </LinearGradient>

              {/* User Info */}
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {user.name}
              </Text>
              <Text className="text-gray-500 mb-4">{user.email}</Text>

              {/* Role Badge */}
              {user.role === "admin" && (
                <View className="bg-purple-100 px-4 py-1 rounded-full">
                  <Text className="text-purple-700 font-semibold text-sm">
                    Admin
                  </Text>
                </View>
              )}
            </View>

            {/* Stats */}
            <View className="flex-row justify-around pt-4 border-t border-gray-100">
              <View className="items-center">
                <Text className="text-2xl font-bold text-primary-500">
                  {user.donationCount || 0}
                </Text>
                <Text className="text-gray-500 text-sm">Donations</Text>
              </View>
              <View className="w-px h-12 bg-gray-200" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {formatCurrency(user.totalDonated || 0)}
                </Text>
                <Text className="text-gray-500 text-sm">Total Given</Text>
              </View>
              <View className="w-px h-12 bg-gray-200" />
              <View className="items-center">
                <Text className="text-2xl font-bold text-secondary-600">
                  {user.totalCampaigns || 0}
                </Text>
                <Text className="text-gray-500 text-sm">Campaigns</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-4">
            <Text className="text-xl font-bold text-gray-900 mb-3">
              Quick Actions
            </Text>
            <View className="gap-3">
              {/* My Campaigns Button */}
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/my-campaigns")}
                className="bg-white rounded-2xl p-4 shadow-lg flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <View className="bg-primary-100 w-12 h-12 rounded-full items-center justify-center mr-4">
                    <Ionicons name="heart" size={24} color="#ff7a5e" />
                  </View>
                  <View>
                    <Text className="text-gray-900 font-bold text-base">
                      My Campaigns
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      Manage your campaigns
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </TouchableOpacity>

              {/* My Donations Button */}
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/my-donations")}
                className="bg-white rounded-2xl p-4 shadow-lg flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <View className="bg-secondary-100 w-12 h-12 rounded-full items-center justify-center mr-4">
                    <Ionicons name="list" size={24} color="#4894a8" />
                  </View>
                  <View>
                    <Text className="text-gray-900 font-bold text-base">
                      My Donations
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      View donation history
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* User Campaigns */}
          {campaigns.length > 0 && (
            <View className="mb-1">
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Your Campaigns
              </Text>
              {campaigns.map((campaign) => (
                <View key={campaign.id} className="mb-2">
                  <CampaignCard
                    campaign={campaign}
                    onPress={() =>
                      router.push({
                        pathname: "/campaign/[id]",
                        params: { id: campaign.id },
                      })
                    }
                  />
                </View>
              ))}
              {user.totalCampaigns > 3 && (
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/my-campaigns")}
                  className="bg-secondary-100 rounded-xl p-4 flex-row items-center justify-center mt-2"
                >
                  <Text className="text-secondary-600 font-semibold mr-2">
                    View All {user.totalCampaigns} Campaigns
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#4894a8" />
                </TouchableOpacity>
              )}
            </View>
          )}


          {/* Empty State - Only show if user truly has no donations */}
          {(!user.donationCount || user.donationCount === 0) && (
            <View className="items-center justify-center mb-2">
              <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-500 text-center">
                {`You haven't made any donations yet`}
              </Text>
              <View className="mt-2">
                <PrimaryButton
                  title="Browse Campaigns"
                  onPress={() => router.push("/(tabs)")}
                  size="medium"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}
