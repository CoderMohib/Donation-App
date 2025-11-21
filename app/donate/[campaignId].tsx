import { PrimaryButton } from "@/src/components/buttons";
import { Toast } from "@/src/components/feedback";
import { DashboardLayout } from "@/src/components/layouts";
import { auth, createDonation, getCampaign } from "@/src/firebase";
import { useToast } from "@/src/hooks";
import { asyncHandler, validateAmount } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DonationScreen() {
  const router = useRouter();
  const { campaignId } = useLocalSearchParams<{ campaignId: string }>();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [campaign, setCampaign] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string }>({});
  const [loading, setLoading] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(true);

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    if (!campaignId) return;
    const [data, error] = await asyncHandler(getCampaign(campaignId));
    if (data) setCampaign(data);
    setLoadingCampaign(false);
  };

  const validateForm = (): boolean => {
    const newErrors: { amount?: string } = {};
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      newErrors.amount = "Please enter a valid amount";
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
      showError("You must be logged in to donate");
      return;
    }

    setLoading(true);

    const [donationId, error] = await asyncHandler(
      createDonation({
        campaignId,
        campaignTitle: campaign?.title,
        donorId: user.uid,
        donorName: user.displayName || "Anonymous",
        amount: parseFloat(amount),
        message: message.trim() || undefined,
        isAnonymous,
      })
    );

    setLoading(false);

    if (error) {
      showError(error.message || "Failed to process donation");
      return;
    }

    showSuccess("Thank you! Your donation has been processed successfully.");
    setTimeout(() => router.back(), 2000);
  };

  if (loadingCampaign) {
    return (
      <DashboardLayout
        title="Make a Donation"
        showBackButton
        onBackPress={() => router.back()}
      >
        <View className="items-center justify-center py-20">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Make a Donation"
      showBackButton
      onBackPress={() => router.back()}
      scrollable={false}
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          {/* Hero */}
          <LinearGradient
            colors={["#ff7a5e", "#f55d3d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}
          >
            <View className="flex-row items-center">
              <View className="bg-white/20 rounded-full p-2 mr-3">
                <Ionicons name="heart" size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold">
                  Support This Cause
                </Text>
                <Text className="text-white/90 text-xs mt-1">
                  Every contribution counts
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Amount Selection */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold text-base mb-3">
              Select Amount
            </Text>

            {/* Quick Amount Buttons - Rounded Full */}
            <View className="flex-row flex-wrap gap-2 mb-3">
              {[10, 25, 50, 100, 250, 500].map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  onPress={() => setAmount(quickAmount.toString())}
                  className={`flex-1 min-w-[30%] py-3 rounded-full ${
                    amount === quickAmount.toString()
                      ? "bg-primary-500"
                      : "bg-gray-100"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-center font-bold text-base ${
                      amount === quickAmount.toString()
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    ${quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Amount */}
            <View className="bg-gray-50 rounded-xl p-3">
              <Text className="text-gray-600 font-semibold text-xs mb-2">
                Or enter custom amount
              </Text>
              <View className="flex-row items-center bg-white rounded-lg px-3 py-2">
                <Text className="text-gray-500 text-xl font-bold mr-2">$</Text>
                <TextInput
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    setErrors({ ...errors, amount: undefined });
                  }}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-gray-900 text-xl font-bold"
                  style={{ padding: 0, margin: 0 }}
                />
              </View>
              {errors.amount && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.amount}
                </Text>
              )}
            </View>
          </View>

          {/* Summary */}
          {amount && !errors.amount && (
            <View className="bg-secondary-50 rounded-2xl p-4 mb-4 border border-secondary-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-secondary-700 text-xs font-semibold mb-1">
                    Your Donation
                  </Text>
                  <Text className="text-secondary-900 text-3xl font-bold">
                    ${parseFloat(amount).toFixed(2)}
                  </Text>
                </View>
                <View className="bg-secondary-500 rounded-full p-3">
                  <Ionicons name="checkmark-circle" size={32} color="white" />
                </View>
              </View>
            </View>
          )}

          {/* Message */}
          <View className="mb-4">
            <Text className="text-gray-900 font-bold text-base mb-2">
              Message (Optional)
            </Text>
            <View className="bg-white rounded-xl border border-gray-200 p-3">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Share why you're supporting..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                className="text-gray-900 text-sm"
                style={{ minHeight: 60, textAlignVertical: "top" }}
              />
            </View>
          </View>

          {/* Anonymous Toggle */}
          <TouchableOpacity
            onPress={() => setIsAnonymous(!isAnonymous)}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row justify-between items-center"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  isAnonymous ? "bg-secondary-100" : "bg-gray-100"
                }`}
              >
                <Ionicons
                  name={isAnonymous ? "eye-off" : "eye"}
                  size={20}
                  color={isAnonymous ? "#4894a8" : "#9ca3af"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-sm">
                  Donate Anonymously
                </Text>
                <Text className="text-gray-500 text-xs">
                  {isAnonymous ? "Hidden" : "Public"}
                </Text>
              </View>
            </View>
            <Switch
              value={isAnonymous}
              onValueChange={setIsAnonymous}
              trackColor={{ false: "#e5e7eb", true: "#4894a8" }}
              thumbColor={isAnonymous ? "#FFFFFF" : "#f3f4f6"}
              ios_backgroundColor="#e5e7eb"
            />
          </TouchableOpacity>

          {/* Donate Button */}
          <PrimaryButton
            title={loading ? "Processing..." : "Complete Donation"}
            onPress={handleDonate}
            loading={loading}
            variant="primary"
            size="large"
          />

          {/* Security Badge */}
          <View className="flex-row items-center justify-center mt-3 rounded-lg py-3 px-4">
            <Ionicons name="shield-checkmark" size={16} color="#10b981" />
            <Text className="text-green-700 text-xs font-semibold ml-2">
              Secure & Encrypted Payment
            </Text>
          </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}
