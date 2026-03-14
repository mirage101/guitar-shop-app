import { useState } from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useProductContext } from "./ProductContext";

const ProductCard = ({product}) => {
    const [imageFailed, setImageFailed] = useState(false);
    const { toggleWishlistItem, isWishlisted } = useProductContext();

    if (!product) {
        return (
            <View>
                <Text>Product not available</Text>
            </View>
        );
    }

    const imageUrl = product?.image || '';
    const wishlisted = isWishlisted(product?.id);
    const productTypeId = product?.productType?.id ?? product?.productTypeId;
    const productTypeName = product?.productType?.name;

    const openProductDetails = () => {
        router.push(`/product/${product?.id}`);
    };

    const openProductType = () => {
        if (!productTypeId) {
            return;
        }

        router.push({
            pathname: "/product-type/[id]",
            params: { id: String(productTypeId) },
        });
    };

    return (
        <View className="w-1/2 p-8">
        <View className="relative">
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

            <TouchableOpacity
                className="absolute p-2 bg-white rounded-full top-2 right-2"
                onPress={() => toggleWishlistItem(product)}
            >
                <FontAwesome
                    name={wishlisted ? "heart" : "heart-o"}
                    size={18}
                    color={wishlisted ? "#DC2626" : "#374151"}
                />
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={openProductDetails}>
            <Text className="text-lg font-semibold">{product?.name}</Text>
        </TouchableOpacity>
            {!!productTypeName && (
                <TouchableOpacity onPress={openProductType} className="self-start px-2 py-1 mt-1 bg-blue-100 rounded-full">
                    <Text className="text-xs font-semibold text-blue-700">{productTypeName}</Text>
                </TouchableOpacity>
            )}
            <Text className="text-sm text-gray-400">{product?.description}</Text>
            <View className="flex-row items-center mt-3 gap-x-3">
                <Text className="text-lg font-semibold">Price: ${product?.sellPrice}</Text>
                <Text className="text-sm text-gray-500 line-through">${product?.mrp}</Text>
            </View>
            <TouchableOpacity onPress={openProductDetails} className="px-3 py-2 mt-3 bg-blue-500 rounded-md">
                <Text className="font-semibold text-center text-white">View</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProductCard;