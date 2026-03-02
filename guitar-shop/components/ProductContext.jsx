import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const CART_ITEMS_KEY = "cartItems";
const isWeb = Platform.OS === "web";

const defaultProductContextValue = {
    cartItems: [],
    addProductToCart: () => {},
    removeProductFromCart: () => {},
    setCartItems: () => {},
    increaseQuantity: () => {},
    decreaseQuantity: () => {},
    totalAmount: 0,
};

export const ProductContext = createContext(defaultProductContextValue);

export const ProductProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartHydrated, setIsCartHydrated] = useState(false);

    useEffect(() => {
        const hydrateCart = async () => {
            try {
                const storedCartItems = isWeb
                    ? localStorage.getItem(CART_ITEMS_KEY)
                    : await SecureStore.getItemAsync(CART_ITEMS_KEY);

                if (storedCartItems) {
                    setCartItems(JSON.parse(storedCartItems));
                }
            } catch (error) {
                console.log("Cart hydrate error:", error);
            } finally {
                setIsCartHydrated(true);
            }
        };

        hydrateCart();
    }, []);

    useEffect(() => {
        const persistCart = async () => {
            if (!isCartHydrated) {
                return;
            }

            try {
                const serializedCartItems = JSON.stringify(cartItems);

                if (isWeb) {
                    localStorage.setItem(CART_ITEMS_KEY, serializedCartItems);
                    return;
                }

                await SecureStore.setItemAsync(CART_ITEMS_KEY, serializedCartItems);
            } catch (error) {
                console.log("Cart persist error:", error);
            }
        };

        persistCart();
    }, [cartItems, isCartHydrated]);

    const addProductToCart = (newProduct) => {
        setCartItems((prevProducts) => [...prevProducts, newProduct]);
    }

    const removeProductFromCart = (productId) => {
        setCartItems((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    }

    const increaseQuantity = (productId) => {
        setCartItems((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId
                    ? { ...product, quantity: product.quantity + 1 }
                    : product
            )
        );
    }

    const decreaseQuantity = (productId) => {
        setCartItems((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId
                    ? { ...product, quantity: product.quantity - 1 }
                    : product
            )
        );
    }

    const totalAmount = cartItems.reduce((total, item) => {
        return total + item.quantity * item.sellPrice
    }, 0);

    return (
        <ProductContext.Provider
            value={{
                cartItems,
                addProductToCart,
                removeProductFromCart,
                setCartItems,
                increaseQuantity,
                decreaseQuantity,
                totalAmount,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export const useProductContext = () => {
    return useContext(ProductContext);
}