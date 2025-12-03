import { ProfileDropdown } from "@/src/components";
import {
  CampaignPerformanceChart,
  DonationStatusChart,
  DonationTrendChart,
  UserGrowthChart,
} from "@/src/components/admin/AdminDashboardCharts";
import { DashboardLayout } from "@/src/components/layouts";
import { db } from "@/src/firebase/firebase";
import { useAuth } from "@/src/hooks";
import { useAdminChartData } from "@/src/hooks/useAdminChartData";
import { Donation } from "@/src/types";
import { formatCurrency } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Stats {
  totalUsers: number;
  totalCampaigns: number;
  totalDonations: number;
  totalAmountDonated: number;
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCampaigns: 0,
    totalDonations: 0,
    totalAmountDonated: 0,
  });
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState(30);

  // Fetch chart data
  const {
    chartData,
    loading: chartsLoading,
    refresh: refreshCharts,
  } = useAdminChartData(timeRange);

  useEffect(() => {
    if (authLoading) return;

    // Check if user is logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // Check if user is admin
    if (user.role !== "admin") {
      router.replace("/(tabs)");
      return;
    }

    loadDashboardData();
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    if (!db) return;

    try {
      setLoading(true);

      // Get counts
      const [usersCount, campaignsCount, donationsCount] = await Promise.all([
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "campaigns")),
        getCountFromServer(collection(db, "donations")),
      ]);

      // Get recent donations (limit to 5 for dashboard)
      const donationsQuery = query(
        collection(db, "donations"),
        orderBy("donatedAt", "desc"),
        limit(5)
      );
      const donationsSnapshot = await getDocs(donationsQuery);
      const donations = donationsSnapshot.docs.map(
        (doc) => doc.data() as Donation
      );

      // Calculate total amount from all donations
      const allDonationsQuery = query(collection(db, "donations"));
      const allDonationsSnapshot = await getDocs(allDonationsQuery);
      const totalAmount = allDonationsSnapshot.docs.reduce((sum, doc) => {
        const donation = doc.data() as Donation;
        return sum + donation.amount;
      }, 0);

      setStats({
        totalUsers: usersCount.data().count,
        totalCampaigns: campaignsCount.data().count,
        totalDonations: donationsCount.data().count,
        totalAmountDonated: totalAmount,
      });
      setRecentDonations(donations);
      setLoading(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadDashboardData(), refreshCharts()]);
    setRefreshing(false);
  };

  const TimeRangeButton = ({
    days,
    label,
  }: {
    days: number;
    label: string;
  }) => (
    <TouchableOpacity
      className={`px-4 py-2 rounded-lg mr-2 ${
        timeRange === days ? "bg-primary-500" : "bg-gray-200"
      }`}
      onPress={() => setTimeRange(days)}
    >
      <Text
        className={`text-sm font-semibold ${
          timeRange === days ? "text-white" : "text-gray-600"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({
    title,
    value,
    icon,
    color,
    bgColor,
  }: {
    title: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
  }) => (
    <View className="bg-white rounded-2xl p-4 flex-1 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-gray-500 text-sm font-medium">{title}</Text>
        <View className={`${bgColor} rounded-full p-2`}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
      </View>
      <Text className="text-gray-900 text-2xl font-bold">{value}</Text>
    </View>
  );

  const renderDonation = ({ item }: { item: Donation }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold" numberOfLines={1}>
            {item.campaignTitle || "Unknown Campaign"}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            by {item.isAnonymous ? "Anonymous" : item.donorName}
          </Text>
        </View>
        <Text className="text-green-600 font-bold text-lg">
          {formatCurrency(item.amount)}
        </Text>
      </View>
      {item.message && (
        <Text className="text-gray-600 text-sm italic" numberOfLines={2}>
          {item.message}
        </Text>
      )}
      <Text className="text-gray-400 text-xs mt-2">
        {new Date(item.donatedAt).toLocaleDateString()} at{" "}
        {new Date(item.donatedAt).toLocaleTimeString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <DashboardLayout title="Admin Dashboard" showBackButton={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ff7a5e" />
          <Text className="text-gray-500 mt-4">Loading dashboard...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Admin Dashboard" showBackButton={false}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-gray-900 text-xl font-bold mb-2">
            Error Loading Dashboard
          </Text>
          <Text className="text-gray-500 text-center">{error.message}</Text>
          <TouchableOpacity
            onPress={loadDashboardData}
            className="bg-primary-500 rounded-full px-6 py-3 mt-6"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Admin Dashboard"
      showBackButton={false}
      scrollable={false}
      rightAction={<ProfileDropdown />}
    >
      <ScrollView
        className="flex-1 bg-gray-50"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#ff7a5e"]}
            tintColor="#ff7a5e"
          />
        }
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-gray-900 text-2xl font-bold mb-1">
            Welcome, Admin
          </Text>
          <Text className="text-gray-500">{`Here's what's happening with your platform`}</Text>
        </View>

        {/* Statistics Grid - Horizontal Scroll */}
        <View className="p-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            <View style={{ width: 160 }}>
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="people"
                color="#4894a8"
                bgColor="bg-secondary-50"
              />
            </View>
            <View style={{ width: 160 }}>
              <StatCard
                title="Campaigns"
                value={stats.totalCampaigns}
                icon="heart"
                color="#ff7a5e"
                bgColor="bg-primary-50"
              />
            </View>
            <View style={{ width: 160 }}>
              <StatCard
                title="Donations"
                value={stats.totalDonations}
                icon="gift"
                color="#10B981"
                bgColor="bg-green-50"
              />
            </View>
            <View style={{ width: 160 }}>
              <StatCard
                title="Amount Raised"
                value={formatCurrency(stats.totalAmountDonated)}
                icon="cash"
                color="#F59E0B"
                bgColor="bg-yellow-50"
              />
            </View>
          </ScrollView>
        </View>

        {/* Time Range Filter */}
        <View className="px-4 py-2">
          <Text className="text-gray-700 text-sm font-semibold mb-2">
            Time Range
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TimeRangeButton days={7} label="7 Days" />
            <TimeRangeButton days={30} label="30 Days" />
            <TimeRangeButton days={90} label="3 Months" />
          </ScrollView>
        </View>

        {/* Charts Section */}
        <View className="px-4 py-2">
          <Text className="text-gray-900 text-xl font-bold mb-4">
            Analytics Overview
          </Text>

          {chartsLoading ? (
            <View className="h-48 justify-center items-center">
              <ActivityIndicator size="large" color="#ff7a5e" />
              <Text className="text-gray-500 mt-2">Loading charts...</Text>
            </View>
          ) : chartData ? (
            <>
              <DonationTrendChart data={chartData.donationTrend} />
              <CampaignPerformanceChart data={chartData.campaignPerformance} />

              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <DonationStatusChart data={chartData.donationStatus} />
                </View>
              </View>

              <UserGrowthChart data={chartData.userGrowth} />
            </>
          ) : null}
        </View>

        {/* Quick Actions */}
        <View className="px-4 py-4">
          <Text className="text-gray-900 text-lg font-bold mb-3">
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/(admin)/users")}
              className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm border border-gray-100"
            >
              <View className="bg-secondary-100 p-3 rounded-full mb-2">
                <Ionicons name="people" size={24} color="#4894a8" />
              </View>
              <Text className="text-gray-900 font-semibold">Manage Users</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(admin)/campaigns")}
              className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm border border-gray-100"
            >
              <View className="bg-primary-100 p-3 rounded-full mb-2">
                <Ionicons name="heart" size={24} color="#ff7a5e" />
              </View>
              <Text className="text-gray-900 font-semibold">
                Manage Campaigns
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-4 py-4 pb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 text-lg font-bold">
              Recent Donations
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(admin)/donations")}
              className="flex-row items-center"
            >
              <Text className="text-primary-500 font-semibold text-sm mr-1">
                View All
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#ff7a5e" />
            </TouchableOpacity>
          </View>
          {recentDonations.length === 0 ? (
            <View className="bg-white border border-gray-200 rounded-xl p-8 items-center">
              <Text className="text-gray-400">No donations yet</Text>
            </View>
          ) : (
            <FlatList
              data={recentDonations}
              renderItem={renderDonation}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}
