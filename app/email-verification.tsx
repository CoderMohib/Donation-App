import { PrimaryButton } from '@/src/components/buttons';
import { Toast } from '@/src/components/feedback';
import { AuthLayout } from '@/src/components/layouts';
import { checkEmailVerified, resendVerificationEmail } from '@/src/firebase';
import { useToast } from '@/src/hooks';
import { asyncHandler } from '@/src/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { toast, showSuccess, showError, showInfo, hideToast } = useToast();
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [resending, setResending] = useState(false);

  // Check verification status every 5 seconds
  useEffect(() => {
    const checkVerification = async () => {
      const [verified, error] = await asyncHandler(checkEmailVerified());
      
      if (verified) {
        setIsVerified(true);
        setIsChecking(false);
        showSuccess('Email verified successfully!');
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 2000);
      } else {
        setIsChecking(false);
      }
    };

    // Initial check
    checkVerification();

    // Set up interval to check every 5 seconds
    const interval = setInterval(checkVerification, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleResendEmail = async () => {
    setResending(true);
    const [_, error] = await asyncHandler(resendVerificationEmail());
    setResending(false);

    if (error) {
      showError(error.message);
      return;
    }

    showInfo('Verification email sent! Please check your inbox.');
  };

  return (
    <AuthLayout>
      {/* Title */}
      <View className="mb-8 items-center">
        <View className="w-24 h-24 rounded-full bg-secondary-500/20 items-center justify-center mb-4">
          {isVerified ? (
            <Ionicons name="checkmark-circle" size={64} color="#4ade80" />
          ) : (
            <Ionicons name="mail-outline" size={64} color="#4894a8" />
          )}
        </View>
        
        <Text className="text-3xl font-bold text-white mb-2 text-center">
          {isVerified ? 'Email Verified!' : 'Verify Your Email'}
        </Text>
        
        <Text className="text-gray-300 text-base text-center px-4">
          {isVerified
            ? 'Your email has been verified. Redirecting you to the app...'
            : 'We sent a verification link to your email address. Please check your inbox and click the link to verify your account.'}
        </Text>
      </View>

      {/* Status */}
      {!isVerified && (
        <View className="mb-6">
          <View className="bg-secondary-500/10 border border-secondary-500/30 rounded-full p-4 mb-4">
            <View className="flex-row items-center">
              {isChecking ? (
                <ActivityIndicator size="small" color="#4894a8" className="mr-3" />
              ) : (
                <Ionicons name="time-outline" size={24} color="#4894a8" className="mr-3" />
              )}
              <Text className="text-gray-300 flex-1">
                {isChecking
                  ? 'Checking verification status...'
                  : 'Waiting for email verification...'}
              </Text>
            </View>
          </View>

          <Text className="text-gray-400 text-sm text-center mb-4">
            This page will automatically refresh every 5 seconds to check your verification status.
          </Text>
        </View>
      )}

      {/* Resend Button */}
      {!isVerified && (
        <PrimaryButton
          title="Resend Verification Email"
          onPress={handleResendEmail}
          loading={resending}
          variant="primary"
          className="mb-4 rounded"
        />
      )}

      {/* Back to Login */}
      {!isVerified && (
        <View className="flex-row justify-center items-center mt-4">
          <Text className="text-gray-300">Already verified? </Text>
          <Text
            onPress={() => router.replace('/login')}
            className="text-secondary-400 font-bold"
          >
            Sign In
          </Text>
        </View>
      )}

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
