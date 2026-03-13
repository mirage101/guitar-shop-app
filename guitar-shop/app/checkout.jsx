import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useProductContext } from "../components/ProductContext";
import { useUserContext } from "../components/UserContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const CITY_REGEX = /^[A-Za-z\s'-]+$/;

const Checkout = () => {
  const { userData } = useUserContext();
  const { cartItems, totalAmount, setCartItems } = useProductContext();
  const [address, setAddress] = useState(userData?.address || "");
  const [city, setCity] = useState(userData?.city || "");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!showSuccessModal) {
      return;
    }

    const timeout = setTimeout(() => {
      setShowSuccessModal(false);
      router.replace("/");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [showSuccessModal]);

  const handleAddressChange = (value) => {
    setAddress(value);
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleCityChange = (value) => {
    setCity(value);
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: "" }));
    }
  };

  const validateCheckoutForm = () => {
    const nextErrors = {};
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();

    if (!trimmedAddress) {
      nextErrors.address = "Address is required.";
    } else if (trimmedAddress.length < 5) {
      nextErrors.address = "Address should be at least 5 characters.";
    }

    if (!trimmedCity) {
      nextErrors.city = "City is required.";
    } else if (!CITY_REGEX.test(trimmedCity)) {
      nextErrors.city = "City can only include letters, spaces, apostrophes, and hyphens.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

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

    if (!validateCheckoutForm()) {
      return;
    }

    setLoading(true);

    try {
      const salesTransactions = cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        qtyPurchased: item.quantity,
        unitPrice: Number(item.sellPrice),
        total: Number((item.quantity * item.sellPrice).toFixed(2)),
      }));

      const payload = {
        customerName: userData.customerName,
        customerId: userData.id,
        customerEmail: userData.email,
        SODateTime: Date.now(),
        grandTotalPrice: Number(totalAmount.toFixed(2)),
        paymentMode: "cash_on_delivery",
        address: address.trim(),
        city: city.trim(),
        salesTransactions,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), payload);

      setCartItems([]);
      setShowSuccessModal(true);
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
            onChangeText={handleAddressChange}
          />
          {!!errors.address && <Text className="text-sm text-red-500">{errors.address}</Text>}
        </View>

        <View className="gap-2">
          <Text className="text-base font-medium text-gray-700">City</Text>
          <TextInput
            placeholder="Enter your city"
            className="px-4 py-3 border border-gray-300 rounded-lg"
            value={city}
            onChangeText={handleCityChange}
          />
          {!!errors.city && <Text className="text-sm text-red-500">{errors.city}</Text>}
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

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          router.replace("/");
        }}
      >
        <View className="items-center justify-center flex-1 px-6 bg-black/50">
          <View className="w-full max-w-sm p-6 bg-white rounded-2xl">
            <Text className="text-2xl font-semibold text-center text-gray-900">Thank you!</Text>
            <Text className="mt-2 text-base text-center text-gray-600">
              Your order was placed successfully. Redirecting you home...
            </Text>

            <TouchableOpacity
              className="py-3 mt-6 bg-blue-600 rounded-lg"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/");
              }}
            >
              <Text className="font-semibold text-center text-white">Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Checkout;
