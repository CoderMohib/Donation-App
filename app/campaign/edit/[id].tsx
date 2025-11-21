import { PrimaryButton } from '@/src/components/buttons';
import { TextInput } from '@/src/components/inputs';
import { DashboardLayout } from '@/src/components/layouts';
import { updateCampaign } from '@/src/firebase/firestore';
import { useAuth, useCampaign } from '@/src/hooks';
import { Campaign } from '@/src/types';
import { asyncHandler, validateAmount } from '@/src/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const CATEGORIES: Array<{ label: string; value: Campaign['category'] }> = [
  { label: 'Education', value: 'education' },
  { label: 'Health', value: 'health' },
  { label: 'Disaster Relief', value: 'disaster' },
  { label: 'Community', value: 'community' },
  { label: 'Other', value: 'other' },
];

export default function EditCampaignScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { campaign, loading: campaignLoading, error: campaignError } = useCampaign(id);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState<Campaign['category']>('other');
  const [errors, setErrors] = useState<{
    title?: string;
    shortDescription?: string;
    fullDescription?: string;
    targetAmount?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Pre-fill form when campaign loads
  useEffect(() => {
    if (campaign && user) {
      // Check permission: owner or admin
      if (campaign.ownerId === user.id || user.role === 'admin') {
        setIsAuthorized(true);
        setTitle(campaign.title);
        setShortDescription(campaign.shortDescription);
        setFullDescription(campaign.fullDescription);
        setTargetAmount(campaign.targetAmount.toString());
        setCategory(campaign.category || 'other');
      } else {
        setIsAuthorized(false);
        Alert.alert(
          'Unauthorized',
          'You do not have permission to edit this campaign.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    }
  }, [campaign, user]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (shortDescription.length > 100) {
      newErrors.shortDescription = 'Short description must be 100 characters or less';
    }

    if (!fullDescription.trim()) {
      newErrors.fullDescription = 'Full description is required';
    } else if (fullDescription.length < 20) {
      newErrors.fullDescription = 'Full description must be at least 20 characters';
    }

    const amountNum = parseFloat(targetAmount);
    if (isNaN(amountNum)) {
      newErrors.targetAmount = 'Please enter a valid amount';
    } else {
      const amountValidation = validateAmount(amountNum);
      if (!amountValidation.isValid) {
        newErrors.targetAmount = amountValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateCampaign = async () => {
    if (!validateForm()) return;
    if (!id) return;

    setLoading(true);

    const [, error] = await asyncHandler(
      updateCampaign(id, {
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        targetAmount: parseFloat(targetAmount),
        category,
      })
    );

    setLoading(false);

    if (error) {
      Alert.alert('Update Failed', error.message);
      return;
    }

    Alert.alert('Success!', 'Your campaign has been updated.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  if (campaignLoading) {
    return (
      <DashboardLayout title="Edit Campaign" showBackButton onBackPress={() => router.back()}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text className="text-gray-400 mt-4">Loading campaign...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (campaignError || !campaign) {
    return (
      <DashboardLayout title="Edit Campaign" showBackButton onBackPress={() => router.back()}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text className="text-gray-300 text-xl font-bold mb-2">Campaign Not Found</Text>
          <Text className="text-gray-400 text-center">
            {campaignError?.message || 'The campaign you are looking for does not exist.'}
          </Text>
        </View>
      </DashboardLayout>
    );
  }

  if (!isAuthorized) {
    return (
      <DashboardLayout title="Edit Campaign" showBackButton onBackPress={() => router.back()}>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🔒</Text>
          <Text className="text-gray-300 text-xl font-bold mb-2">Unauthorized</Text>
          <Text className="text-gray-400 text-center">
            You do not have permission to edit this campaign.
          </Text>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Edit Campaign"
      showBackButton
      onBackPress={() => router.back()}
    >
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-600 to-purple-500 rounded-2xl p-6 mb-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Edit Your Campaign
          </Text>
          <Text className="text-white text-base opacity-90">
            Update your campaign details
          </Text>
        </View>

        {/* Campaign Status Info */}
        <View className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <Text className="text-gray-400 text-sm mb-1">Current Status</Text>
          <Text className="text-white text-lg font-bold capitalize">
            {campaign.status.replace('_', ' ')}
          </Text>
          <Text className="text-gray-400 text-xs mt-2">
            Donated: ${campaign.donatedAmount.toFixed(2)} / ${campaign.targetAmount.toFixed(2)}
          </Text>
        </View>

        {/* Title Input */}
        <TextInput
          label="Campaign Title"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setErrors({ ...errors, title: undefined });
          }}
          errorMessage={errors.title}
          placeholder="Enter a compelling title"
          maxLength={100}
          containerClassName="mb-4"
        />

        {/* Short Description */}
        <TextInput
          label="Short Description (Max 100 characters)"
          value={shortDescription}
          onChangeText={(text) => {
            setShortDescription(text);
            setErrors({ ...errors, shortDescription: undefined });
          }}
          errorMessage={errors.shortDescription}
          placeholder="Brief summary for campaign cards"
          maxLength={100}
          multiline
          numberOfLines={2}
          containerClassName="mb-4"
        />

        {/* Character Counter */}
        <Text className="text-gray-400 text-xs mb-4 -mt-2 ml-1">
          {shortDescription.length}/100 characters
        </Text>

        {/* Full Description */}
        <TextInput
          label="Full Description"
          value={fullDescription}
          onChangeText={(text) => {
            setFullDescription(text);
            setErrors({ ...errors, fullDescription: undefined });
          }}
          errorMessage={errors.fullDescription}
          placeholder="Provide detailed information about your campaign..."
          multiline
          numberOfLines={6}
          containerClassName="mb-4"
        />

        {/* Target Amount */}
        <TextInput
          label="Target Amount ($)"
          value={targetAmount}
          onChangeText={(text) => {
            setTargetAmount(text);
            setErrors({ ...errors, targetAmount: undefined });
          }}
          errorMessage={errors.targetAmount}
          keyboardType="numeric"
          placeholder="0.00"
          containerClassName="mb-4"
        />

        {/* Category Selector */}
        <View className="mb-6">
          <Text className="text-gray-300 font-semibold mb-2 ml-1">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setCategory(cat.value)}
                className={`px-4 py-3 rounded-full border-2 ${
                  category === cat.value
                    ? 'bg-purple-600 border-purple-600'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    category === cat.value ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-6">
          <PrimaryButton
            title="Update Campaign"
            onPress={handleUpdateCampaign}
            loading={loading}
            variant="primary"
            size="large"
          />
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white/5 rounded-full py-4 items-center"
            disabled={loading}
          >
            <Text className="text-gray-300 font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <Text className="text-gray-500 text-xs text-center mb-4">
          Note: You cannot change the donated amount or campaign status from here.
        </Text>
      </ScrollView>
    </DashboardLayout>
  );
}
