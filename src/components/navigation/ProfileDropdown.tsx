import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { logOut } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { ConfirmDialog } from "../feedback/ConfirmDialog";
import { Toast } from "../feedback/Toast";

interface ProfileDropdownProps {
  /**
   * Optional custom icon size
   * @default 30
   */
  iconSize?: number;
  /**
   * Optional custom icon color
   * @default "#ff7a5e"
   */
  iconColor?: string;
}

/**
 * ProfileDropdown Component
 *
 * A reusable dropdown menu for user profile with logout functionality.
 * Displays user's profile picture or a default icon, and shows a dropdown
 * menu with Profile and Logout options when clicked.
 *
 * Features:
 * - Shows user profile picture if available
 * - Dropdown menu with Profile and Logout options
 * - Logout confirmation dialog
 * - Toast notifications for logout success/error
 * - Modal overlay for proper z-index handling
 *
 * @example
 * ```tsx
 * <ProfileDropdown />
 * ```
 */
export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  iconSize = 30,
  iconColor = "#ff7a5e",
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleLogout = () => {
    setShowDropdown(false);
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    try {
      await logOut();
      showSuccess("Logged out successfully");
      // Small delay to show toast before navigation
      setTimeout(() => {
        router.replace("/login");
      }, 500);
    } catch (error) {
      showError("Failed to logout. Please try again.");
    }
  };

  const handleProfilePress = () => {
    setShowDropdown(false);
    router.push("/profile");
  };

  return (
    <>
      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        visible={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmColor="danger"
        icon="log-out-outline"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />

      {/* Profile Icon Button */}
      <TouchableOpacity
        onPress={() => setShowDropdown(!showDropdown)}
        className="w-10 h-10 items-center justify-center"
      >
        {user?.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            className="w-9 h-9 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={iconSize}
            color={iconColor}
          />
        )}
      </TouchableOpacity>

      {/* Dropdown Modal */}
      {showDropdown && (
        <Modal
          transparent
          visible={showDropdown}
          onRequestClose={() => setShowDropdown(false)}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
            <View className="flex-1">
              {/* Dropdown Menu - Positioned at top right */}
              <View
                className="absolute top-16 right-4 w-48 bg-white rounded-lg shadow-2xl border border-gray-200"
                style={{
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}
              >
                <TouchableOpacity
                  onPress={handleProfilePress}
                  className="flex-row items-center px-4 py-3 border-b border-gray-100"
                >
                  <Ionicons name="person-outline" size={20} color="#374151" />
                  <Text className="ml-3 text-gray-900 font-medium">
                    Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setShowDropdown(false);
                    router.push("/settings");
                  }}
                  className="flex-row items-center px-4 py-3 border-b border-gray-100"
                >
                  <Ionicons name="settings-outline" size={20} color="#374151" />
                  <Text className="ml-3 text-gray-900 font-medium">
                    Settings
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-row items-center px-4 py-3"
                >
                  <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                  <Text className="ml-3 text-red-500 font-medium">Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};
