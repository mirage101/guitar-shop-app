import { useLocalSearchParams, router } from "expo-router";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect,useState } from "react";
import {FontAwesome} from "@expo/vector-icons";
import { useProductContext } from "../../components/ProductContext";
import { cn } from "../../lib/utils";
import { findProductById } from "../../lib/firebaseProducts";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";

const ProductDetails = () =>{
    const {id} = useLocalSearchParams();
    const {addProductToCart, removeProductFromCart, cartItems, toggleWishlistItem, isWishlisted} = useProductContext();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const heartScale = useSharedValue(1);
    const cartButtonScale = useSharedValue(1);

    const isProductInCart = cartItems.some((item) => item.id === product.id);
    const fetchProductDetails = async () => {
          if (!id) {
              setError("Invalid product id.");
              setLoading(false);
              return;
          }

       try {
              setLoading(true);
              setError("");
            const fetchedProduct = await findProductById(id);
              if (!fetchedProduct) {
                 setProduct({});
                 setError("Product not found.");
                 return;
              }

              setProduct(fetchedProduct);
       } catch (error) {
            console.log("Product fetch error:", error);
              setError(error?.message || "Unable to load product details.");
       }finally{
        setLoading(false)
       };
    };

    const imageUri = product?.image
        ? product.image.startsWith("http")
            ? product.image
            : product.image
        : undefined;

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const handleCartItems = () =>{
        cartButtonScale.value = withSequence(
            withTiming(0.95, { duration: 80 }),
            withSpring(1.05, { damping: 10, stiffness: 220 }),
            withSpring(1, { damping: 12, stiffness: 180 })
        );

        if(isProductInCart) {
            removeProductFromCart(product.id)
        }else{
            addProductToCart({
                ...product,
                quantity: 1,
            });  
        }        
    }

    const handleBuyProduct = () => {
        addProductToCart({
            ...product,
            quantity: 1,
        });
        router.push("/cart");
    }

    const ratingStars = Math.max(0, Math.floor(Number(product?.rating || 0)));
    const hasMrp = Number(product?.mrp ?? 0) > 0;
    const wishlisted = isWishlisted(product?.id);

    const heartAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: heartScale.value }],
    }));

    const cartButtonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cartButtonScale.value }],
    }));

    const handleToggleWishlist = () => {
        heartScale.value = withSequence(
            withTiming(0.82, { duration: 80 }),
            withSpring(1.15, { damping: 8, stiffness: 220 }),
            withSpring(1, { damping: 10, stiffness: 180 })
        );

        if (product?.id) {
            toggleWishlistItem(product);
        }
    };

    if (loading) {
        return (
            <View className="items-center justify-center flex-1">
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    if (error) {
        return (
            <View className="items-center justify-center flex-1 px-6 bg-white">
                <Text className="text-xl font-semibold text-center text-gray-900">Unable to load product</Text>
                <Text className="mt-2 text-center text-gray-600">{error}</Text>
                <TouchableOpacity className="px-4 py-2 mt-4 bg-blue-600 rounded-md" onPress={fetchProductDetails}>
                    <Text className="font-semibold text-white">Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-2 mt-3 bg-gray-200 rounded-md" onPress={() => router.back()}>
                    <Text className="font-semibold text-gray-700">Go Back</Text>
                </TouchableOpacity>
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
                <View className="flex-row items-center justify-between">
                    <Text className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full">
                        {product?.productType?.name}
                    </Text>
                    <Animated.View style={heartAnimatedStyle}>
                        <TouchableOpacity
                            className="p-2 bg-white border border-gray-200 rounded-full"
                            onPress={handleToggleWishlist}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <FontAwesome
                                name={wishlisted ? "heart" : "heart-o"}
                                size={20}
                                color={wishlisted ? "#DC2626" : "#374151"}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                <Text className="my-2 text-2xl font-semibold">
                    {product?.name}
                </Text>
                <View className="flex-row items-center gap-1">
                    {[...Array(ratingStars)].map((_,index)=>(
                    <FontAwesome name="star" size={16} color="#FFD700" key={index}/>
                    ))}
                </View>
                <View className="flex-col gap-2 my-5">
                    <Text className={cn("text-sm font-medium", hasMrp ? "text-green-600" : "text-gray-700")}>
                        {hasMrp ? "Special Price" : "Price"}
                    </Text>
                    <View className="flex-row items-center gap-x-3">
                        <Text className="text-lg font-semibold">${product?.sellPrice}</Text>
                        {hasMrp ? (
                            <Text className="text-sm text-gray-500 line-through">
                                ${product?.mrp}
                            </Text>
                        ) : null}
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
                    <Animated.View style={[{ width: "100%", maxWidth: 160 }, cartButtonAnimatedStyle]}>
                        <TouchableOpacity onPress={handleCartItems} className={cn("px-3 py-1 border border-blue-500 rounded-md", isProductInCart && "border-red-400")}>
                            <Text className={cn("text-lg font-semibold text-center text-blue-500", isProductInCart && "text-red-500")}>
                                {isProductInCart ? "Remove From Cart" : "Add To Cart"}  
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity className="px-3 py-1 bg-blue-500 border border-blue-500 rounded-md w-full max-w-[160px]" onPress={handleBuyProduct}>
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