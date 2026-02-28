import { Stack } from "expo-router"
import "./global.css"

const RootLayout = () =>{
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name="product/[id]" options={{title: "Product Details", headerBackTitle: "Back"}}/>
        </Stack>
    )
}

export default RootLayout