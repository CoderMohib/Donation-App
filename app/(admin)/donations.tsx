import { DashboardLayout } from "@/src/components/layouts";
import { db } from "@/src/firebase/firebase";
import { useAuth } from "@/src/hooks";
import { Donation } from "@/src/types";
import { formatCurrency } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DONATIONS_PER_PAGE = 10;

export default function AdminDonationsScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/(tabs)");
      return;
    }

    loadDonations();
  }, [user, authLoading]);

  const loadDonations = async (loadMore = false) => {
    if (!db) return;

    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let donationsQuery;

      if (loadMore && lastDoc) {
        // Load more donations starting after the last document
        donationsQuery = query(
          collection(db, "donations"),
          orderBy("donatedAt", "desc"),
          startAfter(lastDoc),
          limit(DONATIONS_PER_PAGE + 1) // Fetch one extra to check if there are more
        );
      } else {
        // Initial load
        donationsQuery = query(
          collection(db, "donations"),
          orderBy("donatedAt", "desc"),
          limit(DONATIONS_PER_PAGE + 1) // Fetch one extra to check if there are more
        );
      }

      const donationsSnapshot = await getDocs(donationsQuery);

      // Check if we got more than requested (means there are more to load)
      const hasMoreResults = donationsSnapshot.docs.length > DONATIONS_PER_PAGE;

      // Only take the requested amount
      const docsToShow = hasMoreResults
        ? donationsSnapshot.docs.slice(0, DONATIONS_PER_PAGE)
        : donationsSnapshot.docs;

      const newDonations = docsToShow.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Donation[];

      if (loadMore) {
        setDonations((prev) => [...prev, ...newDonations]);
      } else {
        setDonations(newDonations);
      }

      // Update last document for pagination
      if (docsToShow.length > 0) {
        setLastDoc(docsToShow[docsToShow.length - 1]);
      }

      // Set hasMore based on whether we got extra results
      setHasMore(hasMoreResults);

      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setLastDoc(null);
    setHasMore(true);
    loadDonations();
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadDonations(true);
    }
  };

  const renderDonation = ({ item }: { item: Donation }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-3">
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
        <Text className="text-gray-600 text-sm italic mb-2" numberOfLines={2}>
          "{item.message}"
        </Text>
      )}
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-400 text-xs">
          {new Date(item.donatedAt).toLocaleDateString()} at{" "}
          {new Date(item.donatedAt).toLocaleTimeString()}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            item.status === "completed"
              ? "bg-green-100"
              : item.status === "pending"
                ? "bg-yellow-100"
                : "bg-red-100"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              item.status === "completed"
                ? "text-green-700"
                : item.status === "pending"
                  ? "text-yellow-700"
                  : "text-red-700"
            }`}
          >
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#ff7a5e" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="gift-outline" size={64} color="#D1D5DB" />
      <Text className="text-gray-500 text-lg font-semibold mt-4">
        No Donations Yet
      </Text>
      <Text className="text-gray-400 text-center mt-2 px-8">
        Donations will appear here once users start contributing to campaigns
      </Text>
    </View>
  );

  if (loading) {
    return (
      <DashboardLayout title="All Donations" showBackButton>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ff7a5e" />
          <Text className="text-gray-500 mt-4">Loading donations...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="All Donations" showBackButton>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-gray-900 text-xl font-bold mb-2">
            Error Loading Donations
          </Text>
          <Text className="text-gray-500 text-center">{error.message}</Text>
          <TouchableOpacity
            onPress={() => loadDonations()}
            className="bg-primary-500 rounded-full px-6 py-3 mt-6"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="All Donations" showBackButton scrollable={false}>
      <View className="flex-1 bg-gray-50">
        {/* Header Stats */}
        <View className="bg-white border-b border-gray-200 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-gray-500 text-sm">Total Donations</Text>
              <Text className="text-gray-900 text-2xl font-bold">
                {donations.length}
                {hasMore && "+"}
              </Text>
            </View>
            
          </View>
        </View>

        {/* Donations List */}
        <FlatList
          data={donations}
          renderItem={renderDonation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#ff7a5e"]}
              tintColor="#ff7a5e"
            />
          }
        />
      </View>
    </DashboardLayout>
  );
}
