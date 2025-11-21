import React from 'react';
import { Text, View } from 'react-native';

type CampaignStatus = 'draft' | 'in_progress' | 'completed' | 'ended';

interface StatusBadgeProps {
  status: CampaignStatus;
  size?: 'small' | 'medium' | 'large';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return {
          label: 'Draft',
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/30',
        };
      case 'in_progress':
        return {
          label: 'In Progress',
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/30',
        };
      case 'completed':
        return {
          label: 'Completed',
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/30',
        };
      case 'ended':
        return {
          label: 'Ended',
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
        };
      default:
        return {
          label: status,
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/30',
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-1';
      case 'large':
        return 'px-4 py-2';
      case 'medium':
      default:
        return 'px-3 py-1.5';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-base';
      case 'medium':
      default:
        return 'text-sm';
    }
  };

  const config = getStatusConfig();

  return (
    <View
      className={`${config.bgColor} ${config.borderColor} border rounded-full ${getSizeClasses()} self-start`}
    >
      <Text className={`${config.textColor} ${getTextSize()} font-semibold`}>
        {config.label}
      </Text>
    </View>
  );
};
