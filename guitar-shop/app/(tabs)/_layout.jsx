import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons"
import { useProductContext } from "../../components/ProductContext";
import { Text, View } from "react-native";
import { useUserContext } from "../../components/UserContext";

export default function TabLayout() {
    const productContext = useProductContext();
    const userContext = useUserContext();
    const cartItems = productContext?.cartItems ?? [];
    const userData = userContext?.userData;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#2563EB",
                tabBarInactiveTintColor: "#6B7280",
                tabBarStyle: {
                    height: 68,
                    paddingTop: 6,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    lineHeight: 14,
                    marginTop: 0,
                },
                tabBarIconStyle: {
                    marginTop: 0,
                },
            }}
        >
        <Tabs.Screen name="index" options={{
                title: "Store",
                headerShown: false,
                tabBarIcon: ({ color }) => <FontAwesome name="home" size={26} color={color} />
            }} />
            <Tabs.Screen name="cart" options={{
                title: "Cart",
                headerShown: false,
                tabBarIcon: ({ color }) =>
                    <View className="relative">
                        {cartItems.length > 0 ? (
                            <View className="absolute z-10 flex items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-2 -right-2">
                                <Text className="text-sm font-semibold text-white">{cartItems.length}</Text>
                            </View>
                        ) : null}
                        <FontAwesome name="shopping-cart" size={26} color={color} />
                    </View>
            }} />
            
            <Tabs.Screen name="profile" options={{
                title: "Profile",
                headerShown: false,
                tabBarItemStyle: {
                    display: userData ? "flex" : "none"
                },
                tabBarIcon: ({ color }) => <FontAwesome name="user" size={26} color={color} />
            }} />
            <Tabs.Screen name="login" options={{
                title: "Login",
                headerShown: false,
                tabBarItemStyle: {
                    display: userData ? "none" : "flex"
                },
                tabBarIcon: ({ color }) => <FontAwesome name="user" size={26} color={color} />
            }} />
            <Tabs.Screen name="register" options={{
                title: "Register",
                headerShown: false,
                tabBarIcon: ({ color }) => <FontAwesome name="user" size={26} color={color} />,
                tabBarItemStyle: {
                    display: "none",
                }
            }} />
            <Tabs.Screen
                name="forgot-password"
                options={{
                    href: null, // hide from tab bar
                    headerShown: false,
                }}
                />
        </Tabs>
    )
}