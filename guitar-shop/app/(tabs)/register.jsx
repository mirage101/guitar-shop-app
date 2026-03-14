import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserContext } from "../../components/UserContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { setToken } from "../../lib/authStorage";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
    const { setUserData } = useUserContext();
    const [inputData, setInputData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (key, value) => {
        setInputData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: "" }));
        }
    }

    const validateForm = () => {
        const nextErrors = {};
        const trimmedName = inputData.name.trim();
        const trimmedEmail = inputData.email.trim();

        if (!trimmedName) {
            nextErrors.name = "Name is required.";
        } else if (trimmedName.length < 2) {
            nextErrors.name = "Name must be at least 2 characters.";
        }

        if (!trimmedEmail) {
            nextErrors.email = "Email is required.";
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!inputData.password) {
            nextErrors.password = "Password is required.";
        } else if (inputData.password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters long.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    const handleSubmit = async () => {
        const { name, email, password } = inputData;

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password);
            await updateProfile(credentials.user, { displayName: name.trim() });
            const token = await credentials.user.getIdToken();

            await setToken(token);
            setUserData({
                id: credentials.user.uid,
                email: credentials.user.email,
                customerName: name.trim(),
            });

            Alert.alert("Success", "Registration successful.");
            router.push("/")
        } catch (error) {
            const message =
                error?.code === "auth/email-already-in-use"
                    ? "Email is already in use."
                    : error?.code === "auth/invalid-email"
                        ? "Please enter a valid email address."
                        : error?.code === "auth/weak-password"
                            ? "Password is too weak."
                            : error?.message || "Registration failed.";

            Alert.alert("Error", message);
        } finally {
            setLoading(false);
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
                    <Text className="text-4xl font-medium text-center">Sign Up</Text>
                    <View className="w-full max-w-sm mx-auto">
                        <View className="flex-col gap-6">
                            <View className="flex-col gap-2">
                                <Text className="text-base font-medium text-gray-700">Name</Text>
                                <TextInput
                                    placeholder="Enter your Name"
                                    className="px-4 py-3 border border-gray-300 rounded-lg"
                                    onChangeText={(text) => handleInputChange("name", text)}
                                    value={inputData.name}
                                />
                                {!!errors.name && <Text className="text-sm text-red-500">{errors.name}</Text>}
                            </View>
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
                            <TouchableOpacity className="py-3 bg-blue-600 rounded-lg" onPress={handleSubmit} disabled={loading}>
                                {loading ? <ActivityIndicator color="white" /> : (
                                    <Text className="font-semibold text-center text-white">
                                        Submit
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <Text className="font-medium text-center">
                                Already have an account? <Text className="font-semibold text-blue-600" onPress={() => router.push("/login")}>Login</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Register;