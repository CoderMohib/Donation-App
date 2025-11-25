import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-gray-900"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <ImageBackground
          source={require("../../../assets/auth_background.jpg")}
          className="flex-1"
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              "rgba(17, 24, 39, 0.95)",
              "rgba(72, 148, 168, 0.4)",
              "rgba(255, 178, 162, 0.3)",
            ]}
            className="flex-1"
          >
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* App Logo and Branding */}
              <View className="items-center pt-16 pb-6">
                <View className="w-28 h-28 rounded-full bg-white/10 items-center justify-center border-2 border-primary-300/40 shadow-lg">
                  <Image
                    source={require("../../../assets/app_logo.png")}
                    className="w-28 h-28 rounded-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-white text-2xl font-bold mt-4">
                  Donate Now
                </Text>
              </View>

              {/* Form Container with Glassmorphism */}
              <View className="flex-1 justify-end">
                <View className="bg-gray-900/60 rounded-t-[40px] border-t-2 border-l border-r border-secondary-500/30 px-6 pt-8 pb-8 shadow-2xl">
                  {children}
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
