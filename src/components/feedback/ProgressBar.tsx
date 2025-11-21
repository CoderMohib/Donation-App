import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  height?: number;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'primary',
  height = 8,
  showPercentage = false,
}) => {
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withSpring(Math.min(progress, 100), {
      damping: 15,
      stiffness: 100,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });

  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      case 'primary':
      default:
        return 'bg-secondary-500';
    }
  };

  return (
    <View className="w-full">
      <View
        className="w-full bg-gray-700/30 rounded-full overflow-hidden"
        style={{ height }}
      >
        <Animated.View
          className={`h-full rounded-full ${getBackgroundColor()}`}
          style={animatedStyle}
        />
      </View>
    </View>
  );
};
