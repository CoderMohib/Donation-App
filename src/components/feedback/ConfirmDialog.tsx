import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "danger";
  icon?: keyof typeof Ionicons.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  icon = "help-circle",
  onConfirm,
  onCancel,
}) => {
  const getIconColor = () => {
    switch (confirmColor) {
      case "danger":
        return "#e04020";
      case "primary":
      default:
        return "#ff7a5e";
    }
  };

  const getConfirmButtonClass = () => {
    switch (confirmColor) {
      case "danger":
        return "bg-primary-700";
      case "primary":
      default:
        return "bg-primary-500";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
          {/* Icon */}
          <View className="items-center mb-4">
            <View
              className="rounded-full p-4 mb-3"
              style={{
                backgroundColor:
                  confirmColor === "danger" ? "#ffe8e4" : "#fff5f3",
              }}
            >
              <Ionicons name={icon} size={48} color={getIconColor()} />
            </View>
          </View>

          {/* Title */}
          <Text className="text-gray-900 text-2xl font-bold text-center mb-3">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-gray-600 text-base text-center mb-6 leading-6">
            {message}
          </Text>

          {/* Buttons */}
          <View className="gap-3">
            {/* Confirm Button */}
            <TouchableOpacity
              onPress={onConfirm}
              className={`${getConfirmButtonClass()} rounded-full py-4 px-6`}
              style={{
                shadowColor: getIconColor(),
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-center text-base">
                {confirmText}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={onCancel}
              className="bg-gray-100 rounded-full py-4 px-6 border-2 border-gray-200"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 font-bold text-center text-base">
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
