import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInputProps, TouchableOpacity, View } from 'react-native';
import { TextInput } from './TextInput';

interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  errorMessage?: string;
  containerClassName?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  errorMessage,
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="relative">
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        errorMessage={errorMessage}
        secureTextEntry={!showPassword}
        icon="lock-closed-outline"
        {...props}
      />
      <TouchableOpacity
        onPress={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-[42px]"
        activeOpacity={0.7}
      >
        <Ionicons
          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
          size={22}
          color="#9CA3AF"
        />
      </TouchableOpacity>
    </View>
  );
};
