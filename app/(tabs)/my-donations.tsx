import { PrimaryButton } from '@/src/components/buttons';
import { DonationCard } from '@/src/components/cards';
import { DashboardLayout } from '@/src/components/layouts';
import { auth, getUserDonations } from '@/src/firebase';
import { Donation } from '@/src/types';
import { asyncHandler } from '@/src/utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

export default function MyDonationsScreen() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    const user = auth?.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const [data, error] = await asyncHandler(getUserDonations(user.uid));
    
    if (data) {
      setDonations(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <DashboardLayout title="My Donations">
        <View className="items-center justify-center py-20">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (!auth?.currentUser) {
    return (
      <DashboardLayout title="My Donations">
        <View className="items-center justify-center py-20 px-4">
          <Ionicons name="lock-closed-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 mt-4 text-center">
            Please log in to view your donations
          </Text>
          <View className="mt-4">
            <PrimaryButton
              title="Login"
              onPress={() => router.push('/login')}
              size="medium"
            />
          </View>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Donations" scrollable={false}>
      <View className="px-4 py-6">
        {donations.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">
              You haven't made any donations yet
            </Text>
            <View className="mt-4">
              <PrimaryButton
                title="Browse Campaigns"
                onPress={() => router.push('/(tabs)')}
                size="medium"
              />
            </View>
          </View>
        ) : (
          <>
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Your Donation History
            </Text>
            <FlatList
              data={donations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DonationCard donation={item} showCampaign />
              )}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
    </DashboardLayout>
  );
}
