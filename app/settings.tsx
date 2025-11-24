import { PrimaryButton } from "@/src/components/buttons";
import { Toast } from "@/src/components/feedback";
import { DashboardLayout } from "@/src/components/layouts";
import {
  getCurrentUser,
  updateUserProfile,
  uploadProfilePicture,
} from "@/src/firebase";
import { useToast } from "@/src/hooks";
import { User } from "@/src/types";
import { asyncHandler } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  TextInput as RNTextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState<string | undefined>(undefined);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async (isRefreshing = false) => {
    if (!isRefreshing) {
      setLoading(true);
    }

    const [userData, error] = await asyncHandler(getCurrentUser());

    if (userData) {
      setUser(userData);
      setName(userData.name);
      setPhone((userData as any).phone || "");
      setBio((userData as any).bio || "");
      setPhotoURL(userData.photoURL);
    } else if (error) {
      showError("Failed to load user data");
    }

    if (isRefreshing) {
      setRefreshing(false);
    } else {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData(true);
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        showError("Sorry, we need camera roll permissions to upload images!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setNewImageUri(result.assets[0].uri);
      }
    } catch (error) {
      showError("Failed to pick image");
    }
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      showError("Name is required");
      return false;
    }

    if (name.trim().length < 2) {
      showError("Name must be at least 2 characters");
      return false;
    }

    if (phone && phone.trim().length > 0 && phone.trim().length < 10) {
      showError("Phone number must be at least 10 digits");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!user) return;

    if (!validateForm()) return;

    setSaving(true);

    try {
      let updatedPhotoURL = photoURL;

      // Upload new image if selected
      if (newImageUri) {
        setUploadingImage(true);
        const [uploadedURL, uploadError] = await asyncHandler(
          uploadProfilePicture(user.id, newImageUri)
        );

        if (uploadedURL) {
          updatedPhotoURL = uploadedURL;
        } else if (uploadError) {
          showError("Failed to upload image");
          setSaving(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      // Update user profile
      const updates: Partial<User> = {
        name: name.trim(),
        ...(updatedPhotoURL && { photoURL: updatedPhotoURL }),
        ...(phone && ({ phone: phone.trim() } as any)),
        ...(bio && ({ bio: bio.trim() } as any)),
      };

      const [_, updateError] = await asyncHandler(
        updateUserProfile(user.id, updates)
      );

      if (!updateError) {
        showSuccess("Profile updated successfully!");
        setNewImageUri(null);
        setIsEditing(false); // Exit edit mode after save
        // Reload user data to get fresh data
        await loadUserData();
      } else {
        console.log(updateError);
        showError("Failed to update profile");
      }
    } catch (error) {
      showError("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setName(user.name);
      setPhone((user as any).phone || "");
      setBio((user as any).bio || "");
      setNewImageUri(null);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <View className="items-center justify-center py-20">
          <ActivityIndicator size="large" color="#ff7a5e" />
          <Text className="text-gray-500 mt-4">Loading...</Text>
        </View>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout title="Settings">
        <View className="items-center justify-center py-20">
          <Text className="text-gray-500">Please log in</Text>
          <PrimaryButton
            title="Login"
            onPress={() => router.push("/login")}
            size="medium"
          />
        </View>
      </DashboardLayout>
    );
  }

  const displayPhotoURL = newImageUri || photoURL;

  return (
    <DashboardLayout
      title="Settings"
      scrollable={false}
      leftAction={
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
      }
      rightAction={
        !isEditing ? (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="create-outline" size={24} color="#ff7a5e" />
          </TouchableOpacity>
        ) : undefined
      }
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff7a5e"]}
            tintColor="#ff7a5e"
          />
        }
      >
        <View className="px-4 py-4">
          {/* Profile Photo Section */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <View className="items-center">
              <TouchableOpacity
                onPress={pickImage}
                disabled={uploadingImage || !isEditing}
                className="mb-3"
              >
                <LinearGradient
                  colors={["#67c3d7", "#ff9580"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {displayPhotoURL ? (
                    <Image
                      source={{ uri: displayPhotoURL }}
                      className="w-[96px] h-[96px] rounded-full"
                    />
                  ) : (
                    <Text className="text-white text-4xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </LinearGradient>

                {/* Camera Icon Overlay */}
                <View className="absolute bottom-0 right-0 bg-primary-500 w-9 h-9 rounded-full items-center justify-center border-3 border-white">
                  {uploadingImage ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="camera" size={18} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>

              {isEditing && (
                <Text className="text-gray-500 text-xs text-center">
                  Tap to change photo
                </Text>
              )}
              {newImageUri && (
                <View className="bg-green-50 px-3 py-1 rounded-full mt-2">
                  <Text className="text-green-600 text-xs font-medium">
                    ✓ New image selected
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Personal Information Section */}
          <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Personal Information
            </Text>

            {/* Name Field */}
            <View className="mb-3">
              {isEditing ? (
                <View>
                  <Text className="text-gray-700 font-semibold mb-2 text-sm">
                    Name *
                  </Text>
                  <RNTextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    autoCapitalize="words"
                    className="bg-white rounded-xl px-4 py-3 text-base text-gray-900 border-2 border-gray-200"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              ) : (
                <>
                  <Text className="text-gray-500 text-xs mb-1">Name</Text>
                  <Text className="text-gray-900 font-semibold text-base">
                    {name || "Not set"}
                  </Text>
                </>
              )}
            </View>

            {/* Email Field (Read-only) */}
            <View className="mb-3">
              <Text className="text-gray-700 font-semibold mb-2 text-sm">
                Email
              </Text>
              <View className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Text className="text-gray-600 text-sm">{user.email}</Text>
              </View>
              <Text className="text-gray-400 text-xs mt-1">
                Email cannot be changed
              </Text>
            </View>

            {/* Phone Field */}
            <View className="mb-3">
              {isEditing ? (
                <View>
                  <Text className="text-gray-700 font-semibold mb-2 text-sm">
                    Phone Number
                  </Text>
                  <RNTextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    className="bg-white rounded-xl px-4 py-3 text-base text-gray-900 border-2 border-gray-200"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              ) : (
                <>
                  <Text className="text-gray-500 text-xs mb-1">
                    Phone Number
                  </Text>
                  <Text className="text-gray-900 font-semibold text-base">
                    {phone || "Not set"}
                  </Text>
                </>
              )}
            </View>

            {/* Bio Field */}
            <View className="mb-2">
              {isEditing ? (
                <View>
                  <Text className="text-gray-700 font-semibold mb-2 text-sm">
                    Bio
                  </Text>
                  <RNTextInput
                    value={bio}
                    onChangeText={setBio}
                    placeholder="Tell us about yourself"
                    multiline
                    numberOfLines={4}
                    className="bg-white rounded-xl px-4 py-3 text-base text-gray-900 border-2 border-gray-200"
                    style={{ height: 100, textAlignVertical: "top" }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              ) : (
                <>
                  <Text className="text-gray-500 text-xs mb-1">Bio</Text>
                  <Text className="text-gray-900 text-base">
                    {bio || "Not set"}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Role Badge (if admin) */}
          {user.role === "admin" && (
            <View className="bg-purple-50 rounded-xl px-2 mb-1 flex-row items-center">
              <View className="bg-purple-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                <Ionicons name="shield-checkmark" size={20} color="#7C3AED" />
              </View>
              <View className="flex-1">
                <Text className="text-purple-900 font-bold text-sm">
                  Admin Account
                </Text>
                <Text className="text-purple-700 text-xs">
                  You have administrator privileges
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <View className="flex-row gap-3 mt-1">
              {/* Cancel Button */}
              <TouchableOpacity
                onPress={handleCancel}
                className="flex-1 bg-gray-100 rounded-full py-4 items-center border border-gray-200"
                disabled={saving}
              >
                <Text className="text-gray-700 font-semibold text-base">
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Save Button */}
              <View className="flex-1">
                <PrimaryButton
                  title={saving ? "Saving..." : "Save"}
                  onPress={handleSave}
                  disabled={saving || uploadingImage}
                  loading={saving}
                  size="large"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}
