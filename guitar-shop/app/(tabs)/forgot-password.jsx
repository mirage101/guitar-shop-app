import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert("Error", "Email is required.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      Alert.alert("Success", "Password reset email sent. Please check your inbox.");
      router.push("/login");
    } catch (error) {
      const message =
        error?.code === "auth/user-not-found"
          ? "No account found with this email."
          : error?.code === "auth/invalid-email"
            ? "Please enter a valid email address."
            : error?.message || "Unable to send reset email. Please try again.";

      Alert.alert("Error", message);
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
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <TouchableOpacity className="py-3 bg-blue-600 rounded-lg" onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-center text-white">Send Reset Email</Text>
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
