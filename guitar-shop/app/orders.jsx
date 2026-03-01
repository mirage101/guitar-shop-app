import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { getToken } from "../lib/authStorage";

const BASE_URL = Constants.expoConfig.extra.BASE_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  const removeOrder = async (orderId) => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Error", "Please login first.");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data?.message || "Unable to remove order.");
        return;
      }

      Alert.alert("Success", data?.message || "Order removed successfully.");

      if (orders.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchOrders(currentPage);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to remove order. Please try again.");
    }
  };

  const fetchOrders = async (page = currentPage) => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Error", "Please login first.");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/orders?page=${page}&limit=${pageSize}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data?.message || "Unable to fetch orders.");
        return;
      }

      setOrders(data?.data || []);
      setTotalPages(Math.max(1, data?.meta?.totalPages || 1));
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-8 bg-white">
      <Text className="mb-4 text-3xl font-semibold">My Orders</Text>
      {orders.length === 0 ? (
        <View className="items-center justify-center flex-1">
          <Text className="text-xl font-medium">No orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            orders.length > 3 ? (
            <View className="flex-row items-center justify-center gap-4 mt-4 mb-10">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-200 rounded-md"
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <Text className="font-semibold text-gray-700">Previous</Text>
              </TouchableOpacity>

              <Text className="font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </Text>

              <TouchableOpacity
                className="px-4 py-2 bg-gray-200 rounded-md"
                disabled={currentPage >= totalPages}
                onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                <Text className="font-semibold text-gray-700">Next</Text>
              </TouchableOpacity>
            </View>) : ""
          }
          renderItem={({ item }) => (
            <View className="p-4 mb-4 border border-gray-300 rounded-lg">
              <Text className="text-lg font-semibold">Order #{item.id.slice(0, 8)}</Text>
              <Text className="text-gray-600">Date: {new Date(item.SODateTime).toLocaleString()}</Text>
              <Text className="text-gray-600">Payment: {item.paymentMode}</Text>
              <Text className="text-lg font-semibold">Total: ${Number(item.grandTotalPrice).toFixed(2)}</Text>

              <View className="mt-3">
                {item.salesTransactions.map((transaction) => (
                  <View key={transaction.id} className="flex-row justify-between py-1">
                    <Text className="text-gray-700">
                      {transaction.productName} x {transaction.qtyPurchased}
                    </Text>
                    <Text className="text-gray-700">${Number(transaction.total).toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                className="px-4 py-2 mt-3 bg-red-600 rounded-lg"
                onPress={() =>
                  Alert.alert("Remove Order", "Are you sure you want to remove this order?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Remove",
                      style: "destructive",
                      onPress: () => removeOrder(item.id),
                    },
                  ])
                }
              >
                <Text className="font-semibold text-center text-white">Remove Order</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Orders;
