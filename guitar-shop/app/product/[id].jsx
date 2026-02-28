import { useLocalSearchParams } from "expo-router";
import { View, Text, Image } from "react-native";
import { useEffect,useState } from "react";
import Constants from "expo-constants"
import {FontAwesome} from "@expo/vector-icons";
const BASE_URL = Constants.expoConfig.extra.BASE_URL;
const ProductDetails = () =>{
    const {id} = useLocalSearchParams();
    const [product, setProduct] = useState({})
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
       }
    };

    const imageUri = product?.image
        ? product.image.startsWith("http")
            ? product.image
            : `${BASE_URL}${product.image}`
        : undefined;

    useEffect(() => {
        fetchProductDetails();
    }, [id]);
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
            </View>
        </View>
    )
}

export default ProductDetails;