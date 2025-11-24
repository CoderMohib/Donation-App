import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { Toast } from "@/src/components/feedback";
import { CampaignForm } from "@/src/components/forms";
import { DashboardLayout } from "@/src/components/layouts";
import {
  createCampaign,
  updateUserCampaignStats,
} from "@/src/firebase/firestore";
import { useAuth, useToast } from "@/src/hooks";
import { Campaign } from "@/src/types";
import { asyncHandler } from "@/src/utils";

export default function CreateCampaignScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreateCampaign = async (data: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    targetAmount: number;
    category: Campaign["category"];
    imageUri?: string;
  }) => {
    if (!user) {
      showError("You must be logged in to create a campaign");
      return;
    }

    setLoading(true);

    let imageUrl: string | null = null;

    // Upload image to Cloudinary if provided
    if (data.imageUri) {
      const { uploadCampaignImage } = await import("@/src/firebase/storage");

      // Generate a temporary ID for the campaign folder
      const tempId = `temp_${Date.now()}`;

      const [uploadedUrl, uploadError] = await asyncHandler(
        uploadCampaignImage(tempId, data.imageUri)
      );

      if (uploadError) {
        setLoading(false);
        showError("Failed to upload image. Please try again.");
        return;
      }

      imageUrl = uploadedUrl;
    }

    const [campaignId, error] = await asyncHandler(
      createCampaign({
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        targetAmount: data.targetAmount,
        category: data.category,
        ownerId: user.id,
        ownerName: user.name,
        status: "draft",
        donatedAmount: 0,
        ...(imageUrl && { imageUrl }),
      })
    );

    if (error) {
      setLoading(false);
      showError(error.message || "Failed to create campaign");
      return;
    }

    // Update user stats
    await asyncHandler(updateUserCampaignStats(user.id, 1));

    setLoading(false);

    showSuccess("Campaign created successfully as draft!");

    // Navigate after a short delay to let user see the toast
    setTimeout(() => {
      router.push("/(tabs)/my-campaigns");
    }, 1500);
  };

  return (
    <DashboardLayout
      title="Create Campaign"
      showBackButton={false}
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
        mode="create"
        loading={loading}
        onSubmit={handleCreateCampaign}
      />
    </DashboardLayout>
  );
}
