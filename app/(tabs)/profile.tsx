import { ConfirmDialog, Toast } from "@/src/components/feedback";
import { DashboardLayout } from "@/src/components/layouts";
import { NotificationBell } from "@/src/components/notifications/NotificationBell";
import {
  ProfileHeader,
  QuickActions,
  UserCampaignsSection,
} from "@/src/components/profile";
import { getCurrentUser, getUserDonations, logOut } from "@/src/firebase";
import { useCampaigns, useToast } from "@/src/hooks";
import { Donation, User } from "@/src/types";
import { asyncHandler } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
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
          <Text className="text-gray-500 mb-4">Please log in</Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-primary-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold">Login</Text>
          </TouchableOpacity>
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
        <View className="flex-row items-center gap-2">
          <NotificationBell />
          <TouchableOpacity
            onPress={handleLogout}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
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
          <ProfileHeader
            user={user}
            onSettingsPress={() => router.push("/settings")}
          />

          {/* Quick Actions */}
          <QuickActions
            userRole="user"
            onActionPress={(action) => {
              if (action === "my-campaigns") {
                router.push("/(tabs)/my-campaigns");
              } else if (action === "my-donations") {
                router.push("/(tabs)/my-donations");
              }
            }}
          />

          {/* User Campaigns */}
          <UserCampaignsSection
            campaigns={campaigns}
            totalCampaigns={user.totalCampaigns || 0}
            onCampaignPress={(campaignId) =>
              router.push({
                pathname: "/campaign/[id]",
                params: { id: campaignId },
              })
            }
            onViewAllPress={() => router.push("/(tabs)/my-campaigns")}
          />
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}
