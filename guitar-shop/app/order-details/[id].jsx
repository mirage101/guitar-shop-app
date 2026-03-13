import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserContext } from "../../components/UserContext";

const OrderDetails = () => {
  const { id } = useLocalSearchParams();
  const { userData } = useUserContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reordering, setReordering] = useState(false);

  const getOrderTimestamp = (orderData) => {
    if (typeof orderData?.SODateTime === "number") {
      return orderData.SODateTime;
    }

    if (orderData?.createdAt?.toMillis) {
      return orderData.createdAt.toMillis();
    }

    return 0;
  };

  const statusStyles = useMemo(() => {
    const normalizedStatus = (order?.status || "pending").toLowerCase();

    if (normalizedStatus === "delivered") {
      return {
        container: "bg-green-100",
        text: "text-green-700",
        label: "Delivered",
      };
    }

    if (normalizedStatus === "cancelled") {
      return {
        container: "bg-red-100",
        text: "text-red-700",
        label: "Cancelled",
      };
    }

    return {
      container: "bg-amber-100",
      text: "text-amber-700",
      label: "Pending",
    };
  }, [order?.status]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!userData?.id) {
          Alert.alert("Error", "Please login first.");
          router.replace("/login");
          return;
        }

        if (!id || Array.isArray(id)) {
          Alert.alert("Error", "Invalid order id.");
          router.back();
          return;
        }

        const orderRef = doc(db, "orders", id);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          Alert.alert("Error", "Order not found.");
          router.back();
          return;
        }

        const fetchedOrder = { id: orderSnap.id, ...orderSnap.data() };

        if (fetchedOrder.customerId !== userData.id) {
          Alert.alert("Error", "You cannot view this order.");
          router.back();
          return;
        }

        setOrder(fetchedOrder);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Unable to fetch order details. Please try again.");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, userData?.id]);

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text className="text-lg font-medium text-gray-700">Order details are not available.</Text>
      </SafeAreaView>
    );
  }

  const handleReorder = async () => {
    const transactions = order.salesTransactions || [];

    if (!transactions.length) {
      Alert.alert("Error", "No items found to reorder.");
      return;
    }

    const salesTransactions = transactions
      .map((transaction) => {
        const quantity = Number(transaction.qtyPurchased ?? 1);
        const fallbackUnitPrice = quantity > 0 ? Number(transaction.total ?? 0) / quantity : 0;
        const unitPrice = Number(transaction.unitPrice ?? fallbackUnitPrice);
        const lineTotal = Number((quantity * unitPrice).toFixed(2));

        return {
          productId: String(transaction.productId || ""),
          productName: transaction.productName || "Product",
          qtyPurchased: quantity,
          unitPrice,
          total: lineTotal,
        };
      })
      .filter((transaction) => transaction.productId);

    if (!salesTransactions.length) {
      Alert.alert("Error", "Unable to prepare reorder items.");
      return;
    }

    setReordering(true);

    try {
      const grandTotalPrice = salesTransactions.reduce(
        (runningTotal, transaction) => runningTotal + Number(transaction.total || 0),
        0
      );

      const payload = {
        customerName: userData.customerName,
        customerId: userData.id,
        customerEmail: userData.email,
        SODateTime: Date.now(),
        grandTotalPrice: Number(grandTotalPrice.toFixed(2)),
        paymentMode: order.paymentMode || "cash_on_delivery",
        address: order.address || userData.address || "",
        city: order.city || userData.city || "",
        salesTransactions,
        status: "pending",
        sourceOrderId: order.id,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), payload);
      setShowReorderModal(false);
      router.replace("/orders");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to reorder. Please try again.");
    } finally {
      setReordering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-6 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</Text>
          <View className={`px-3 py-1 rounded-full ${statusStyles.container}`}>
            <Text className={`text-xs font-semibold ${statusStyles.text}`}>{statusStyles.label}</Text>
          </View>
        </View>

        <View className="p-4 mt-4 border border-gray-200 rounded-xl">
          <Text className="text-gray-700">Date: {new Date(getOrderTimestamp(order)).toLocaleString()}</Text>
          <Text className="mt-1 text-gray-700">Payment: {order.paymentMode || "-"}</Text>
          <Text className="mt-1 text-gray-700">Customer: {order.customerName || "-"}</Text>
          <Text className="mt-1 text-gray-700">Email: {order.customerEmail || "-"}</Text>
          <Text className="mt-1 text-gray-700">
            Address: {order.address || "No address provided"}
            {order.city ? `, ${order.city}` : ""}
          </Text>
        </View>

        <Text className="mt-6 text-xl font-semibold text-gray-900">Items</Text>
        {(order.salesTransactions || []).map((transaction, index) => (
          <View key={`${order.id}-line-${index}`} className="flex-row justify-between py-3 border-b border-gray-200">
            <View>
              <Text className="font-medium text-gray-900">{transaction.productName}</Text>
              <Text className="text-sm text-gray-600">Qty: {transaction.qtyPurchased}</Text>
              <Text className="text-sm text-gray-600">Unit: ${Number(transaction.unitPrice).toFixed(2)}</Text>
            </View>
            <Text className="font-semibold text-gray-900">${Number(transaction.total).toFixed(2)}</Text>
          </View>
        ))}

        <View className="items-end mt-5">
          <Text className="text-2xl font-bold text-gray-900">
            Total: ${Number(order.grandTotalPrice).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity className="py-3 mt-6 bg-blue-600 rounded-xl" onPress={() => setShowReorderModal(true)}>
          <Text className="font-semibold text-center text-white">Reorder</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showReorderModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!reordering) {
            setShowReorderModal(false);
          }
        }}
      >
        <View className="items-center justify-center flex-1 px-6 bg-black/50">
          <View className="w-full max-w-sm p-6 bg-white rounded-2xl">
            <Text className="text-xl font-semibold text-center text-gray-900">Confirm Reorder</Text>
            <Text className="mt-2 text-center text-gray-600">
              This will place the same items as a new order. Continue?
            </Text>

            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                className="flex-1 py-3 bg-gray-200 rounded-lg"
                onPress={() => setShowReorderModal(false)}
                disabled={reordering}
              >
                <Text className="font-semibold text-center text-gray-700">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 py-3 bg-blue-600 rounded-lg"
                onPress={handleReorder}
                disabled={reordering}
              >
                <Text className="font-semibold text-center text-white">
                  {reordering ? "Placing..." : "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default OrderDetails;
