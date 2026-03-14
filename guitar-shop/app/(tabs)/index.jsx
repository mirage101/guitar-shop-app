import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/productCard';
import {FontAwesome} from "@expo/vector-icons";
import FilterModal from '../../components/FilterModal';
import { fetchAllProducts, fetchProductTypeOptions } from '../../lib/firebaseProducts';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [filters, setFilters] = useState({
    search: "",
    productTypeId: "all",
    sortBy: "all",
    rating: "all",
    inStock: "all"
  })
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [productTypeOptions, setProductTypeOptions] = useState([{ value: 'all', label: 'All' }]);
  const [openTypeDropdown, setOpenTypeDropdown] = useState(false);
  const toggleFilterModal = () => {
    setOpenFilterModal(!openFilterModal);
  }

  const fetchTypeOptions = async () => {
    try {
      const options = await fetchProductTypeOptions();
      setProductTypeOptions(options.length ? options : [{ value: 'all', label: 'All' }]);
    } catch (typeError) {
      setProductTypeOptions([{ value: 'all', label: 'All' }]);
    }
  };
  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError('');
      const allProducts = await fetchAllProducts();

      const filteredProducts = allProducts
        .filter((product) => {
          if (!debouncedSearch) {
            return true;
          }

          const normalizedSearch = debouncedSearch.toLowerCase();
          return (
            product?.name?.toLowerCase().includes(normalizedSearch) ||
            product?.description?.toLowerCase().includes(normalizedSearch)
          );
        })
        .filter((product) => {
          if (filters.productTypeId === "all") {
            return true;
          }

          const typeId = String(product?.productType?.id ?? product?.productTypeId ?? "");
          const typeName = String(product?.productType?.name ?? "").toLowerCase();
          const selectedType = String(filters.productTypeId).toLowerCase();

          return typeId === String(filters.productTypeId) || typeName === selectedType;
        })
        .filter((product) => {
          if (filters.rating === "all") {
            return true;
          }

          return Number(product?.rating ?? 0) >= Number(filters.rating);
        })
        .filter((product) => {
          if (filters.inStock === "all") {
            return true;
          }

          if (filters.inStock === "true") {
            return Number(product?.currentStock ?? 0) > 0;
          }

          return Number(product?.currentStock ?? 0) <= 0;
        })
        .sort((firstProduct, secondProduct) => {
          if (filters.sortBy === "sellPrice") {
            return Number(firstProduct.sellPrice) - Number(secondProduct.sellPrice);
          }

          if (filters.sortBy === "-sellPrice") {
            return Number(secondProduct.sellPrice) - Number(firstProduct.sellPrice);
          }

          return 0;
        });

      const calculatedTotalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
      const safePage = Math.min(currentPage, calculatedTotalPages);
      const startIndex = (safePage - 1) * pageSize;

      if (safePage !== currentPage) {
        setCurrentPage(safePage);
      }

      setProducts(filteredProducts.slice(startIndex, startIndex + pageSize));
      setTotalPages(calculatedTotalPages);
    } catch (fetchError) {
      setError(fetchError?.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  // console.log(products);
  
  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  useEffect(()=>{
    fetchProductData()
  }, [debouncedSearch, currentPage, filters.productTypeId, filters.sortBy, filters.minPrice, filters.maxPrice, filters.rating, filters.inStock]);

  useEffect(() => {
    fetchTypeOptions();
  }, []);

  const getTypeIconName = (label) => {
    const normalizedLabel = String(label || "").toLowerCase();

    if (normalizedLabel.includes("all")) {
      return "th-large";
    }

    if (normalizedLabel.includes("electric")) {
      return "bolt";
    }

    if (normalizedLabel.includes("bass")) {
      return "headphones";
    }

    if (normalizedLabel.includes("classical")) {
      return "book";
    }

    if (normalizedLabel.includes("ukulele")) {
      return "smile-o";
    }

    if (normalizedLabel.includes("luthier")) {
      return "wrench";
    }

    return "music";
  };

  const selectedTypeLabel = productTypeOptions.find((option) => option.value === filters.productTypeId)?.label || 'All';

  const filterHandler = (filterData) => {
    setFilters((prev) => ({...prev, ...filterData}))
    setCurrentPage(1);
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        {openTypeDropdown ? (
          <Pressable
            className="absolute top-0 bottom-0 left-0 right-0 z-10"
            onPress={() => setOpenTypeDropdown(false)}
          />
        ) : null}
        <View className="px-4 pt-3">
          <View className="mb-4 overflow-hidden bg-blue-50 rounded-2xl">
           <Image
              source={require("../../assets/mrn-logo.png")}
              className="self-center w-6 h-6"
              resizeMode="cover"
            />
          </View>

          <View className="flex-row items-center justify-between px-1 mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-900">Guitar Shop</Text>
              <Text className="text-sm text-gray-500">Find your next sound</Text>
            </View>
            <TouchableOpacity
              onPress={toggleFilterModal}
              className="items-center justify-center w-10 h-10 border border-blue-500 rounded-full"
              accessibilityRole="button"
              accessibilityLabel="Open filters"
            >
              <FontAwesome name="sliders" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <Text className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">Browse by type</Text>
          <ScrollView
            horizontal
            nestedScrollEnabled
            directionalLockEnabled
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8 }}
            className="mb-3"
          >
            {productTypeOptions.map((option) => {
              const isSelected = option.value === filters.productTypeId;

              return (
                <TouchableOpacity
                  key={option.value}
                  className={`items-center justify-center px-3 py-2 mr-2 border rounded-xl min-w-[84px] ${
                    isSelected ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
                  }`}
                  onPress={() => {
                    setFilters((prev) => ({ ...prev, productTypeId: option.value }));
                    setCurrentPage(1);
                    setOpenTypeDropdown(false);
                  }}
                >
                  <FontAwesome
                    name={getTypeIconName(option.label)}
                    size={16}
                    color={isSelected ? "white" : "#374151"}
                  />
                  <Text
                    className={`mt-1 text-xs text-center ${
                      isSelected ? "text-white font-semibold" : "text-gray-700"
                    }`}
                    numberOfLines={2}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View className="relative w-full">
          <FontAwesome name="search" size={16} color="gray" className="absolute top-4 left-4"/>
            <TextInput 
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md" 
              placeholder="Search..."
              value={filters.search}
              onChangeText={(text) => setFilters((prev) => ({...prev, search: text}))}
            />
          </View>
        </View>
        {loading ? (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View className="items-center justify-center flex-1 px-6">
            <Text className="text-lg font-semibold text-center text-gray-800">Unable to load products</Text>
            <Text className="mt-2 text-center text-gray-500">{error}</Text>
            <TouchableOpacity
              className="px-4 py-2 mt-4 bg-blue-600 rounded-md"
              onPress={fetchProductData}
            >
              <Text className="font-semibold text-white">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : products.length>0 ? (
          <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          data={products}
          ListHeaderComponent={
            <Text className="my-4 text-2xl font-bold text-center">Our Guitars</Text>
          }
          renderItem={({ item }) => (
            <ProductCard product={item} />
          )}
          ListFooterComponent={
           products.length > 6 ? (<View className="flex-row items-center justify-center gap-4 mt-6">
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
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
        />
        ): (
          <View className="items-center justify-center flex-1">
            <Text className="text-lg font-semibold">No Products found.</Text>
          </View>
        )}        
      </View>
      <FilterModal openFilterModal={openFilterModal} toggleFilterModal={toggleFilterModal} filterHandler={filterHandler}/>
    </SafeAreaView>
  );
}


