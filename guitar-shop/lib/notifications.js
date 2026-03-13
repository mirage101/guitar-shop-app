import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";

let isHandlerConfigured = false;

const configureNotifications = () => {
  if (isHandlerConfigured || Platform.OS === "web") {
    return;
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("deal-alerts", {
      name: "Deal Alerts",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#3B82F6",
    }).catch((error) => {
      console.log("setNotificationChannelAsync error:", error);
    });
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  isHandlerConfigured = true;
};

const ensureNotificationPermission = async () => {
  if (Platform.OS === "web") {
    return false;
  }

  configureNotifications();

  const currentPermissions = await Notifications.getPermissionsAsync();
  if (currentPermissions.granted) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  if (requestedPermissions.granted) {
    return true;
  }

  Alert.alert("Notifications Disabled", "Enable notifications to receive deal alerts.");
  return false;
};

const sendDealNotification = async ({ productName, oldPrice, newPrice }) => {
  const title = "Deal Alert";
  const body = `${productName} dropped from $${Number(oldPrice).toFixed(2)} to $${Number(newPrice).toFixed(2)}.`;

  if (Platform.OS === "web") {
    Alert.alert(title, body);
    return;
  }

  const allowed = await ensureNotificationPermission();
  if (!allowed) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: Platform.OS === "android" ? { channelId: "deal-alerts" } : null,
  });
};

export { ensureNotificationPermission, sendDealNotification };
