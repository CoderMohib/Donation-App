import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface QuickActionsProps {
  userRole: "user" | "admin";
  onActionPress: (action: string) => void;
}

export default function QuickActions({
  userRole,
  onActionPress,
}: QuickActionsProps) {
  const userActions = [
    {
      id: "my-campaigns",
      icon: "heart" as const,
      iconColor: "#ff7a5e",
      bgColor: "bg-primary-100",
      title: "My Campaigns",
      description: "Manage your campaigns",
    },
    {
      id: "my-donations",
      icon: "list" as const,
      iconColor: "#4894a8",
      bgColor: "bg-secondary-100",
      title: "My Donations",
      description: "View donation history",
    },
  ];

  const adminActions = [
    {
      id: "admin-dashboard",
      icon: "grid" as const,
      iconColor: "#8B5CF6",
      bgColor: "bg-purple-100",
      title: "Admin Dashboard",
      description: "View analytics & stats",
    },
    {
      id: "manage-campaigns",
      icon: "heart" as const,
      iconColor: "#ff7a5e",
      bgColor: "bg-primary-100",
      title: "Manage Campaigns",
      description: "Review all campaigns",
    },
    {
      id: "view-donations",
      icon: "cash" as const,
      iconColor: "#10B981",
      bgColor: "bg-green-100",
      title: "View Donations",
      description: "Track all donations",
    },
  ];

  const actions = userRole === "admin" ? adminActions : userActions;

  return (
    <View className="mb-4">
      <Text className="text-xl font-bold text-gray-900 mb-3">
        Quick Actions
      </Text>
      <View className="gap-3">
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => onActionPress(action.id)}
            className="bg-white rounded-2xl p-4 shadow-lg flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View
                className={`${action.bgColor} w-12 h-12 rounded-full items-center justify-center mr-4`}
              >
                <Ionicons
                  name={action.icon}
                  size={24}
                  color={action.iconColor}
                />
              </View>
              <View>
                <Text className="text-gray-900 font-bold text-base">
                  {action.title}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {action.description}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
