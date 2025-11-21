import React from "react";
import { View } from "react-native";

export const CampaignCardSkeleton: React.FC = () => {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      {/* Image Skeleton */}
      <View className="w-full h-48 bg-gray-200 rounded-xl mb-3 animate-pulse" />

      {/* Title Skeleton */}
      <View className="h-6 bg-gray-200 rounded-md mb-2 w-3/4 animate-pulse" />

      {/* Description Skeleton */}
      <View className="h-4 bg-gray-200 rounded-md mb-1 w-full animate-pulse" />
      <View className="h-4 bg-gray-200 rounded-md mb-3 w-5/6 animate-pulse" />

      {/* Progress Bar Skeleton */}
      <View className="h-2 bg-gray-200 rounded-full mb-2 animate-pulse" />

      {/* Stats Row Skeleton */}
      <View className="flex-row justify-between items-center mt-2">
        <View className="h-5 bg-gray-200 rounded-md w-24 animate-pulse" />
        <View className="h-5 bg-gray-200 rounded-md w-20 animate-pulse" />
      </View>
    </View>
  );
};

export const CampaignListSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CampaignCardSkeleton key={index} />
      ))}
    </>
  );
};
