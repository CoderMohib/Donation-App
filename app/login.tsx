import { PrimaryButton } from '@/src/components/buttons';
import { Toast } from '@/src/components/feedback';
import { PasswordInput, TextInput } from '@/src/components/inputs';
import { AuthLayout } from '@/src/components/layouts';
import { signIn } from '@/src/firebase';
import { useToast } from '@/src/hooks';
import { asyncHandler, validateEmail, validateRequired } from '@/src/utils';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { toast, showError, hideToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    const emailValidation = validateRequired(email, 'Email');
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const passwordValidation = validateRequired(password, 'Password');
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const [_user, error] = await asyncHandler(signIn(email, password));
    setLoading(false);

    if (error) {
      // Check if error is due to unverified email
      if (error.message.includes('verify your email')) {
        showError(error.message);
        // Redirect to email verification screen after 2 seconds
        setTimeout(() => {
          router.push('/email-verification');
        }, 2000);
        return;
      }
      
      showError(error.message);
      return;
    }

    // Navigate based on role
    if (_user && _user.role === 'admin') {
      router.replace('/(admin)/dashboard');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <AuthLayout>
      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      {/* Title - Centered */}
      <View className="mb-8 items-center">
        <Text className="text-4xl font-bold text-white mb-2 text-center">
          Welcome Back
        </Text>
        <Text className="text-gray-300 text-base text-center">
          Sign in to continue making a difference
        </Text>
      </View>

      {/* Form */}
      <View className="mb-4">
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
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: undefined });
          }}
          errorMessage={errors.password}
          autoComplete="password"
        />

        {/* Forgot Password Link */}
        <TouchableOpacity 
          onPress={() => router.push('/forgot-password')}
          className="self-end mt-1"
        >
          <Text className="text-secondary-400 text-sm font-semibold">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
          
      {/* Login Button */}
      <PrimaryButton
        title="Sign In"
        onPress={handleLogin}
        loading={loading}
        variant="primary"
      />

      {/* Divider */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-white/20" />
        <Text className="mx-4 text-gray-400">or</Text>
        <View className="flex-1 h-px bg-white/20" />
      </View>

      {/* Sign Up Link */}
      <View className="flex-row justify-center items-center">
        <Text className="text-gray-300">{`Don't have an account? `}</Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text className="text-secondary-400 font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>

      
    </AuthLayout>
  );
}
