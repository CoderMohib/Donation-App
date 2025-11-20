import { PrimaryButton } from '@/src/components/buttons';
import { Toast } from '@/src/components/feedback';
import { PasswordInput, TextInput } from '@/src/components/inputs';
import { AuthLayout } from '@/src/components/layouts';
import { signUp } from '@/src/firebase';
import { useToast } from '@/src/hooks';
import {
    asyncHandler,
    validateEmail,
    validateName,
    validatePassword,
    validateRequired,
} from '@/src/utils';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const { toast, showError, showSuccess, hideToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Name validation
    const nameValidation = validateRequired(name, 'Name');
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    } else if (!validateName(name)) {
      newErrors.name = 'Please enter a valid name (letters only)';
    }

    // Email validation
    const emailValidation = validateRequired(email, 'Email');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const [_user, error] = await asyncHandler(signUp(email, password, name));
    setLoading(false);

    if (error) {
      showError(error.message);
      return;
    }

    showSuccess('Your account has been created successfully!');
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <AuthLayout>
      {/* Title - Centered */}
      <View className="mb-6 items-center">
        <Text className="text-4xl font-bold text-white mb-2 text-center">
          Create Account
        </Text>
        <Text className="text-gray-300 text-base text-center">
          Join us in making a difference
        </Text>
      </View>

      {/* Form */}
      <View className="mb-6">
        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors({ ...errors, name: undefined });
          }}
          errorMessage={errors.name}
          autoCapitalize="words"
          autoComplete="name"
          icon="person-outline"
        />

        <TextInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors({ ...errors, email: undefined });
          }}
          errorMessage={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          icon="mail-outline"
        />

        <PasswordInput
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: undefined });
          }}
          errorMessage={errors.password}
          autoComplete="password-new"
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors({ ...errors, confirmPassword: undefined });
          }}
          errorMessage={errors.confirmPassword}
          autoComplete="password-new"
        />
      </View>

      {/* Sign Up Button */}
      <PrimaryButton
        title="Create Account"
        onPress={handleSignup}
        loading={loading}
        variant="primary"
      />

      {/* Divider */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-white/20" />
        <Text className="mx-4 text-gray-400">or</Text>
        <View className="flex-1 h-px bg-white/20" />
      </View>

      {/* Login Link */}
      <View className="flex-row justify-center items-center">
        <Text className="text-gray-300">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text className="text-secondary-400 font-bold">Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </AuthLayout>
  );
}
