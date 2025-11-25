import { db } from "@/src/firebase/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const NotificationBell: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Don't set up listener if user is not logged in or db is not ready
    if (!user || !db) {
      setUnreadCount(0);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setUnreadCount(snapshot.size);
      },
      (error) => {
        // Handle permission errors silently
        console.log("Notification listener error:", error.message);
        setUnreadCount(0);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Don't show bell if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => router.push("/notifications")}
      className="relative p-2"
    >
      <Ionicons name="notifications-outline" size={24} color="#374151" />
      {unreadCount > 0 && (
        <View className="absolute top-0 right-0 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
          <Text className="text-white text-xs font-bold px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
