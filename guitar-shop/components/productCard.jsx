import { useState } from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";

const ProductCard = ({product}) => {
    const [imageFailed, setImageFailed] = useState(false);

    if (!product) {
        return (
            <View>
                <Text>Product not available</Text>
            </View>
        );
    }

    const imageUrl = product?.image || '';

    return (
        <View className="w-1/2 p-8">
        {!imageFailed && !!imageUrl ? (
            <Image
                source={{uri: encodeURI(imageUrl)}}
                style={{ width: '100%', height: 208 }}
                resizeMode="cover"
                onError={() => setImageFailed(true)}
                className="w-full h-52"
            />
        ) : (
            <Text>Image not available</Text>
        )}
        <TouchableOpacity onPress={()=> router.push(`/product/${product?.id}`)}>
            <Text className="text-lg font-semibold">{product?.name}</Text>
        </TouchableOpacity>
            <Text className="text-sm text-gray-400">{product?.description}</Text>
            <View className="flex-row items-center mt-3 gap-x-3">
                <Text className="text-lg font-semibold">${product?.sellPrice}</Text>
                <Text className="text-sm text-gray-500 line-through">${product?.mrp}</Text>
            </View>
        </View>
    )
}

export default ProductCard;