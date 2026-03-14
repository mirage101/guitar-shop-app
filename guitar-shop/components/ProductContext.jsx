import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const CART_ITEMS_KEY = "cartItems";
const WISHLIST_ITEMS_KEY = "wishlistItems";
const DEAL_ALERTS_KEY = "dealAlertSettings";
const isWeb = Platform.OS === "web";

const defaultProductContextValue = {
    cartItems: [],
    addProductToCart: () => {},
    removeProductFromCart: () => {},
    setCartItems: () => {},
    increaseQuantity: () => {},
    decreaseQuantity: () => {},
    wishlistItems: [],
    toggleWishlistItem: () => {},
    isWishlisted: () => false,
    dealAlertSettings: {},
    toggleDealAlert: () => {},
    isDealAlertEnabled: () => false,
    markDealAlertNotified: () => {},
    syncWishlistItemsFromCatalog: () => {},
    totalAmount: 0,
};

export const ProductContext = createContext(defaultProductContextValue);

export const ProductProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [dealAlertSettings, setDealAlertSettings] = useState({});
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
        const hydrateWishlist = async () => {
            try {
                const storedWishlistItems = isWeb
                    ? localStorage.getItem(WISHLIST_ITEMS_KEY)
                    : await SecureStore.getItemAsync(WISHLIST_ITEMS_KEY);

                if (storedWishlistItems) {
                    setWishlistItems(JSON.parse(storedWishlistItems));
                }
            } catch (error) {
                console.log("Wishlist hydrate error:", error);
            }
        };

        hydrateWishlist();
    }, []);

    useEffect(() => {
        const hydrateDealAlerts = async () => {
            try {
                const storedDealAlertSettings = isWeb
                    ? localStorage.getItem(DEAL_ALERTS_KEY)
                    : await SecureStore.getItemAsync(DEAL_ALERTS_KEY);

                if (storedDealAlertSettings) {
                    setDealAlertSettings(JSON.parse(storedDealAlertSettings));
                }
            } catch (error) {
                console.log("Deal alerts hydrate error:", error);
            }
        };

        hydrateDealAlerts();
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

    useEffect(() => {
        const persistWishlist = async () => {
            try {
                const serializedWishlistItems = JSON.stringify(wishlistItems);

                if (isWeb) {
                    localStorage.setItem(WISHLIST_ITEMS_KEY, serializedWishlistItems);
                    return;
                }

                await SecureStore.setItemAsync(WISHLIST_ITEMS_KEY, serializedWishlistItems);
            } catch (error) {
                console.log("Wishlist persist error:", error);
            }
        };

        persistWishlist();
    }, [wishlistItems]);

    useEffect(() => {
        const persistDealAlerts = async () => {
            try {
                const serializedDealAlertSettings = JSON.stringify(dealAlertSettings);

                if (isWeb) {
                    localStorage.setItem(DEAL_ALERTS_KEY, serializedDealAlertSettings);
                    return;
                }

                await SecureStore.setItemAsync(DEAL_ALERTS_KEY, serializedDealAlertSettings);
            } catch (error) {
                console.log("Deal alerts persist error:", error);
            }
        };

        persistDealAlerts();
    }, [dealAlertSettings]);

    const getProductId = (product) => {
        const resolvedId = product?.id ?? product?.productId ?? product?._id;
        return resolvedId === undefined || resolvedId === null ? "" : String(resolvedId);
    };

    const addProductToCart = (newProduct) => {
        if (!newProduct?.id) {
            return;
        }

        setCartItems((prevProducts) => {
            const existingProductIndex = prevProducts.findIndex(
                (product) => String(product.id) === String(newProduct.id)
            );

            if (existingProductIndex === -1) {
                return [
                    ...prevProducts,
                    {
                        ...newProduct,
                        quantity: Number(newProduct.quantity ?? 1),
                    },
                ];
            }

            return prevProducts.map((product, index) => {
                if (index !== existingProductIndex) {
                    return product;
                }

                return {
                    ...product,
                    quantity: Number(product.quantity ?? 0) + Number(newProduct.quantity ?? 1),
                };
            });
        });
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

    const toggleWishlistItem = (product) => {
        const productId = getProductId(product);

        if (!productId) {
            return;
        }

        setWishlistItems((prevItems) => {
            const alreadyExists = prevItems.some(
                (item) => getProductId(item) === productId
            );

            if (alreadyExists) {
                setDealAlertSettings((prevSettings) => {
                    if (!prevSettings[productId]) {
                        return prevSettings;
                    }

                    const nextSettings = { ...prevSettings };
                    delete nextSettings[productId];
                    return nextSettings;
                });

                return prevItems.filter((item) => getProductId(item) !== productId);
            }

            return [...prevItems, { ...product, id: product?.id ?? productId }];
        });
    };

    const isWishlisted = (productId) => {
        const normalizedId = String(productId ?? "");
        if (!normalizedId) {
            return false;
        }

        return wishlistItems.some((item) => getProductId(item) === normalizedId);
    };

    const toggleDealAlert = (product) => {
        const productId = String(product?.id || "");

        if (!productId) {
            return;
        }

        setDealAlertSettings((prevSettings) => {
            if (prevSettings[productId]?.enabled) {
                const nextSettings = { ...prevSettings };
                delete nextSettings[productId];
                return nextSettings;
            }

            return {
                ...prevSettings,
                [productId]: {
                    enabled: true,
                    baselinePrice: Number(product?.sellPrice ?? 0),
                    lastNotifiedPrice: null,
                    productName: product?.name || "Product",
                },
            };
        });
    };

    const isDealAlertEnabled = (productId) => {
        return Boolean(dealAlertSettings[String(productId)]?.enabled);
    };

    const markDealAlertNotified = (productId, newPrice) => {
        const normalizedProductId = String(productId || "");

        if (!normalizedProductId) {
            return;
        }

        setDealAlertSettings((prevSettings) => {
            if (!prevSettings[normalizedProductId]) {
                return prevSettings;
            }

            return {
                ...prevSettings,
                [normalizedProductId]: {
                    ...prevSettings[normalizedProductId],
                    lastNotifiedPrice: Number(newPrice),
                },
            };
        });
    };

    const syncWishlistItemsFromCatalog = (catalogMap) => {
        if (!catalogMap || typeof catalogMap.get !== "function") {
            return;
        }

        setWishlistItems((prevItems) =>
            prevItems.map((item) => {
                const liveProduct = catalogMap.get(String(item.id));
                return liveProduct ? { ...item, ...liveProduct } : item;
            })
        );
    };

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
                wishlistItems,
                toggleWishlistItem,
                isWishlisted,
                dealAlertSettings,
                toggleDealAlert,
                isDealAlertEnabled,
                markDealAlertNotified,
                syncWishlistItemsFromCatalog,
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