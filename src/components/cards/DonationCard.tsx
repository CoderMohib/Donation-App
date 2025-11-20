import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { Donation } from '../../types';
import { formatCurrency, formatRelativeTime } from '../../utils';

interface DonationCardProps {
  donation: Donation;
  showCampaign?: boolean;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  showCampaign = false,
}) => {
  return (
    <View className="bg-white rounded-xl shadow-md p-4 mb-3 border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        {/* Donor Info */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <View className="bg-purple-100 w-10 h-10 rounded-full items-center justify-center mr-3">
              <Ionicons name="person" size={20} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                {donation.isAnonymous ? 'Anonymous' : donation.donorName || 'Unknown'}
              </Text>
              <Text className="text-xs text-gray-500">
                {formatRelativeTime(donation.donatedAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Amount */}
        <View className="bg-green-50 px-3 py-2 rounded-lg">
          <Text className="text-lg font-bold text-green-600">
            {formatCurrency(donation.amount)}
          </Text>
        </View>
      </View>

      {/* Campaign Title (if showing) */}
      {showCampaign && donation.campaignTitle && (
        <View className="bg-purple-50 px-3 py-2 rounded-lg mb-2">
          <Text className="text-xs text-purple-600 font-medium">
            For: {donation.campaignTitle}
          </Text>
        </View>
      )}

      {/* Message */}
      {donation.message && (
        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-sm text-gray-600 italic">
            "{donation.message}"
          </Text>
        </View>
      )}

      {/* Status Badge */}
      <View className="flex-row items-center mt-2">
        <View
          className={`px-2 py-1 rounded-full ${
            donation.status === 'completed'
              ? 'bg-green-100'
              : donation.status === 'pending'
              ? 'bg-yellow-100'
              : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              donation.status === 'completed'
                ? 'text-green-700'
                : donation.status === 'pending'
                ? 'text-yellow-700'
                : 'text-red-700'
            }`}
          >
            {donation.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};
