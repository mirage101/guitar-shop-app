import { Stack } from "expo-router"
import "./global.css"
import { ProductProvider } from "../components/ProductContext"

const RootLayout = () =>{
    return (
        <ProductProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="product/[id]" options={{title: "Product Details", headerBackTitle: "Back"}}/>
            </Stack>
        </ProductProvider>
    )
}

export default RootLayout