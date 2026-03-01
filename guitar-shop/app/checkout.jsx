import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Constants from "expo-constants";
import { useProductContext } from "../components/ProductContext";
import { useUserContext } from "../components/UserContext";
import { getToken } from "../lib/authStorage";

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

const Checkout = () => {
  const { userData } = useUserContext();
  const { cartItems, totalAmount, setCartItems } = useProductContext();
  const [address, setAddress] = useState(userData?.address || "");
  const [city, setCity] = useState(userData?.city || "");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!userData) {
      Alert.alert("Error", "Please login first.");
      router.push("/login");
      return;
    }

    if (!cartItems.length) {
      Alert.alert("Error", "Your cart is empty.");
      router.push("/cart");
      return;
    }

    if (!address.trim() || !city.trim()) {
      Alert.alert("Error", "Address and city are required.");
      return;
    }

    const token = await getToken();

    if (!token) {
      Alert.alert("Error", "Session expired. Please login again.");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerId: userData.id,
        customerEmail: userData.email,
        SODateTime: Date.now() / 1000,
        grandTotalPrice: Number(totalAmount.toFixed(2)),
        paymentMode: "cash_on_delivery",
        address: address.trim(),
        city: city.trim(),
        products: cartItems,
      };

      const response = await fetch(`${BASE_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data?.message || "Checkout failed.");
        return;
      }

      setCartItems([]);
      Alert.alert("Success", data?.message || "Order placed successfully.", [
        {
          text: "View My Orders",
          onPress: () => router.push("/orders"),
        },
        {
          text: "Go Home",
          onPress: () => router.push("/"),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-8 bg-white">
      <Text className="mb-4 text-3xl font-semibold">Checkout</Text>

      <View className="gap-4">
        <View className="gap-2">
          <Text className="text-base font-medium text-gray-700">Address</Text>
          <TextInput
            placeholder="Enter your address"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View className="gap-2">
          <Text className="text-base font-medium text-gray-700">City</Text>
          <TextInput
            placeholder="Enter your city"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View className="mt-2">
          <Text className="text-lg font-medium">Items: {cartItems.length}</Text>
          <Text className="text-xl font-semibold">Total: ${totalAmount.toFixed(2)}</Text>
          <Text className="mt-1 text-sm text-gray-600">Payment mode: Cash on Delivery</Text>
        </View>

        <TouchableOpacity
          className="py-3 mt-2 bg-blue-600 rounded-lg"
          onPress={placeOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-semibold text-center text-white">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Checkout;
