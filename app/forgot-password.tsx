import { PrimaryButton } from '@/src/components/buttons';
import { Toast } from '@/src/components/feedback';
import { TextInput } from '@/src/components/inputs';
import { AuthLayout } from '@/src/components/layouts';
import { resetPassword } from '@/src/firebase';
import { useToast } from '@/src/hooks';
import { asyncHandler, validateEmail, validateRequired } from '@/src/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = (): boolean => {
    const emailValidation = validateRequired(email, 'Email');
    if (!emailValidation.isValid) {
      setError(emailValidation.message || 'Email is required');
      return false;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const [_, resetError] = await asyncHandler(resetPassword(email));
    setLoading(false);

    if (resetError) {
      showError(resetError.message);
      return;
    }

    setEmailSent(true);
    showSuccess('Password reset email sent! Please check your inbox.');
  };

  if (emailSent) {
    return (
      <AuthLayout>
        {/* Success State */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-green-500/20 items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={64} color="#4ade80" />
          </View>
          
          <Text className="text-3xl font-bold text-white mb-2 text-center">
            Check Your Email
          </Text>
          
          <Text className="text-gray-300 text-base text-center px-4">
            We've sent a password reset link to{' '}
            <Text className="text-secondary-400 font-semibold">{email}</Text>
          </Text>
        </View>

        <View className="bg-secondary-500/10 border border-secondary-500/30 rounded-2xl p-4 mb-6">
          <Text className="text-gray-300 text-sm text-center">
            Click the link in the email to reset your password. If you don't see the email, check your spam folder.
          </Text>
        </View>

        <PrimaryButton
          title="Back to Login"
          onPress={() => router.replace('/login')}
          variant="primary"
        />

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

  return (
    <AuthLayout>
      {/* Title */}
      <View className="mb-8 items-center">
        <View className="w-24 h-24 rounded-full bg-secondary-500/20 items-center justify-center mb-4">
          <Ionicons name="lock-closed-outline" size={64} color="#4894a8" />
        </View>
        
        <Text className="text-3xl font-bold text-white mb-2 text-center">
          Forgot Password?
        </Text>
        
        <Text className="text-gray-300 text-base text-center">
          No worries! Enter your email and we'll send you a reset link.
        </Text>
      </View>

      {/* Form */}
      <View className="mb-6">
        <TextInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          errorMessage={error}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          icon="mail-outline"
        />
      </View>

      {/* Reset Button */}
      <PrimaryButton
        title="Send Reset Link"
        onPress={handleResetPassword}
        loading={loading}
        variant="primary"
      />

      {/* Back to Login */}
      <View className="flex-row justify-center items-center mt-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={20} color="#4894a8" />
          <Text className="text-secondary-400 font-semibold ml-2">
            Back to Login
          </Text>
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
