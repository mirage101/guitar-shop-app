
import {TouchableOpacity, Modal, Text, View, Pressable} from "react-native";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

const configuredBaseUrl = Constants.expoConfig?.extra?.BASE_URL;
const CategoryOptions=[
    {value:'all', label: 'All'},
    {value:'acoustic guitars', label: 'Acoustic Guitars'},
    {value:'electric guitars', label: 'Electric Guitars'},
    {value:'classical guitars', label: 'Classical guitars'},
    {value:'bass guitars', label: 'Bass Guitars'},
    {value:'ukulele', label: 'Ukulele'},
    {value:'luthier instruments', label: 'Luthier instruments'},
]

const SortingOptions = [
    {value: "all", label:"All"},
    {value: "-sellPrice", label: "Price high to low"},
    {value: "sellPrice", label: "Price low to high"},
]

const RatingOptions = [
    {value: "all", label:"All"},
    {value: "1", label:"1"},
    {value: "2", label:"2"},
    {value: "3", label:"3"},
    {value: "4", label:"4"},
    {value: "5", label:"5"},
]

const AvailabilityOptions = [
    {value: "all", label: "All"},
    {value: "true", label: "In Stock"},
    {value: "false", label: "Out of Stock"},
]
const FilterModal = ({openFilterModal, toggleFilterModal, filterHandler}) =>{
    const [productTypes, setProductsTypes] = useState([])
    const [filters, setFilters] = useState({
        productTypeId: "all",
        sortBy: "all",
        rating: "all",
        inStock: "all"
    });

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev, 
            [filterName]: value
        }));
    }
    const fetchProductTypes = async () => {
  try {
    console.log("BASE_URL:", configuredBaseUrl);

    const res = await fetch(`${configuredBaseUrl}/api/products/product-type`);
    console.log("status:", res.status);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} - ${text}`);
    }

    const data = await res.json();
    const modifiedData = (data?.data || []).map((item) => ({
      label: item.name,
      value: item.id,
    }));

    setProductsTypes([{ value: "all", label: "All" }, ...modifiedData]);
  } catch (error) {
    console.log("fetchProductTypes error:", error);
  }
};

console.log(filters)

    useEffect(() => {
        fetchProductTypes();
    }, []);

    const handleApplyFilters = () =>{
       filterHandler(filters);
        toggleFilterModal();
    }

    const handleResetFilters = () =>{
        setFilters({
            productTypeId: "all",
            sortBy:"all",
            rating: "all",
            inStock: "all"
        })
    }
    return (
        <Modal visible={openFilterModal} transparent={true} onRequestClose={toggleFilterModal} animationType="slide">
            <View className="w-full h-full p-10 mt-16 bg-white shadow-lg">
                <Text className="my-4 text-2xl font-semibold text-center">Filters</Text>
                <View className="mb-4">
                    <Text className="my-4 text-xl font-semibold">Category</Text>
                    <View className="flex-row flex-wrap gap-3">
                    {productTypes.map((option, index)=>(
                       <Pressable 
                            onPress={() => handleFilterChange("productTypeId", option.value)} 
                            key={index} 
                            className={cn("px-4 py-2 border border-gray-300 rounded-lg",                       filters.productTypeId === option.value && "bg-blue-500 border-blue-500"
                            )}
                        >
                            <Text className={cn(filters.productTypeId === option.value && "text-white font-medium")}>{option.label}</Text>
                        </Pressable>
                    ))}
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="my-4 text-xl font-semibold">Sort By</Text>
                    <View className="flex-row flex-wrap gap-3">
                    {SortingOptions.map((option, index)=>(
                       <Pressable onPress={() => handleFilterChange("sortBy", option.value)}  key={index} className={cn("px-4 py-2 border border-gray-300 rounded-lg",                       filters.sortBy === option.value && "bg-blue-500 border-blue-500"
                            )}>
                            <Text className={cn(filters.sortBy === option.value && "text-white font-medium")}>{option.label}</Text>
                        </Pressable>
                    ))}
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="my-4 text-xl font-semibold">Rating</Text>
                    <View className="flex-row flex-wrap gap-3">
                    {RatingOptions.map((option, index)=>(
                       <Pressable onPress={() => handleFilterChange("rating", option.value)}  key={index} className={cn("px-4 py-2 border border-gray-300 rounded-lg",                       filters.rating === option.value && "bg-blue-500 border-blue-500"
                            )}>
                            <Text className={cn(filters.rating === option.value && "text-white font-medium")}>{option.label}</Text>
                        </Pressable>
                    ))}
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="my-4 text-xl font-semibold">Availability</Text>
                    <View className="flex-row flex-wrap gap-3">
                    {AvailabilityOptions.map((option, index)=>(
                       <Pressable onPress={() => handleFilterChange("inStock", option.value)}  key={index} className={cn("px-4 py-2 border border-gray-300 rounded-lg",                       filters.inStock === option.value && "bg-blue-500 border-blue-500"
                            )}>
                            <Text className={cn(filters.inStock === option.value && "text-white font-medium")}>{option.label}</Text>
                        </Pressable>
                    ))}
                    </View>
                </View>
                  
                    <View className="flex-row gap-3">
                         <TouchableOpacity onPress={handleApplyFilters} className="px-3 py-1 bg-blue-500 border border-blue-500 rounded-md w-full max-w-[180px]">
                        <Text className="text-lg font-semibold text-center text-white">Apply</Text>
                    </TouchableOpacity>
                     <TouchableOpacity onPress={handleResetFilters} className="px-3 py-1 border border-blue-500 rounded-md  w-full max-w-[180px]">
                        <Text className="text-lg font-semibold text-center text-blue-500">Reset</Text>
                    </TouchableOpacity>
                    </View>
            </View>
        </Modal>
    )
}

export default FilterModal;