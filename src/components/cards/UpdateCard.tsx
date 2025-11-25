import { CampaignUpdate } from "@/src/types";
import { Text, View } from "react-native";

interface UpdateCardProps {
  update: CampaignUpdate;
}

export default function UpdateCard({ update }: UpdateCardProps) {
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-md">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-900 flex-1 mr-2">
          {update.title}
        </Text>
        <Text className="text-sm text-gray-500">
          {formatTimeAgo(update.createdAt)}
        </Text>
      </View>
      <Text className="text-base text-gray-700 mt-2">{update.message}</Text>
    </View>
  );
}
