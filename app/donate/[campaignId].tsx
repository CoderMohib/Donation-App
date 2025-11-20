import { PrimaryButton } from '@/src/components/buttons';
import { TextInput } from '@/src/components/inputs';
import { DashboardLayout } from '@/src/components/layouts';
import { auth, createDonation, getCampaign } from '@/src/firebase';
import { asyncHandler, validateAmount } from '@/src/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function DonationScreen() {
  const router = useRouter();
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { amount?: string } = {};

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      newErrors.amount = 'Please enter a valid amount';
    } else {
      const amountValidation = validateAmount(amountNum);
      if (!amountValidation.isValid) {
        newErrors.amount = amountValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDonate = async () => {
    if (!validateForm()) return;
    if (!campaignId) return;

    const user = auth?.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to donate');
      return;
    }

    setLoading(true);

    // Get campaign details for title
    const [campaign, campaignError] = await asyncHandler(getCampaign(campaignId));

    const [donationId, error] = await asyncHandler(
      createDonation({
        campaignId,
        campaignTitle: campaign?.title,
        donorId: user.uid,
        donorName: user.displayName || 'Anonymous',
        amount: parseFloat(amount),
        message: message.trim() || undefined,
        isAnonymous,
        status: 'completed',
      })
    );

    setLoading(false);

    if (error) {
      Alert.alert('Donation Failed', error.message);
      return;
    }

    Alert.alert(
      'Thank You!',
      'Your donation has been processed successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <DashboardLayout
      title="Make a Donation"
      showBackButton
      onBackPress={() => router.back()}
    >
      <View className="px-4 py-6">
        {/* Header */}
        <View className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 mb-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Every Contribution Counts
          </Text>
          <Text className="text-white text-base opacity-90">
            Your generosity makes a real difference
          </Text>
        </View>

        {/* Amount Input */}
        <View className="mb-6">
          <TextInput
            label="Donation Amount ($)"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setErrors({ ...errors, amount: undefined });
            }}
            errorMessage={errors.amount}
            keyboardType="numeric"
            placeholder="0.00"
          />

          {/* Quick Amount Buttons */}
          <View className="flex-row justify-between mt-2">
            {[10, 25, 50, 100].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                onPress={() => setAmount(quickAmount.toString())}
                className="bg-purple-100 px-4 py-2 rounded-lg"
              >
                <Text className="text-purple-700 font-semibold">
                  ${quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Message Input */}
        <TextInput
          label="Message (Optional)"
          value={message}
          onChangeText={setMessage}
          placeholder="Share why you're donating..."
          multiline
          numberOfLines={4}
          containerClassName="mb-6"
        />

        {/* Anonymous Toggle */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base mb-1">
              Donate Anonymously
            </Text>
            <Text className="text-gray-500 text-sm">
              Your name won't be shown publicly
            </Text>
          </View>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: '#D1D5DB', true: '#7C3AED' }}
            thumbColor={isAnonymous ? '#FFFFFF' : '#F3F4F6'}
          />
        </View>

        {/* Summary Card */}
        {amount && !errors.amount && (
          <View className="bg-purple-50 rounded-xl p-4 mb-6">
            <Text className="text-gray-700 text-sm mb-2">
              You're donating:
            </Text>
            <Text className="text-purple-700 text-3xl font-bold">
              ${parseFloat(amount).toFixed(2)}
            </Text>
          </View>
        )}

        {/* Donate Button */}
        <PrimaryButton
          title="Complete Donation"
          onPress={handleDonate}
          loading={loading}
          variant="success"
          size="large"
        />

        {/* Info Text */}
        <Text className="text-gray-500 text-xs text-center mt-4">
          Your donation is secure and will be processed immediately
        </Text>
      </View>
    </DashboardLayout>
  );
}
