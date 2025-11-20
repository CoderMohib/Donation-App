import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'success' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'large',
  ...props
}) => {
  const variantColors: Record<string, readonly [string, string]> = {
    primary: ['#4894a8', '#ffb2a2'] as const, // Teal to peachy pink from logo
    success: ['#10B981', '#14B8A6'] as const,
    danger: ['#ff7a5e', '#f55d3d'] as const,
  };

  const sizeClasses = {
    small: 'py-2.5 px-5',
    medium: 'py-3.5 px-7',
    large: 'py-4 px-8',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const isDisabled = disabled || loading;

  if (isDisabled) {
    return (
      <TouchableOpacity
        disabled={true}
        className={`rounded-full bg-gray-700 ${sizeClasses[size]} items-center justify-center`}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color="#9CA3AF" size="small" />
        ) : (
          <Text className={`text-gray-400 font-bold ${textSizeClasses[size]} text-center`}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="rounded-full overflow-hidden shadow-2xl"
      style={{
        shadowColor: variantColors[variant][0],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 12,
      }}
      {...props}
    >
      <LinearGradient
        colors={variantColors[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`${sizeClasses[size]} items-center justify-center`}
      >
        <Text className={`text-white font-bold ${textSizeClasses[size]} text-center`}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};
