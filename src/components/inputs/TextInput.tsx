import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    TextInput as RNTextInput,
    Text,
    TextInputProps,
    View,
} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
  containerClassName?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  value,
  onChangeText,
  errorMessage,
  containerClassName = '',
  icon,
  placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`mb-3 ${containerClassName}`}>
      {/* Static Label */}
      <Text className="text-gray-300 font-semibold mb-2 ml-1">
        {label}
      </Text>
      
      <View className="relative">
        {icon && (
          <View className="absolute left-4 h-full justify-center z-10" style={{ top: 0, bottom: 0 }}>
            <Ionicons
              name={icon}
              size={20}
              color={isFocused ? '#4894a8' : errorMessage ? '#ff7a5e' : '#9CA3AF'}
            />
          </View>
        )}
        
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            bg-white/5 rounded-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-4 text-base text-white
            border-2 ${
              errorMessage
                ? 'border-primary-500'
                : isFocused
                ? 'border-secondary-500'
                : 'border-white/10'
            }
          `}
          style={{ textAlignVertical: 'center' }}
          placeholderTextColor="#6B7280"
          {...props}
        />
      </View>
      
      {errorMessage && (
        <Text className="text-primary-400 text-sm mt-1.5 ml-1">{errorMessage}</Text>
      )}
    </View>
  );
};
