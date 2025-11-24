import { User } from "@/src/types";
import { formatCurrency } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProfileHeaderProps {
  user: User;
  onSettingsPress: () => void;
}

export default function ProfileHeader({
  user,
  onSettingsPress,
}: ProfileHeaderProps) {
  return (
    <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      {/* Settings Icon */}
      <TouchableOpacity
        onPress={onSettingsPress}
        className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full items-center justify-center z-10"
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={20} color="#6B7280" />
      </TouchableOpacity>

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

        {/* Bio */}
        {(user as any).bio && (
          <Text className="text-gray-600 text-center text-sm mb-4 px-4">
            {(user as any).bio}
          </Text>
        )}

        {/* Role Badge */}
        {user.role === "admin" && (
          <View className="bg-purple-100 px-4 py-1 rounded-full">
            <Text className="text-purple-700 font-semibold text-sm">Admin</Text>
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
        {/* Only show campaigns stat for non-admin users */}
        {user.role !== "admin" && (
          <>
            <View className="w-px h-12 bg-gray-200" />
            <View className="items-center">
              <Text className="text-2xl font-bold text-secondary-600">
                {user.totalCampaigns || 0}
              </Text>
              <Text className="text-gray-500 text-sm">Campaigns</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
