import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/productCard';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FilterModal from '../../components/FilterModal';
import { fetchAllProducts, fetchProductTypeOptions } from '../../lib/firebaseProducts';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    search: "",
    productTypeId: "all",
    sortBy: "all",
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
      const normalizedOptions = (options || []).filter(Boolean);
      const nonAllOptions = normalizedOptions.filter(
        (option) => String(option?.value).toLowerCase() !== "all"
      );

      setProductTypeOptions([{ value: 'all', label: 'All' }, ...nonAllOptions]);
    } catch (typeError) {
      setProductTypeOptions([{ value: 'all', label: 'All' }]);
    }
  };
  const fetchProductData = async ({ forceServer = false, isRefresh = false } = {}) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError('');
      const allProducts = await fetchAllProducts({ forceServer });

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

      setProducts(filteredProducts);
    } catch (fetchError) {
      setError(fetchError?.message || 'Unable to load products');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // console.log(products);
  
  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  useEffect(()=>{
    fetchProductData()
  }, [debouncedSearch, filters.productTypeId, filters.sortBy, filters.minPrice, filters.maxPrice, filters.inStock]);

  useEffect(() => {
    fetchTypeOptions();
  }, []);

  const getTypeIconName = (label) => {
    const normalizedLabel = String(label || "").toLowerCase();

    if (normalizedLabel.includes("all")) {
      return "view-grid";
    }

    if (normalizedLabel.includes("electric") || normalizedLabel.includes("lectric")) {
      return "guitar-electric";
    }

    if (normalizedLabel.includes("bass")) {
      return "guitar-pick-outline";
    }

    if (normalizedLabel.includes("classical")) {
      return "music-clef-treble";
    }

    if (normalizedLabel.includes("ukulele")) {
      return "music-note-outline";
    }

    if (normalizedLabel.includes("luthier")) {
      return "tools";
    }

    if (normalizedLabel.includes("acoustic")) {
      return "guitar-acoustic";
    }

    return "tag-outline";
  };

  const filterHandler = (filterData) => {
    setFilters((prev) => ({...prev, ...filterData}))
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProductData({ forceServer: true, isRefresh: true });
  };

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
          

          <View className="flex-row items-center justify-between px-0 mb-4">
            <View className="mb-4 overflow-hidden bg-blue-50 rounded-2xl">
           <Image
              source={require("../../assets/guitar-logo.png")}
                className="self-center w-10 h-10"
              resizeMode="cover"
            />
          </View>
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
              <MaterialCommunityIcons name="filter-variant" size={20} color="#3B82F6" />
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
                    isSelected ? "bg-blue-50 border-blue-500" : "bg-white border-gray-300"
                  }`}
                  onPress={() => {
                    setFilters((prev) => ({ ...prev, productTypeId: option.value }));
                    setOpenTypeDropdown(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name={getTypeIconName(option.label)}
                    size={22}
                    color={isSelected ? "#1D4ED8" : "#374151"}
                  />
                  <Text
                    className={`mt-1 text-xs text-center ${
                      isSelected ? "text-blue-700 font-semibold" : "text-gray-700"
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
          <MaterialCommunityIcons name="magnify" size={18} color="gray" className="absolute top-4 left-4"/>
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
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            <Text className="my-4 text-2xl font-bold text-center">Our Guitars</Text>
          }
          renderItem={({ item }) => (
            <ProductCard product={item} />
          )}
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


