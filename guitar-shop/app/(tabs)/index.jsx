import { useEffect, useState } from 'react';
import { FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from "expo-constants";
import ProductCard from '../../components/productCard';
import {FontAwesome} from "@expo/vector-icons";
import FilterModal from '../../components/FilterModal';
import { objectToQueryString } from '../../lib/utils';
const configuredBaseUrl = Constants.expoConfig?.extra?.BASE_URL;

const trimTrailingSlash = (url) => url?.replace(/\/+$/, '');

const getCandidateBaseUrls = () => {
  const expoHostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri;
  const debuggerHost =
    Constants.expoConfig?.extra?.expoGo?.debuggerHost ||
    Constants.expoGoConfig?.debuggerHost;

  const hosts = [
    expoHostUri?.split(':')[0],
    debuggerHost?.split(':')[0],
  ].filter(Boolean);

  const platformFallbacks =
    Platform.OS === 'android'
      ? ['http://10.0.2.2:3001', 'http://127.0.0.1:3001', 'http://localhost:3001']
      : Platform.OS === 'ios'
        ? ['http://127.0.0.1:3001', 'http://localhost:3001']
        : ['http://localhost:3001', 'http://127.0.0.1:3001'];

  const candidateBaseUrls = [
    trimTrailingSlash(configuredBaseUrl),
    ...hosts.map((host) => `http://${host}:3001`),
    ...platformFallbacks,
  ].filter(Boolean);

  return [...new Set(candidateBaseUrls)];
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [activeBaseUrl, setActiveBaseUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({
    search: ""
  })
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const toggleFilterModal = () => {
    setOpenFilterModal(!openFilterModal);
  }
  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError('');
      const baseUrls = getCandidateBaseUrls();
      let lastErrorMessage = 'Unable to load products';
      const params = new URLSearchParams();
      if (debouncedSearch?.trim()) {
        params.set('search', debouncedSearch.trim());
      }
      const queryString = params.toString();

      for (const baseUrl of baseUrls) {
        try {
          const response = await fetch(
            `${baseUrl}/api/products${objectToQueryString(filters)? `?${objectToQueryString(filters)}` : ''}`
          );
          console.log('response:', response)
          if (!response.ok) {
            lastErrorMessage = `Request failed with status ${response.status}`;
            continue;
          }

          const data = await response.json();
          setProducts(data?.data ?? []);
          setActiveBaseUrl(baseUrl);
          return;
        } catch (networkError) {
          lastErrorMessage = networkError?.message || 'Network request failed';
        }
      }

      throw new Error(
        `${lastErrorMessage}. Platform: ${Platform.OS}. Tried: ${baseUrls.join(', ')}`
      );
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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  useEffect(()=>{
    fetchProductData()
  }, [debouncedSearch]);
  console.log(filters);
  const filterHandler = (filterData) => {
    setFilters((prev) => ({...prev, ...filterData}))
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
              onChangeText={(text) => setFilters({search: text})}
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
            <Text className="my-4 text-2xl font-bold text-center">Products</Text>
          }
          renderItem={({ item }) => (
            <ProductCard product={item} backendBaseUrl={activeBaseUrl} />
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


