import { Tabs } from 'expo-router'
import {FontAwesome} from '@expo/vector-icons'

export default function TabLayout() {
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
        tabBarIcon: ({color}) => <FontAwesome name="shopping-cart" size={26} color={color}/>
    }}/>
    <Tabs.Screen name="profile" options={{
        title: "Profile",
        headerShown:false,
        tabBarIcon: ({color}) => <FontAwesome name="user" size={26} color={color}/>
    }}/>
   </Tabs>
  )
}
