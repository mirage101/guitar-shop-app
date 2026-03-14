import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import ProductCard from "../../components/productCard";
import { fetchAllProducts } from "../../lib/firebaseProducts";

const ProductTypeDetails = () => {
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizedTypeId = useMemo(() => String(id || "").trim(), [id]);

  useEffect(() => {
    const fetchTypeProducts = async () => {
      if (!normalizedTypeId) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const allProducts = await fetchAllProducts();
        const matchingProducts = allProducts.filter((product) => {
          const typeId = String(product?.productType?.id ?? product?.productTypeId ?? "");
          return typeId === normalizedTypeId;
        });

        setProducts(matchingProducts);
      } catch (fetchError) {
        setError(fetchError?.message || "Unable to load products for this type.");
      } finally {
        setLoading(false);
      }
    };

    fetchTypeProducts();
  }, [normalizedTypeId]);

  const typeName = products[0]?.productType?.name || "Product Type";

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 px-6 bg-white">
        <Text className="text-lg font-semibold text-center text-gray-800">Failed to load type products</Text>
        <Text className="mt-2 text-center text-gray-500">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4">
        <Text className="text-3xl font-semibold">{typeName}</Text>
        <Text className="mt-1 text-gray-500">Products in this category</Text>
      </View>

      {products.length ? (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProductCard product={item} />}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <View className="items-center justify-center flex-1 px-6">
          <Text className="text-lg font-semibold text-center text-gray-800">No products found for this type.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProductTypeDetails;
