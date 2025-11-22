import { PrimaryButton } from "@/src/components/buttons";
import { DonationCard } from "@/src/components/cards";
import { DashboardLayout } from "@/src/components/layouts";
import { subscribeToCampaign, subscribeToDonations } from "@/src/firebase";
import { Campaign, Donation } from "@/src/types";
import {
  calculateDaysRemaining,
  calculateProgress,
  formatCurrency,
  formatDate,
} from "@/src/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function CampaignScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Subscribe to real-time campaign updates
    const unsubscribeCampaign = subscribeToCampaign(id, (campaignData) => {
      setCampaign(campaignData);
      setLoading(false);
    });

    // Subscribe to real-time donations updates
    const unsubscribeDonations = subscribeToDonations(
      id,
      (donationsData) => {
        setDonations(donationsData);
      },
      5
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeCampaign();
      unsubscribeDonations();
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Campaign Details">
        <View className="items-center justify-center py-20">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout title="Campaign Details">
        <View className="items-center justify-center py-20">
          <Text className="text-gray-500">Campaign not found</Text>
        </View>
      </DashboardLayout>
    );
  }

  const progress = calculateProgress(
    campaign.donatedAmount,
    campaign.targetAmount
  );
  const daysRemaining = campaign.endDate
    ? calculateDaysRemaining(campaign.endDate)
    : null;

  return (
    <DashboardLayout
      title="Campaign Details"
      showBackButton
      onBackPress={() => router.back()}
      scrollable={false}
    >
      <ScrollView className="flex-1">
        {/* Campaign Image */}
        <Image
          source={{
            uri: campaign.imageUrl || "https://via.placeholder.com/400x300",
          }}
          className="w-full h-64"
          resizeMode="cover"
        />

        {/* Campaign Info */}
        <View className="px-4 py-6">
          {/* Category Badge */}
          {campaign.category && (
            <View className="self-start bg-purple-100 px-3 py-1 rounded-full mb-3">
              <Text className="text-purple-700 font-semibold capitalize">
                {campaign.category}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-3">
            {campaign.title}
          </Text>

          {/* Description */}
          <Text className="text-gray-600 text-base leading-6 mb-6">
            {campaign.fullDescription}
          </Text>

          {/* Progress Section */}
          <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
            <View className="flex-row justify-between mb-3">
              <View>
                <Text className="text-3xl font-bold text-green-600">
                  {formatCurrency(campaign.donatedAmount)}
                </Text>
                <Text className="text-gray-500 text-sm">
                  raised of {formatCurrency(campaign.targetAmount)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-3xl font-bold text-purple-600">
                  {progress}%
                </Text>
                <Text className="text-gray-500 text-sm">funded</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="bg-gray-200 h-3 rounded-full overflow-hidden mb-3">
              <View
                className="bg-green-500 h-full rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>

            {/* Stats Row */}
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-900">
                  {donations.length}
                </Text>
                <Text className="text-gray-500 text-xs">Donors</Text>
              </View>
              {daysRemaining !== null && (
                <View className="items-center">
                  <Text className="text-lg font-bold text-gray-900">
                    {daysRemaining}
                  </Text>
                  <Text className="text-gray-500 text-xs">Days Left</Text>
                </View>
              )}
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-900">
                  {formatDate(campaign.createdAt)}
                </Text>
                <Text className="text-gray-500 text-xs">Started</Text>
              </View>
            </View>
          </View>

          {/* Donate Button */}
          <PrimaryButton
            title="Donate Now"
            onPress={() =>
              router.push({
                pathname: "/donate/[campaignId]",
                params: { campaignId: campaign.id },
              })
            }
            variant="success"
            size="large"
          />

          {/* Recent Donations */}
          {donations.length > 0 && (
            <View className="mt-8">
              <Text className="text-xl font-bold text-gray-900 mb-4">
                Recent Donations
              </Text>
              {donations.map((donation) => (
                <DonationCard key={donation.id} donation={donation} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}
