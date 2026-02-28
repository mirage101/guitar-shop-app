import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const configuredBaseUrl = Constants.expoConfig?.extra?.BASE_URL;

const Register = () =>{
    const [inputData, setInputData] = useState({
        name:'',
        email: '',
        password:''
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (key, value) => {
        setInputData((prev) => ({...prev, [key]: value}));
    }
    const handleSubmit = async () =>{
        const {name, email, password} = inputData;

        if(!name || !email || !password){
            Alert.alert("Error", "All fields are required")
            return;
        }
        if(password.length < 8) {
            Alert.alert("Error", "Password must be at least 8 characters long.")
            return;
        }

        if (!configuredBaseUrl) {
            Alert.alert("Error", "BASE_URL is not configured.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${configuredBaseUrl}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputData)
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert("Error", data?.message || "Registration failed.");
                return;
            }

            if (!data?.token) {
                Alert.alert("Error", "Registration succeeded but no auth token returned.");
                return;
            }

            try {
                await SecureStore.setItemAsync("authToken", data.token);
            } catch (storageError) {
                console.log("Token save failed:", storageError);
            }
            Alert.alert("Success", "Registration successful");
            router.push("/");
        } catch (error) {
            Alert.alert("Error", error?.message || "Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaView>
          <View className="flex-1 px-5 py-20 bg-white">
            <Text className="text-4xl font-medium text-center">Sign Up</Text>
            <View className="w-full max-w-sm mx-auto">
             <View className="flex-col gap-6">
                <View className="flex-col gap-2">
                    <Text className="text-base font-medium text-gray-700">Name</Text>
                    <TextInput 
                        placeholder="Enter your Name" 
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                        onChangeText={(text)=> handleInputChange("name", text)}
                        value={inputData.name}
                    />
                </View>
                 <View className="flex-col gap-2">
                    <Text className="text-base font-medium text-gray-700">E-mail</Text>
                    <TextInput 
                        placeholder="Enter your E-mail" 
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                        autoCapitalize="none"
                        onChangeText={(text)=> handleInputChange("email", text)}
                        value={inputData.email}
                    />
                </View>
                 <View className="flex-col gap-2">
                    <Text className="text-base font-medium text-gray-700">Password</Text>
                    <TextInput 
                        placeholder="Enter your Password" 
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                        secureTextEntry
                        onChangeText={(text)=> handleInputChange("password", text)}
                        value={inputData.password}
                    />
                </View>
                <TouchableOpacity className="py-3 bg-blue-600 rounded-lg" onPress={handleSubmit}>
                    {loading ? <ActivityIndicator/> : (
                        <Text className="font-semibold text-center text-white">
                            Submit
                        </Text>
                    )}
                </TouchableOpacity>
                <Text className="font-medium text-center">
                    Already have an account? <Text className="font-semibold text-blue-600" onPress={()=> router.push("/login")}>Login</Text>
                </Text>
             </View>
            </View>
            </View>
        </SafeAreaView> 
    )
}
export default Register;