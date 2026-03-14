import { useCallback } from "react";
import { FlatList, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import ProductCard from "../components/productCard";
import { useProductContext } from "../components/ProductContext";
import { fetchAllProducts } from "../lib/firebaseProducts";
import { ensureNotificationPermission, sendDealNotification } from "../lib/notifications";
import Animated, { FadeOutLeft, LinearTransition } from "react-native-reanimated";

const Wishlist = () => {
  const {
    wishlistItems,
    dealAlertSettings,
    toggleDealAlert,
    isDealAlertEnabled,
    markDealAlertNotified,
    syncWishlistItemsFromCatalog,
  } = useProductContext();

  const checkDealAlerts = useCallback(async () => {
    if (!wishlistItems.length) {
      return;
    }

    const watchedIds = Object.keys(dealAlertSettings || {}).filter(
      (productId) => dealAlertSettings[productId]?.enabled
    );

    const allProducts = await fetchAllProducts();
    const productById = new Map(allProducts.map((product) => [String(product.id), product]));
    syncWishlistItemsFromCatalog(productById);

    if (!watchedIds.length) {
      return;
    }

    for (const productId of watchedIds) {
      const settings = dealAlertSettings[productId];
      const liveProduct = productById.get(String(productId));

      if (!settings || !liveProduct) {
        continue;
      }

      const currentPrice = Number(liveProduct.sellPrice ?? 0);
      const baselinePrice = Number(settings.baselinePrice ?? 0);
      const lastNotifiedPrice = settings.lastNotifiedPrice;
      const shouldNotify =
        currentPrice < baselinePrice &&
        (lastNotifiedPrice === null || Number(currentPrice) < Number(lastNotifiedPrice));

      if (!shouldNotify) {
        continue;
      }

      await sendDealNotification({
        productName: liveProduct.name || settings.productName || "Product",
        oldPrice: baselinePrice,
        newPrice: currentPrice,
      });

      markDealAlertNotified(productId, currentPrice);
    }
  }, [dealAlertSettings, wishlistItems, markDealAlertNotified, syncWishlistItemsFromCatalog]);

  useFocusEffect(
    useCallback(() => {
      checkDealAlerts().catch((error) => {
        console.log("checkDealAlerts error:", error);
      });

      const intervalId = setInterval(() => {
        checkDealAlerts().catch((error) => {
          console.log("checkDealAlerts interval error:", error);
        });
      }, 15000);

      return () => clearInterval(intervalId);
    }, [checkDealAlerts])
  );

  const handleToggleDealAlert = async (item) => {
    if (!isDealAlertEnabled(item.id)) {
      await ensureNotificationPermission();
    }

    toggleDealAlert(item);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-4">
        <Text className="text-3xl font-semibold">My Wishlist</Text>
      </View>

      {wishlistItems.length ? (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Animated.View className="w-full" layout={LinearTransition.springify()} exiting={FadeOutLeft.duration(220)}>
              <ProductCard product={item} containerClassName="w-full px-4 py-4" />
              <View className="px-4 mb-4 -mt-2">
                <View className="flex-row items-center justify-between px-3 py-2 bg-gray-100 rounded-md">
                  <Text className="text-sm font-semibold text-gray-800">
                    Deal Alert
                  </Text>
                  <Switch
                    value={isDealAlertEnabled(item.id)}
                    onValueChange={() => handleToggleDealAlert(item)}
                    trackColor={{ false: "#9CA3AF", true: "#10B981" }}
                    thumbColor={isDealAlertEnabled(item.id) ? "#FFFFFF" : "#F3F4F6"}
                  />
                </View>
              </View>
            </Animated.View>
          )}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <View className="items-center justify-center flex-1 px-6">
          <Text className="text-xl font-semibold text-center text-gray-800">Your wishlist is empty.</Text>
          <Text className="mt-2 text-base text-center text-gray-500">
            Tap the heart icon on any product to save it here.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Wishlist;
