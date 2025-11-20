import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-100)).current;

  const hideToast = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, [onHide, opacity, translateY]);

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, hideToast, opacity, translateY]);

  if (!visible) return null;

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle' as const,
          iconColor: '#4ade80',
          borderColor: 'border-green-400',
          bgColor: 'bg-green-500/20',
        };
      case 'error':
        return {
          icon: 'close-circle' as const,
          iconColor: '#ff7a5e',
          borderColor: 'border-primary-400',
          bgColor: 'bg-primary-500/20',
        };
      case 'warning':
        return {
          icon: 'warning' as const,
          iconColor: '#fbbf24',
          borderColor: 'border-yellow-400',
          bgColor: 'bg-yellow-500/20',
        };
      case 'info':
      default:
        return {
          icon: 'information-circle' as const,
          iconColor: '#4894a8',
          borderColor: 'border-secondary-400',
          bgColor: 'bg-secondary-500/20',
        };
    }
  };

  const config = getToastConfig();

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className="absolute top-12 left-4 right-4 z-50"
    >
      <View className={`bg-gray-800 ${config.borderColor} border-2 rounded-2xl p-4 flex-row items-center shadow-2xl`}>
        <Ionicons name={config.icon} size={24} color={config.iconColor} />
        <Text className="text-white text-base font-semibold ml-3 flex-1">
          {message}
        </Text>
        <TouchableOpacity onPress={hideToast} className="ml-2">
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
