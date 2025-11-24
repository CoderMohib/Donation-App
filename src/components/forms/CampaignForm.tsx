import { Campaign } from "@/src/types";
import { validateAmount } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIES: Array<{
  label: string;
  value: Campaign["category"];
  icon: keyof typeof Ionicons.glyphMap;
}> = [
  { label: "Disaster Relief", value: "disaster", icon: "alert-circle" },
  { label: "Community", value: "community", icon: "people" },
  { label: "Education", value: "education", icon: "school" },
  { label: "Health", value: "health", icon: "medical" },
  { label: "Other", value: "other", icon: "ellipsis-horizontal" },
];

interface CampaignFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Campaign>;
  loading: boolean;
  onSubmit: (data: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    targetAmount: number;
    category: Campaign["category"];
    imageUri?: string;
  }) => void;
  onReset?: () => void;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  mode,
  initialData,
  loading,
  onSubmit,
  onReset,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [fullDescription, setFullDescription] = useState(
    initialData?.fullDescription || ""
  );
  const [targetAmount, setTargetAmount] = useState(
    initialData?.targetAmount?.toString() || ""
  );
  const [category, setCategory] = useState<Campaign["category"]>(
    initialData?.category || "other"
  );
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    shortDescription?: string;
    fullDescription?: string;
    targetAmount?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setShortDescription(initialData.shortDescription || "");
      setFullDescription(initialData.fullDescription || "");
      setTargetAmount(initialData.targetAmount?.toString() || "");
      setCategory(initialData.category || "other");
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (title.length > 40) {
      newErrors.title = "Title must be less than 40 characters";
    }

    if (!shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    } else if (shortDescription.length > 100) {
      newErrors.shortDescription =
        "Short description must be 100 characters or less";
    }

    if (!fullDescription.trim()) {
      newErrors.fullDescription = "Full description is required";
    } else if (fullDescription.length < 20) {
      newErrors.fullDescription =
        "Full description must be at least 20 characters";
    }

    const amountNum = parseFloat(targetAmount);
    if (isNaN(amountNum)) {
      newErrors.targetAmount = "Please enter a valid amount";
    } else {
      const amountValidation = validateAmount(amountNum);
      if (!amountValidation.isValid) {
        newErrors.targetAmount = amountValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to upload images!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      alert("Failed to pick image");
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      targetAmount: parseFloat(targetAmount),
      category,
      imageUri: imageUri || undefined,
    });
  };

  const handleReset = () => {
    setTitle("");
    setShortDescription("");
    setFullDescription("");
    setTargetAmount("");
    setCategory("other");
    setImageUri(null);
    setErrors({});
    onReset?.();
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View
        className="bg-white rounded-3xl p-6 mb-4 shadow-lg"
        style={{
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center mb-3">
          <View className="bg-primary-100 rounded-full p-3 mr-3">
            <Ionicons
              name={mode === "create" ? "rocket" : "pencil"}
              size={24}
              color="#ff7a5e"
            />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 text-2xl font-bold">
              {mode === "create" ? "Start Your Campaign" : "Edit Your Campaign"}
            </Text>
          </View>
        </View>
        <Text className="text-gray-600 text-base leading-6">
          {mode === "create"
            ? "Create a campaign to raise funds for your cause and make a real impact"
            : "Update your campaign details to better reach your audience"}
        </Text>
      </View>

      {/* Title Input */}
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-2 ml-1 text-base">
          Campaign Title *
        </Text>
        <RNTextInput
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setErrors({ ...errors, title: undefined });
          }}
          placeholder="Enter a compelling title"
          placeholderTextColor="#9CA3AF"
          maxLength={40}
          className={`bg-white rounded-2xl px-4 py-4 text-base text-gray-900 border-2 ${
            errors.title ? "border-red-400" : "border-gray-200"
          }`}
        />
        {errors.title && (
          <Text className="text-red-500 text-sm mt-1.5 ml-1">
            {errors.title}
          </Text>
        )}
        <Text className="text-gray-400 text-xs mt-1 ml-1">
          {title.length}/40 characters
        </Text>
      </View>

      {/* Short Description */}
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-2 ml-1 text-base">
          Short Description *
        </Text>
        <RNTextInput
          value={shortDescription}
          onChangeText={(text) => {
            setShortDescription(text);
            setErrors({ ...errors, shortDescription: undefined });
          }}
          placeholder="Brief summary for campaign cards"
          placeholderTextColor="#9CA3AF"
          maxLength={100}
          multiline
          numberOfLines={2}
          className={`bg-white rounded-2xl px-4 py-4 text-base text-gray-900 border-2 ${
            errors.shortDescription ? "border-red-400" : "border-gray-200"
          }`}
          style={{ textAlignVertical: "top", minHeight: 80 }}
        />
        {errors.shortDescription && (
          <Text className="text-red-500 text-sm mt-1.5 ml-1">
            {errors.shortDescription}
          </Text>
        )}
        <Text className="text-gray-400 text-xs mt-1 ml-1">
          {shortDescription.length}/100 characters
        </Text>
      </View>

      {/* Full Description */}
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-2 ml-1 text-base">
          Full Description *
        </Text>
        <RNTextInput
          value={fullDescription}
          onChangeText={(text) => {
            setFullDescription(text);
            setErrors({ ...errors, fullDescription: undefined });
          }}
          placeholder="Provide detailed information about your campaign, goals, and how funds will be used..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={6}
          className={`bg-white rounded-2xl px-4 py-4 text-base text-gray-900 border-2 ${
            errors.fullDescription ? "border-red-400" : "border-gray-200"
          }`}
          style={{ textAlignVertical: "top", minHeight: 120 }}
        />
        {errors.fullDescription && (
          <Text className="text-red-500 text-sm mt-1.5 ml-1">
            {errors.fullDescription}
          </Text>
        )}
      </View>

      {/* Target Amount */}
      <View className="mb-3">
        <Text className="text-gray-700 font-semibold mb-2 ml-1 text-base">
          Target Amount *
        </Text>
        <View className="relative">
          <View className="absolute left-4 h-full justify-center z-10">
            <Text className="text-gray-500 font-bold text-lg">$</Text>
          </View>
          <RNTextInput
            value={targetAmount}
            onChangeText={(text) => {
              setTargetAmount(text);
              setErrors({ ...errors, targetAmount: undefined });
            }}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            editable={mode === "create"} // Can't edit target amount in edit mode
            className={`bg-white rounded-2xl pl-10 pr-4 py-4 text-base text-gray-900 border-2 ${
              errors.targetAmount ? "border-red-400" : "border-gray-200"
            } ${mode === "edit" ? "bg-gray-50" : ""}`}
          />
        </View>
        {errors.targetAmount && (
          <Text className="text-red-500 text-sm mt-1.5 ml-1">
            {errors.targetAmount}
          </Text>
        )}
        {mode === "edit" && (
          <Text className="text-gray-500 text-xs mt-1 ml-1">
            Target amount cannot be changed after creation
          </Text>
        )}
      </View>

      {/* Category Selector */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-3 ml-1 text-base">
          Category *
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setCategory(cat.value)}
              activeOpacity={0.7}
              className={`px-3 py-2 rounded-full border-2 flex-row items-center ${
                category === cat.value
                  ? "bg-primary-500 border-primary-500"
                  : "bg-white border-gray-200"
              }`}
              style={
                category === cat.value
                  ? {
                      shadowColor: "#ff7a5e",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }
                  : {}
              }
            >
              <Ionicons
                name={cat.icon}
                size={18}
                color={category === cat.value ? "#FFFFFF" : "#6B7280"}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`font-semibold text-base ${
                  category === cat.value ? "text-white" : "text-gray-700"
                }`}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Campaign Image Upload */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-3 ml-1 text-base">
          Campaign Image (Optional)
        </Text>
        <TouchableOpacity
          onPress={pickImage}
          disabled={uploadingImage}
          activeOpacity={0.7}
          className="bg-gray-50 border-2 border-gray-200 border-dashed rounded-2xl overflow-hidden"
        >
          {imageUri ? (
            <View className="relative">
              <Image
                source={{ uri: imageUri }}
                className="w-full h-48"
                resizeMode="cover"
              />
              <View className="absolute top-2 right-2 bg-white rounded-full p-2">
                <Ionicons name="pencil" size={20} color="#ff7a5e" />
              </View>
            </View>
          ) : (
            <View className="p-8 items-center justify-center">
              <Ionicons name="image-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 text-center mt-3 font-medium">
                Tap to add campaign image
              </Text>
              <Text className="text-gray-500 text-xs text-center mt-1">
                Recommended: 16:9 aspect ratio
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {imageUri && (
          <TouchableOpacity
            onPress={() => setImageUri(null)}
            className="mt-2 flex-row items-center justify-center"
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text className="text-red-500 text-sm ml-1 font-medium">
              Remove Image
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View className="gap-3 mb-4">
        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
          className="rounded-full overflow-hidden shadow-lg"
          style={{
            shadowColor: "#ff7a5e",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <LinearGradient
            colors={["#ff7a5e", "#f55d3d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="py-3 px-8 items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View className="flex-row items-center">
                <Ionicons
                  name={mode === "create" ? "checkmark-circle" : "save"}
                  size={22}
                  color="#FFFFFF"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white font-bold text-lg">
                  {mode === "create"
                    ? "Create Campaign (Draft)"
                    : "Save Changes"}
                </Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Reset Button */}
        {mode === "create" && onReset && (
          <TouchableOpacity
            onPress={handleReset}
            disabled={loading}
            activeOpacity={0.7}
            className="bg-gray-100 border-2 border-gray-200 rounded-full py-3 items-center"
          >
            <View className="flex-row items-center">
              <Ionicons
                name="refresh"
                size={20}
                color="#6B7280"
                style={{ marginRight: 6 }}
              />
              <Text className="text-gray-700 font-semibold text-base">
                Reset Form
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Info Text */}
      <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
        <View className="flex-row items-start">
          <Ionicons
            name="information-circle"
            size={20}
            color="#3B82F6"
            style={{ marginRight: 8, marginTop: 2 }}
          />
          <Text className="text-blue-700 text-sm flex-1 leading-5">
            {mode === "create"
              ? "Your campaign will be saved as a draft. You can review and start it later from the My Campaigns tab."
              : "Changes will be saved immediately. Your campaign will remain in its current status."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
