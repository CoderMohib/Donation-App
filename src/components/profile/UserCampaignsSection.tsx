import { CampaignCard } from "@/src/components/cards";
import { Campaign } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface UserCampaignsSectionProps {
  campaigns: Campaign[];
  totalCampaigns: number;
  onCampaignPress: (campaignId: string) => void;
  onViewAllPress: () => void;
}

export default function UserCampaignsSection({
  campaigns,
  totalCampaigns,
  onCampaignPress,
  onViewAllPress,
}: UserCampaignsSectionProps) {
  if (campaigns.length === 0) {
    return null;
  }

  return (
    <View className="mb-1">
      <Text className="text-xl font-bold text-gray-900 mb-2">
        Your Campaigns
      </Text>
      {campaigns.map((campaign) => (
        <View key={campaign.id} className="mb-2">
          <CampaignCard
            campaign={campaign}
            onPress={() => onCampaignPress(campaign.id)}
          />
        </View>
      ))}
      {totalCampaigns > 3 && (
        <TouchableOpacity
          onPress={onViewAllPress}
          className="bg-secondary-100 rounded-xl p-4 flex-row items-center justify-center mt-2"
        >
          <Text className="text-secondary-600 font-semibold mr-2">
            View All {totalCampaigns} Campaigns
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#4894a8" />
        </TouchableOpacity>
      )}
    </View>
  );
}
