import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  scrollable?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  onBackPress,
  leftAction,
  rightAction,
  scrollable = true,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100" edges={['top']}>
      {/* Header */}
      {title && (
        <View className="bg-white px-4 py-4 shadow-sm border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            {/* Left Side - Custom Action, Back Button, or Spacer */}
            <View className="w-10">
              {leftAction ? (
                leftAction
              ) : showBackButton && onBackPress ? (
                <TouchableOpacity
                  onPress={onBackPress}
                  className="w-10 h-10 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Center - Title */}
            <Text className="text-xl font-bold text-gray-900 flex-1 text-center">
              {title}
            </Text>

            {/* Right Side - Action or Spacer */}
            <View className="w-10">{rightAction}</View>
          </View>
        </View>
      )}

      {/* Content */}
      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </SafeAreaView>
  );
};
