import { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/productCard';
import {FontAwesome} from "@expo/vector-icons";
import FilterModal from '../../components/FilterModal';
import { fetchAllProducts } from '../../lib/firebaseProducts';

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
  const toggleFilterModal = () => {
    setOpenFilterModal(!openFilterModal);
  }
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

  const filterHandler = (filterData) => {
    setFilters((prev) => ({...prev, ...filterData}))
    setCurrentPage(1);
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="flex-row items-center w-10/12 gap-2">
          <View className="relative p-2">
          <FontAwesome name="search" size={16} color="gray" className="absolute top-4 left-4"/>
            <TextInput 
              className="px-4 py-2 pl-8 border border-gray-300 rounded-md" 
              placeholder="Search..."
              value={filters.search}
              onChangeText={(text) => setFilters((prev) => ({...prev, search: text}))}
            />
          </View>
          <TouchableOpacity onPress={toggleFilterModal} className="px-3 py-1 border border-blue-500 rounded-md">
            <Text className="text-lg font-semibold text-center text-blue-500">Filter</Text>
          </TouchableOpacity>
        </View>
        {products.length>0? (
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


