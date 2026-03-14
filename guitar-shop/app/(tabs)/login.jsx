import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";
import { useUserContext } from "../../components/UserContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { setToken } from "../../lib/authStorage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
    const { setUserData } = useUserContext();
    const [inputData, setInputData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [biometricLoading, setBiometricLoading] = useState(false);

    const handleInputChange = (key, value) => {
        setInputData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: "" }));
        }
    }

    const validateForm = () => {
        const nextErrors = {};
        const trimmedEmail = inputData.email.trim();

        if (!trimmedEmail) {
            nextErrors.email = "Email is required.";
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!inputData.password) {
            nextErrors.password = "Password is required.";
        } else if (inputData.password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    const completeLogin = async (user) => {
        const token = await user.getIdToken();

        await setToken(token);

        setUserData({
            id: user.uid,
            email: user.email,
            customerName: user.displayName || user.email?.split("@")[0] || "Customer",
        });

        router.push("/");
    };

    const signInUser = async () => {
        const { email, password } = inputData;

        if (!validateForm()) {
            return false;
        }

        try {
            const credentials = await signInWithEmailAndPassword(auth, email.trim(), password);
            await completeLogin(credentials.user);

            Alert.alert("Success", "Login successful.");
            return true;
        } catch (error) {
            const message =
                error?.code === "auth/invalid-credential"
                    ? "Invalid email or password."
                    : error?.code === "auth/user-not-found"
                        ? "User not found."
                        : error?.code === "auth/wrong-password"
                            ? "Invalid email or password."
                            : error?.message || "Login failed.";

            Alert.alert("Error", message);
            return false;
        }
    }

    const handleSubmit = async () => {
        setLoading(true);
        await signInUser();
        setLoading(false);
    }

    const handleBiometricLogin = async () => {
        if (!validateForm()) {
            return;
        }

        setBiometricLoading(true);

        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert("Biometrics Unavailable", "Set up Face ID or fingerprint on your device first.");
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Login with Biometrics",
                fallbackLabel: "Use Device Passcode",
            });

            if (!result.success) {
                Alert.alert("Authentication Failed", "Biometric verification was not successful.");
                return;
            }

            await signInUser();
        } finally {
            setBiometricLoading(false);
        }
    }
    return (
        <SafeAreaView className="flex-1 py-20 bg-white">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <Text className="text-4xl font-medium text-center">Login</Text>
                    <View className="w-full max-w-sm mx-auto">
                        <View className="flex-col gap-6">
                            <View className="flex-col gap-2">
                                <Text className="text-base font-medium text-gray-700">Email</Text>
                                <TextInput
                                    placeholder="Enter your Email"
                                    className="px-4 py-3 border border-gray-300 rounded-lg"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    onChangeText={(text) => handleInputChange("email", text)}
                                    value={inputData.email}
                                />
                                {!!errors.email && <Text className="text-sm text-red-500">{errors.email}</Text>}
                            </View>
                            <View className="flex-col gap-2">
                                <Text className="text-base font-medium text-gray-700">Password</Text>
                                <TextInput
                                    placeholder="Enter your Password"
                                    className="px-4 py-3 border border-gray-300 rounded-lg"
                                    secureTextEntry
                                    onChangeText={(text) => handleInputChange("password", text)}
                                    value={inputData.password}
                                />
                                {!!errors.password && <Text className="text-sm text-red-500">{errors.password}</Text>}
                            </View>
                            <TouchableOpacity onPress={() => router.push("/forgot-password")}> 
                                <Text className="text-sm font-semibold text-right text-blue-600">Forgot Password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="py-3 bg-blue-600 rounded-lg" onPress={handleSubmit} disabled={loading}>
                                {loading ? <ActivityIndicator color="white" /> : (
                                    <Text className="font-semibold text-center text-white">
                                        Submit
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="py-3 rounded-lg bg-emerald-600"
                                onPress={handleBiometricLogin}
                                disabled={biometricLoading || loading}
                            >
                                {biometricLoading ? <ActivityIndicator color="white" /> : (
                                    <Text className="font-semibold text-center text-white">
                                        Login with Biometrics
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <Text className="font-medium text-center">
                                Don't have an account? <Text className="font-semibold text-blue-600" onPress={() => router.push("/register")}>Sign Up</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Login;