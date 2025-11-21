import { PrimaryButton } from '@/src/components/buttons';
import { TextInput } from '@/src/components/inputs';
import { DashboardLayout } from '@/src/components/layouts';
import { createCampaign, updateUserCampaignStats } from '@/src/firebase/firestore';
import { useAuth } from '@/src/hooks';
import { Campaign } from '@/src/types';
import { asyncHandler, validateAmount } from '@/src/utils';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const CATEGORIES: Array<{ label: string; value: Campaign['category'] }> = [
  { label: 'Education', value: 'education' },
  { label: 'Health', value: 'health' },
  { label: 'Disaster Relief', value: 'disaster' },
  { label: 'Community', value: 'community' },
  { label: 'Other', value: 'other' },
];

export default function CreateCampaignScreen() {
  const router = useRouter();
  const { user } = useAuth();
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

  const handleCreateCampaign = async () => {
    if (!validateForm()) return;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a campaign');
      return;
    }

    setLoading(true);

    const [campaignId, error] = await asyncHandler(
      createCampaign({
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        targetAmount: parseFloat(targetAmount),
        category,
        ownerId: user.id,
        ownerName: user.name,
        status: 'draft',
        donatedAmount: 0,
      })
    );

    if (error) {
      setLoading(false);
      Alert.alert('Creation Failed', error.message);
      return;
    }

    // Update user stats
    await asyncHandler(updateUserCampaignStats(user.id, 1));

    setLoading(false);

    Alert.alert(
      'Success!',
      'Your campaign has been created as a draft. You can start it from My Campaigns.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/my-campaigns'),
        },
      ]
    );
  };

  const handleReset = () => {
    setTitle('');
    setShortDescription('');
    setFullDescription('');
    setTargetAmount('');
    setCategory('other');
    setErrors({});
  };

  return (
    <DashboardLayout title="Create Campaign" showBackButton={false} scrollable={false}>
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-white text-2xl font-bold mb-2">
            Start Your Campaign
          </Text>
          <Text className="text-white text-base opacity-90">
            Create a campaign to raise funds for your cause
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
        <Text className="text-gray-500 text-xs mb-4 -mt-2 ml-1">
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
          <Text className="text-gray-700 font-semibold mb-2 ml-1">
            Category
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setCategory(cat.value)}
                className={`px-4 py-3 rounded-full border-2 ${
                  category === cat.value
                    ? 'bg-purple-600 border-purple-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`font-semibold ${
                    category === cat.value ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Image Placeholder */}
        <View className="mb-6">
          <Text className="text-gray-700 font-semibold mb-2 ml-1">
            Campaign Image
          </Text>
          <View className="bg-white border-2 border-gray-200 border-dashed rounded-2xl p-8 items-center justify-center">
            <Text className="text-gray-400 text-center">
              📷 Image upload coming soon
            </Text>
            <Text className="text-gray-500 text-xs text-center mt-2">
              For now, campaigns will use a default image
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3 mb-6">
          <PrimaryButton
            title="Create Campaign (Draft)"
            onPress={handleCreateCampaign}
            loading={loading}
            variant="primary"
            size="large"
          />
          <TouchableOpacity
            onPress={handleReset}
            className="bg-gray-200 rounded-full py-4 items-center"
            disabled={loading}
          >
            <Text className="text-gray-700 font-semibold">Reset Form</Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <Text className="text-gray-500 text-xs text-center mb-4">
          Your campaign will be saved as a draft. You can start it later from My Campaigns.
        </Text>
      </ScrollView>
    </DashboardLayout>
  );
}
