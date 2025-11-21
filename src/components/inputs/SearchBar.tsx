import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput as RNTextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  className = '',
}) => {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View className={` flex-row items-center bg-gray-200 border border-white/20 rounded-full px-4 py-0.5 ${className}`}>
      <Ionicons name="search-outline" size={20} color="#9ca3af" className="mr-3" />
      
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="flex-1 text-white text-base"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} className="ml-2">
          <Ionicons name="close-circle" size={20} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
};
