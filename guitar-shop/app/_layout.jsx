import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "./global.css"
import { ProductProvider } from "../components/ProductContext"
import { UserProvider } from "../components/UserContext"
const RootLayout = () =>{
    
    return (
        <UserProvider>
            <ProductProvider>
                <StatusBar style="dark" />
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen name="product/[id]" options={{title: "Product Details", headerBackTitle: "Back"}}/>
                    <Stack.Screen name="product-type/[id]" options={{title: "Product Type", headerBackTitle: "Back"}}/>
                    <Stack.Screen name="checkout" options={{title: "Checkout", headerBackTitle: "Back"}}/>
                    <Stack.Screen name="orders" options={{title: "My Orders", headerBackTitle: "Back"}}/>
                    <Stack.Screen name="order-details/[id]" options={{title: "Order Details", headerBackTitle: "Back"}}/>
                    <Stack.Screen name="wishlist" options={{title: "My Wishlist", headerBackTitle: "Back"}}/>
                </Stack>
            </ProductProvider>
        </UserProvider>
    )
}

export default RootLayout