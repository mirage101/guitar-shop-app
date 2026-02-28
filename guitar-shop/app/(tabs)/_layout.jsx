import { View, Text } from 'react-native';
import { Tabs } from 'expo-router'
import {FontAwesome} from '@expo/vector-icons'
import { useProductContext } from '../../components/ProductContext'
import { useUserContext } from '../../components/UserContext';

export default function TabLayout() {
    const {cartItems} = useProductContext();
    const {userData} = useUserContext();
    
  return (
   <Tabs>
    <Tabs.Screen name="index" options={{
        title: "Home",
        headerShown:false,
        tabBarIcon: ({color}) => <FontAwesome name="home" size={26} color={color}/>
    }}/>
    <Tabs.Screen name="cart" options={{
        title: "Cart",
        headerShown:false,
        tabBarIcon: ({color}) => 
        <View className="relative"> 
        <View className="absolute z-10 flex items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-2 -right-2">
            <Text className="text-sm font-semibold text-white">{cartItems.length}</Text>
        </View>       
            <FontAwesome name="shopping-cart" size={26} color={color}/>
        </View>
    }}/>
    <Tabs.Screen name="profile" options={{
        title: "Profile",
        headerShown:false,
        tabBarItemStyle: {
            display: userData ? "flex" : "none"
        },
        tabBarIcon: ({color}) => <FontAwesome name="user" size={26} color={color}/>
    }}/>
    <Tabs.Screen name="login" options={{
        title: "Login",
        headerShown:false,
         tabBarItemStyle: {
            display: userData ? "none" : "flex"
        },
        tabBarIcon: ({color}) => <FontAwesome name="user" size={26} color={color}/>
    }}/>
    <Tabs.Screen name="register" options={{
        title: "Register",
        headerShown:false,
        tabBarIcon: ({color}) => <FontAwesome name="user" size={26} color={color}/>,
        tabBarItemStyle: {
            display: "none",
        }
    }}/>
   </Tabs>
   
  )
}
