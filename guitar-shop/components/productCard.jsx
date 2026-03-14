import { useState } from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useProductContext } from "./ProductContext";
import { cn } from "../lib/utils";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

const ProductCard = ({ product, containerClassName = "w-1/2 p-8" }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const { toggleWishlistItem, isWishlisted } = useProductContext();
    const heartScale = useSharedValue(1);

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
    const hasMrp = Number(product?.mrp ?? 0) > 0;

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

    const heartAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
    }));

    const handleToggleWishlist = () => {
        heartScale.value = withSequence(
            withTiming(0.82, { duration: 80 }),
            withSpring(1.15, { damping: 8, stiffness: 220 }),
            withSpring(1, { damping: 10, stiffness: 180 })
        );

        toggleWishlistItem(product);
    };

    return (
        <View className={cn(containerClassName)}>
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

            <Animated.View style={heartAnimatedStyle} className="absolute z-20 top-2 right-2">
                <TouchableOpacity
                    className="p-2 bg-white rounded-full"
                    onPress={handleToggleWishlist}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <FontAwesome
                        name={wishlisted ? "heart" : "heart-o"}
                        size={18}
                        color={wishlisted ? "#DC2626" : "#374151"}
                    />
                </TouchableOpacity>
            </Animated.View>
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
                <Text className="text-lg font-semibold">{hasMrp ? "Special Price" : "Price"}: ${product?.sellPrice}</Text>
                {hasMrp ? (
                    <Text className="text-sm text-gray-500 line-through">${product?.mrp}</Text>
                ) : null}
            </View>
            <TouchableOpacity onPress={openProductDetails} className="px-3 py-2 mt-3 bg-blue-500 rounded-md">
                <Text className="font-semibold text-center text-white">View</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProductCard;