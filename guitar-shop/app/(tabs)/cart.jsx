import { Text, View, Image, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProductContext } from "../../components/ProductContext";
import {FontAwesome} from "@expo/vector-icons"
import Constants from "expo-constants";


const BASE_URL = Constants.expoConfig.extra.BASE_URL;
const Cart = () => {
  const {cartItems, increaseQuantity, decreaseQuantity, removeProductFromCart, totalAmount} = useProductContext();
  return (
    <SafeAreaView className="flex-1 p-8 bg-white">
        <Text className="mb-4 text-3xl font-semibold">Cart</Text>
        {cartItems.length > 0 ? cartItems.map((product) => (
            <View key={product.id} className="flex-row gap-5 py-4 border-b border-gray-300">            
                <Image source={{uri: `${BASE_URL}${product?.image}`}} className="w-32 h-32" resizeMode="cover"/>
                <View className="flex-1">
                    <View className="flex-row justify-between">
                        <Text className="text-xl font-semibold">{product?.name}</Text>
                        <Text className="px-3 py-2 text-xs font-medium text-center text-gray-700 bg-gray-200 rounded-full">
                            {product?.productType?.name}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                    {[...Array(product?.rating)].map((_,index) => (
                        <FontAwesome name="star" size={16} color="#FFD700"/>
                    ))}
                    </View>
                     <View className="flex-row items-center mt-2 gap-x-2">
                        <Text className="text-xl font-semibold">${product?.sellPrice}</Text>
                        <Text className="text-sm font-medium text-gray-500 line-through">${product?.mrp}</Text>
                    </View>
                    <View className="flex-row items-center justify-between align-end">
                        <View className="flex-row items-center gap-2 mt-5">
                            <TouchableOpacity onPress={() => decreaseQuantity(product?.id)} disabled={product?.quantity === 1}>
                                <FontAwesome name="minus-circle" size={30} color="black"/>
                            </TouchableOpacity>
                            <Text className="text-xl font-semibold">{product?.quantity}</Text>
                            <TouchableOpacity onPress={() => increaseQuantity(product?.id)}>
                                <FontAwesome name="plus-circle" size={30} color="black"/>
                            </TouchableOpacity>
                            
                        </View>
                        <View className="px-5">
                            <TouchableOpacity className="px-4 py-2 bg-red-500 rounded-md" onPress={() =>removeProductFromCart(product?.id)}>
                                    <FontAwesome name="trash" size={20} color="white"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )) : (
            <View className="justify-center text-center align-center h-100">
                <Text className="text-2xl font-medium text-center align-center"> Cart is empty.</Text>
            </View>
        )}
        {cartItems.length > 0 && (
             <View className="my-6">
        <Text className="py-2 text-2xl font-semibold border-gray-300 border-y">Cart Summary</Text>
        {cartItems.map((item, index) => (
            <View key={index} className="flex-row justify-between text-xl">
                <Text className="text-lg font-medium">{item.name}</Text>
                <Text className="text-lg font-medium text-end">${item.sellPrice * item.quantity}</Text>
            </View>
        ))}
        <View className="flex-row justify-between pt-2 mt-3 border-t border-gray-300">
            <Text className="text-xl font-semibold">Total Amount</Text>
            <Text className="text-xl font-semibold">${totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity className="py-3 mt-4 bg-blue-500 rounded-xl">
            <Text className="font-semibold text-center text-white">Checkout</Text>
        </TouchableOpacity>
       </View>
        )}
      
    </SafeAreaView>
  )
}

export default Cart
