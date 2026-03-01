import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

const ForgotPassword = () => {
  const [inputData, setInputData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key, value) => {
    setInputData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const email = inputData.email.trim().toLowerCase();
    const newPassword = inputData.newPassword;
    const confirmPassword = inputData.confirmPassword;

    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!BASE_URL) {
      Alert.alert("Error", "Missing API base URL configuration.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data?.message || "Unable to reset password.");
        return;
      }

      Alert.alert("Success", "Password updated successfully.");
      router.push("/login");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 py-20 bg-white">
      <Text className="text-4xl font-medium text-center">Forgot Password</Text>
      <View className="w-full max-w-sm mx-auto">
        <View className="flex-col gap-6">
          <View className="flex-col gap-2">
            <Text className="text-base font-medium text-gray-700">Email</Text>
            <TextInput
              placeholder="Enter your Email"
              className="px-4 py-3 border border-gray-300 rounded-lg"
              autoCapitalize="none"
              onChangeText={(text) => handleInputChange("email", text)}
              value={inputData.email}
            />
          </View>

          <View className="flex-col gap-2">
            <Text className="text-base font-medium text-gray-700">New Password</Text>
            <TextInput
              placeholder="Enter your new Password"
              className="px-4 py-3 border border-gray-300 rounded-lg"
              secureTextEntry
              onChangeText={(text) => handleInputChange("newPassword", text)}
              value={inputData.newPassword}
            />
          </View>

          <View className="flex-col gap-2">
            <Text className="text-base font-medium text-gray-700">Confirm Password</Text>
            <TextInput
              placeholder="Confirm your new Password"
              className="px-4 py-3 border border-gray-300 rounded-lg"
              secureTextEntry
              onChangeText={(text) => handleInputChange("confirmPassword", text)}
              value={inputData.confirmPassword}
            />
          </View>

          <TouchableOpacity className="py-3 bg-blue-600 rounded-lg" onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-center text-white">Reset Password</Text>
            )}
          </TouchableOpacity>

          <Text className="font-medium text-center">
            Remembered your password?{" "}
            <Text className="font-semibold text-blue-600" onPress={() => router.push("/login")}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
