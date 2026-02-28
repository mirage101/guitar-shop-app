import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store"
import { useUserContext } from "../../components/UserContext";

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

const Login = () => {
    const { setUserData } = useUserContext();
    const [inputData, setInputData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (key, value) => {
        setInputData((prev) => ({ ...prev, [key]: value }));
    }

    const handleSubmit = () => {
        const { email, password } = inputData;

        if (!email || !password) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(inputData)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    SecureStore.setItem("authToken", data.token);
                    console.log(data.token);
                    Alert.alert("Success", "Login successful.");
                    setUserData(data.data);
                    router.push("/");
                } else {
                    Alert.alert("Error", data.message);
                }
            })
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
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
                            onChangeText={(text) => handleInputChange("email", text)}
                            value={inputData.email}
                        />
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
                    </View>
                    <TouchableOpacity className="py-3 bg-blue-600 rounded-lg" onPress={handleSubmit}>
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