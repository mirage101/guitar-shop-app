import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
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

    const handleSubmit = async () => {
        const { email, password } = inputData;

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const credentials = await signInWithEmailAndPassword(auth, email.trim(), password);
            const token = await credentials.user.getIdToken();

            await setToken(token);

            setUserData({
                id: credentials.user.uid,
                email: credentials.user.email,
                customerName: credentials.user.displayName || credentials.user.email?.split("@")[0] || "Customer",
            });

            Alert.alert("Success", "Login successful.");
            router.push("/");
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
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaView className="flex-1 py-20 bg-white">
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
                    <Text className="font-medium text-center">
                        Don't have an account? <Text className="font-semibold text-blue-600" onPress={() => router.push("/register")}>Sign Up</Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Login;