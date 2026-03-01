import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { useUserContext } from "../../components/UserContext";
import { router } from "expo-router";
import { removeToken } from "../../lib/authStorage";

const Profile = () => {
    const { userData, setUserData } = useUserContext();

    const handleLogout = async () => {
        setUserData(null);
        await removeToken();
        router.push("/")
    }
    return (
        <SafeAreaView className="items-center flex-1 py-20 bg-white">
            <FontAwesome name="user" size={80} color="black" />
            <Text className="my-2 text-2xl font-semibold">Profile</Text>
            <Text className="my-1 text-xl font-semibold">{userData?.customerName}</Text>
            <Text className="text-lg font-medium"> {userData?.email}</Text>
            <TouchableOpacity className="px-6 py-3 mt-6 bg-gray-800 rounded-lg" onPress={() => router.push("/orders")}>
                <Text className="font-semibold text-center text-white">
                    My Orders
                </Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-6 py-3 mt-6 bg-blue-600 rounded-lg" onPress={handleLogout}>
                <Text className="font-semibold text-center text-white">
                    Logout
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Profile 