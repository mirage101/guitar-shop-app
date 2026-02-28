import { Stack } from "expo-router"
import "./global.css"
import { ProductProvider } from "../components/ProductContext"
import { UserProvider } from "../components/UserContext"
const RootLayout = () =>{
    return (
        <UserProvider>
            <ProductProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="product/[id]" options={{title: "Product Details", headerBackTitle: "Back"}}/>
                </Stack>
            </ProductProvider>
        </UserProvider>
    )
}

export default RootLayout