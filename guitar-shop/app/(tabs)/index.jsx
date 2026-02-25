import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from "expo-constants";
import ProductCard from '../../components/productCard';

const BASE_URL = Constants.expoConfig.extra.BASE_URL;
export default function App() {
  const [products, setProducts] = useState([]);
  const fetchProductData = () =>{
    fetch(`${BASE_URL}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProducts(data?.data ?? []))
      .catch((error) => console.log(error));
  }

  
  useEffect(()=>{
    fetchProductData()
    console.log(products);
  }, []);
  return (
    <SafeAreaView className="min-h-screen">
      <View className="flex-1 bg-white">
        <ProductCard product={products[0]}/>   
      </View>
    </SafeAreaView>
  );
}


