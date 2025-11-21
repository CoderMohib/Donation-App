import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Campaign } from '../../types';
import { calculateDaysRemaining, calculateProgress, formatCurrency } from '../../utils';

interface CampaignCardProps {
  campaign: Campaign;
  onPress?: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onPress,
}) => {
  const progress = calculateProgress(campaign.donatedAmount, campaign.targetAmount);
  const daysRemaining = campaign.endDate
    ? calculateDaysRemaining(campaign.endDate)
    : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden"
    >
      {/* Campaign Image */}
      <View className="relative">
        <Image
          source={{
            uri: campaign.imageUrl || 'https://via.placeholder.com/400x200',
          }}
          className="w-full h-48"
          resizeMode="cover"
        />
        {/* Category Badge */}
        {campaign.category && (
          <View className="absolute top-3 right-3 bg-purple-600 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold capitalize">
              {campaign.category}
            </Text>
          </View>
        )}
      </View>

      {/* Campaign Details */}
      <View className="p-4">
        {/* Title */}
        <Text className="text-xl font-bold text-gray-900 mb-2" numberOfLines={2}>
          {campaign.title}
        </Text>

        {/* Description */}
        <Text className="text-gray-600 text-sm mb-4" numberOfLines={2}>
          {campaign.shortDescription}
        </Text>

        {/* Progress Bar */}
        <View className="mb-3">
          <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <View
              className="bg-gradient-to-r from-green-500 to-teal-500 h-full rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-green-600">
              {formatCurrency(campaign.donatedAmount)}
            </Text>
            <Text className="text-gray-500 text-sm">
              raised of {formatCurrency(campaign.targetAmount)}
            </Text>
          </View>

          {daysRemaining !== null && (
            <View className="items-end">
              <Text className="text-2xl font-bold text-purple-600">
                {daysRemaining}
              </Text>
              <Text className="text-gray-500 text-sm">days left</Text>
            </View>
          )}
        </View>

        {/* Creator Info */}
        {campaign.ownerName && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="person-outline" size={14} color="#9ca3af" />
            <Text className="text-gray-400 text-xs ml-1">
              by {campaign.ownerName}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
