import { DashboardLayout } from "@/src/components/layouts";
import { db } from "@/src/firebase/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { AppNotification } from "@/src/types/Notification";
import { formatRelativeTime } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AppNotification[];
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    if (!db) return;
    await updateDoc(doc(db, "notifications", notificationId), {
      read: true,
    });
  };

  const handleNotificationPress = (notification: AppNotification) => {
    markAsRead(notification.id);

    if (notification.data.campaignId) {
      router.push(`/campaign/${notification.data.campaignId}`);
    } else if (notification.data.donationId) {
      router.push("/my-donations");
    }
  };

  const renderNotification = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      className={`p-4 border-b border-gray-200 ${!item.read ? "bg-green-50" : "bg-white"}`}
    >
      <View className="flex-row items-start">
        <View className="mr-3">
          <Ionicons
            name={item.type === "donation" ? "heart" : "notifications"}
            size={24}
            color={!item.read ? "#10b981" : "#9ca3af"}
          />
        </View>
        <View className="flex-1">
          <Text
            className={`font-semibold ${!item.read ? "text-gray-900" : "text-gray-600"}`}
          >
            {item.title}
          </Text>
          <Text className="text-gray-600 text-sm mt-1">{item.body}</Text>
          <Text className="text-gray-400 text-xs mt-2">
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>
        {!item.read && (
          <View className="w-2 h-2 bg-green-500 rounded-full ml-2" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <DashboardLayout title="Notifications" showBackButton>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color="#d1d5db"
          />
          <Text className="text-gray-900 text-xl font-bold mt-4">
            No Notifications
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            You'll see notifications here when you receive donations or campaign
            updates
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
        />
      )}
    </DashboardLayout>
  );
}
