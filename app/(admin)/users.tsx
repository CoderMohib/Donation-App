import { SearchBar } from "@/src/components/inputs";
import { DashboardLayout } from "@/src/components/layouts";
import { deleteUser, promoteToAdmin } from "@/src/firebase/auth";
import { db } from "@/src/firebase/firebase";
import { useAuth } from "@/src/hooks";
import { User } from "@/src/types";
import { asyncHandler } from "@/src/utils";
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
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const USERS_PER_PAGE = 10;

export default function AdminUsersScreen() {
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      router.replace("/(tabs)");
      return;
    }

    loadUsers();
  }, [currentUser, authLoading]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  // Early returns after all hooks
  if (authLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#ff7a5e" />
      </View>
    );
  }

  if (!currentUser || currentUser.role !== "admin") return null;

  const loadUsers = async (loadMore = false) => {
    if (!db) return;

    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let usersQuery;

      if (loadMore && lastDoc) {
        usersQuery = query(
          collection(db, "users"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(USERS_PER_PAGE + 1)
        );
      } else {
        usersQuery = query(
          collection(db, "users"),
          orderBy("createdAt", "desc"),
          limit(USERS_PER_PAGE + 1)
        );
      }

      const usersSnapshot = await getDocs(usersQuery);

      // Check if we got more than requested
      const hasMoreResults = usersSnapshot.docs.length > USERS_PER_PAGE;

      // Only take the requested amount
      const docsToShow = hasMoreResults
        ? usersSnapshot.docs.slice(0, USERS_PER_PAGE)
        : usersSnapshot.docs;

      const usersData = docsToShow.map((doc) => doc.data() as User);

      if (loadMore) {
        setUsers((prev) => [...prev, ...usersData]);
        setFilteredUsers((prev) => [...prev, ...usersData]);
      } else {
        setUsers(usersData);
        setFilteredUsers(usersData);
      }

      // Update last document for pagination
      if (docsToShow.length > 0) {
        setLastDoc(docsToShow[docsToShow.length - 1]);
      }

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
    loadUsers();
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !searchQuery) {
      loadUsers(true);
    }
  };

  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    Alert.alert(
      "Promote to Admin",
      `Are you sure you want to promote ${userName} to admin? They will have full access to the admin panel.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Promote",
          style: "default",
          onPress: async () => {
            const [, error] = await asyncHandler(promoteToAdmin(userId));
            if (error) {
              Alert.alert("Error", error.message);
            } else {
              Alert.alert("Success", `${userName} has been promoted to admin.`);
              loadUsers(); // Reload users
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      Alert.alert("Error", "You cannot delete your own account.");
      return;
    }

    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${userName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const [, error] = await asyncHandler(deleteUser(userId));
            if (error) {
              Alert.alert("Error", error.message);
            } else {
              Alert.alert("Success", `${userName} has been deleted.`);
              loadUsers(); // Reload users
            }
          },
        },
      ]
    );
  };

  const renderUser = ({ item }: { item: User }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
      {/* User Info */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-gray-900 font-bold text-lg">{item.name}</Text>
            {item.role === "admin" && (
              <View className="bg-purple-100 rounded-full px-2 py-1">
                <Text className="text-purple-700 text-xs font-semibold">
                  ADMIN
                </Text>
              </View>
            )}
          </View>
          <Text className="text-gray-500 text-sm">{item.email}</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row gap-4 mb-3 pb-3 border-b border-gray-100">
        <View>
          <Text className="text-gray-500 text-xs">Total Donated</Text>
          <Text className="text-gray-900 font-semibold">
            ${item.totalDonated?.toFixed(2) || "0.00"}
          </Text>
        </View>
        <View>
          <Text className="text-gray-500 text-xs">Campaigns</Text>
          <Text className="text-gray-900 font-semibold">
            {item.totalCampaigns || 0}
          </Text>
        </View>
        <View>
          <Text className="text-gray-500 text-xs">Joined</Text>
          <Text className="text-gray-900 font-semibold">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-2">
        {item.role !== "admin" && (
          <TouchableOpacity
            onPress={() => handlePromoteToAdmin(item.id, item.name)}
            className="flex-1 bg-secondary-500 rounded-lg py-2 px-3 flex-row items-center justify-center"
          >
            <Ionicons name="arrow-up" size={16} color="white" />
            <Text className="text-white font-semibold ml-2">Promote</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => handleDeleteUser(item.id, item.name)}
          className="bg-primary-600 rounded-lg py-2 px-3 flex-row items-center justify-center"
          disabled={item.id === currentUser?.id}
        >
          <Ionicons name="trash" size={16} color="white" />
          <Text className="text-white font-semibold ml-2">Delete</Text>
        </TouchableOpacity>
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

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">👥</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2">
        No Users Found
      </Text>
      <Text className="text-gray-500 text-center px-8">
        {searchQuery
          ? "Try a different search term"
          : "No users in the system yet"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <DashboardLayout title="Manage Users" showBackButton={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ff7a5e" />
          <Text className="text-gray-500 mt-4">Loading users...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Manage Users" showBackButton={false}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-gray-900 text-xl font-bold mb-2">
            Error Loading Users
          </Text>
          <Text className="text-gray-500 text-center">{error.message}</Text>
          <TouchableOpacity
            onPress={() => loadUsers()}
            className="bg-secondary-500 rounded-full px-6 py-3 mt-6"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Manage Users"
      showBackButton={false}
      scrollable={false}
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-gray-900 text-2xl font-bold mb-1">
            User Management
          </Text>
          <Text className="text-gray-500">{users.length} total users</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-4">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name or email..."
          />
        </View>

        {/* Users List */}
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 20,
          }}
          ListEmptyComponent={renderEmptyState()}
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
          showsVerticalScrollIndicator={false}
        />
      </View>
    </DashboardLayout>
  );
}
