import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect,useState } from "react";
import Constants from "expo-constants"
import {FontAwesome} from "@expo/vector-icons";
const BASE_URL = Constants.expoConfig.extra.BASE_URL;
const ProductDetails = () =>{
    const {id} = useLocalSearchParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const fetchProductDetails = async () => {
       if (!id) return;

       try {
            const response = await fetch(`${BASE_URL}/api/products/${id}`);
           const data = await response.json();

            if (!response.ok) {
                console.log("Fetch failed:", response.status, data);                
                return;
            }

            setProduct(data?.data || {});
            console.log(data);
       } catch (error) {
            console.log("Network error:", error);
       }finally{
        setLoading(false)
       };
    };

    const imageUri = product?.image
        ? product.image.startsWith("http")
            ? product.image
            : `${BASE_URL}${product.image}`
        : undefined;

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    if (loading) {
        return (
            <View className="items-center justify-center flex-1">
                <ActivityIndicator size="large"/>
            </View>
        )
    }
    return(
        <View className="flex-1 p-10 bg-white">
            <Image 
                source={imageUri ? { uri: imageUri } : undefined}
                className="w-full h-60"
                resizeMode="contain"
                />
            <View className="p-5">
                <View className="flex-row justify-end">
                    <Text 
                    className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full">{product?.productType?.name}</Text>
                </View>
                <Text className="my-2 text-2xl font-semibold">
                    {product?.name}
                </Text>
                <View className="flex-row items-center gap-1">
                    {[...Array(product?.rating)].map((_,index)=>(
                    <FontAwesome name="star" size={16} color="#FFD700" key={index}/>
                    ))}
                </View>
                <View className="flex-col gap-2 my-5">
                    <Text className="text-sm font-medium text-green-600">
                        Special Price
                    </Text>
                    <View className="flex-row items-center gap-x-3">
                        <Text className="text-lg font-semibold">${product?.sellPrice}</Text>
                        <Text className="text-sm text-gray-500 line-through">
                            ${product?.mrp}
                        </Text>
                    </View>
                    <Text className="font-medium text-gray-500">
                        {product?.currentStock} items left
                    </Text>
                </View>
                <View className="my-3">
                    <Text className="text-lg font-semibold">Description:</Text>
                    <Text className="text-gray-600">{product?.description}</Text>
                </View>
                <View className="flex-row mt-5 gap-x-4">
                    <TouchableOpacity className="px-3 py-1 border border-blue-500 rounded-md w-full max-w-[160px]">
                        <Text className="text-lg font-semibold text-center text-blue-500">
                            Add To Cart
                        </Text>
                        
                    </TouchableOpacity>
                    <TouchableOpacity className="px-3 py-1 bg-blue-500 border border-blue-500 rounded-md w-full max-w-[160px]">
                    <Text className="text-lg font-semibold text-center text-white">
                            Buy Now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default ProductDetails;