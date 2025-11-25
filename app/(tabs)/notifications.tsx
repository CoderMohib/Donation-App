import { DashboardLayout } from "@/src/components/layouts";
import { useAuth } from "@/src/hooks/useAuth";
import { useUserNotifications } from "@/src/hooks/useUserNotifications";
import { AppNotification } from "@/src/types/Notification";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useUserNotifications(user?.id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // The real-time listener will automatically update
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleNotificationPress = async (notification: AppNotification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.data.campaignId) {
      router.push(`/campaign/${notification.data.campaignId}`);
    } else if (notification.data.donationId) {
      router.push("/(tabs)/my-donations");
    }
  };

  const handleDelete = (notificationId: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteNotification(notificationId),
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return;

    Alert.alert(
      "Mark All as Read",
      `Mark all ${unreadCount} notifications as read?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark All",
          onPress: () => markAllAsRead(),
        },
      ]
    );
  };

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "donation":
        return { name: "heart" as const, color: "#10b981" };
      case "milestone":
        return { name: "trophy" as const, color: "#f59e0b" };
      case "campaign_update":
        return { name: "megaphone" as const, color: "#3b82f6" };
      case "admin_action":
        return { name: "shield-checkmark" as const, color: "#8b5cf6" };
      default:
        return { name: "notifications" as const, color: "#6b7280" };
    }
  };

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const renderNotification = ({ item }: { item: AppNotification }) => {
    const icon = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item)}
        className={`flex-row p-4 border-b border-gray-100 ${
          !item.read ? "bg-blue-50" : "bg-white"
        }`}
        activeOpacity={0.7}
      >
        {/* Icon */}
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${icon.color}20` }}
        >
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text
            className={`text-base ${!item.read ? "font-semibold" : "font-medium"} text-gray-900`}
          >
            {item.title}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">{item.body}</Text>
          <Text className="text-xs text-gray-400 mt-2">
            {getRelativeTime(item.createdAt)}
          </Text>
        </View>

        {/* Unread indicator & Delete button */}
        <View className="items-center justify-between ml-2">
          {!item.read && (
            <View className="w-2 h-2 rounded-full bg-blue-500 mb-2" />
          )}
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            className="p-2"
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons name="notifications-outline" size={48} color="#9ca3af" />
      </View>
      <Text className="text-xl font-semibold text-gray-900 mb-2">
        No Notifications
      </Text>
      <Text className="text-gray-500 text-center">
        You're all caught up! We'll notify you when there's something new.
      </Text>
    </View>
  );

  if (!user) {
    return (
      <DashboardLayout title="Notifications">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg text-gray-600">
            Please log in to view notifications
          </Text>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Notifications"
      scrollable={false}
      rightAction={
        unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllAsRead} className="px-3 py-2">
            <Text className="text-primary-600 font-medium">Mark All Read</Text>
          </TouchableOpacity>
        ) : undefined
      }
    >
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#10b981"]}
              tintColor="#10b981"
            />
          }
          contentContainerStyle={
            notifications.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
          }
        />
      )}
    </DashboardLayout>
  );
}
