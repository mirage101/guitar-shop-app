import {Text, View, TextInput, TouchableOpacity} from "react-native"
import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
const Login = () => {
    const [inputData, setInputData] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (key, value) =>{
        setInputData((prev) => ({...prev, [key]: value}));
    }

    const handleSubmit = () =>{
        console.log(inputData);
    }
  return (
     <SafeAreaView>
     <View className="flex-1 px-5 py-20 bg-white">
                <Text className="text-4xl font-medium text-center">Login</Text>
                <View className="w-full max-w-sm mx-auto">
                 <View className="flex-col gap-6">
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
                        <Text className="font-semibold text-center text-white">
                            Submit
                        </Text>
                    </TouchableOpacity>
                    <Text className="font-medium text-center">
                        Don't have an account? <Text className="font-semibold text-blue-600" onPress={()=> router.push("/register")}>Sign up</Text>
                    </Text>
                 </View>
                </View>
                </View>
            </SafeAreaView> 
  )
}

export default Login;
