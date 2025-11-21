import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { Toast } from "@/src/components/feedback";
import { CampaignForm } from "@/src/components/forms";
import { DashboardLayout } from "@/src/components/layouts";
import { updateCampaign } from "@/src/firebase/firestore";
import { useAuth, useCampaign, useToast } from "@/src/hooks";
import { Campaign } from "@/src/types";
import { asyncHandler } from "@/src/utils";

export default function EditCampaignScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { campaign, loading: campaignLoading } = useCampaign(id);
  const [loading, setLoading] = useState(false);

  const handleUpdateCampaign = async (data: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    targetAmount: number;
    category: Campaign["category"];
  }) => {
    if (!user || !campaign) {
      showError("Unable to update campaign");
      return;
    }

    // Check if user owns this campaign or is admin
    if (campaign.ownerId !== user.id && user.role !== "admin") {
      showError("You can only edit your own campaigns");
      return;
    }

    setLoading(true);

    const [, error] = await asyncHandler(
      updateCampaign(id, {
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        category: data.category,
        // Note: targetAmount is not updated as per business logic
      })
    );

    setLoading(false);

    if (error) {
      showError(error.message || "Failed to update campaign");
      return;
    }

    showSuccess("Campaign updated successfully!");

    // Navigate back after a short delay
    setTimeout(() => {
      router.back();
    }, 1500);
  };

  // Show loading while campaign or user is loading
  if (campaignLoading || !user) {
    return (
      <DashboardLayout title="Edit Campaign" showBackButton scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ff7a5e" />
          <Text className="text-gray-600 mt-4">Loading campaign...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout title="Edit Campaign" showBackButton scrollable={false}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle" size={64} color="#ff7a5e" />
          <Text className="text-gray-900 text-xl font-bold mt-4 text-center">
            Campaign Not Found
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            The campaign you're trying to edit doesn't exist or has been
            deleted.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary-500 rounded-full px-6 py-3 mt-6"
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  // Check if user owns this campaign or is admin
  if (campaign.ownerId !== user.id && user.role !== "admin") {
    return (
      <DashboardLayout title="Edit Campaign" showBackButton scrollable={false}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="lock-closed" size={64} color="#ff7a5e" />
          <Text className="text-gray-900 text-xl font-bold mt-4 text-center">
            Access Denied
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            You can only edit campaigns that you created.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary-500 rounded-full px-6 py-3 mt-6"
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Edit Campaign"
      showBackButton
      scrollable={false}
      leftAction={
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#ff7a5e" />
        </TouchableOpacity>
      }
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <CampaignForm
        mode="edit"
        initialData={campaign}
        loading={loading}
        onSubmit={handleUpdateCampaign}
      />
    </DashboardLayout>
  );
}
