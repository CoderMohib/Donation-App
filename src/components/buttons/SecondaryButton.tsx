import React from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';

interface SecondaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'outline',
  size = 'large',
  ...props
}) => {
  const sizeStyles = {
    small: 'py-2 px-4',
    medium: 'py-3 px-6',
    large: 'py-4 px-8',
  };

  const textSizeStyles = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const isDisabled = disabled || loading;

  const containerClass =
    variant === 'outline'
      ? `border-2 ${isDisabled ? 'border-gray-300' : 'border-purple-600'}`
      : '';

  const textClass = isDisabled
    ? 'text-gray-400'
    : variant === 'outline'
    ? 'text-purple-600'
    : 'text-purple-600';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        rounded-full ${sizeStyles[size]}
        ${containerClass}
        flex-row items-center justify-center
      `}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#7C3AED" size="small" />
      ) : (
        <Text
          className={`
            ${textClass} font-semibold ${textSizeStyles[size]}
            text-center
          `}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
