import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import ChooseWorkPlace from "../screens/ChooseWorkPlace";
import HomePage from "../screens/HomePage";
import CreateShipment from "../screens/create_shipment/CreateShipment";
import { authContext } from "../contexts/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN } from "../constants";
import AddProductForTransfer from "../screens/create_shipment/AddProductForTransfer";
import ScanQrForAddProduct from "../screens/create_shipment/ScanQr";
import CartForScann from "../screens/create_shipment/CartForScann";
import { DrawerToggleButton, createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/Drawer";
import { workPlaceContext } from "../contexts/workPlaceContext";
import Icon from "react-native-vector-icons/Feather";
import SellScreen from "../screens/sell";
import SellCart from "../screens/sell/sellCart";
import SellScan from "../screens/sell/scanQr";
import Scanner from "../components/scanner/Scanner";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const Drawer = createDrawerNavigator();
  const { savedPlace } = useContext(workPlaceContext);
  const [user, setUser] = useState(null);
  const [initialRoute, setInitialRoute] = useState("login");

  const restoreUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(TOKEN);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setInitialRoute("/");
      } else {
        setUser(null);
        setInitialRoute("login");
      }
    } catch (error) {
      console.error("Error retrieving user from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    restoreUser();
  }, [savedPlace]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          // headerStyle: {},
          // headerTransparent: true,
          // drawerPosition: "right",
          // headerLeft: false,
          // headerRight: () => <Icon size={20} name="menu" color="white" style={{ marginRight: 20 }} />,
          // headerTintColor: "white",
          headerShown: false,
        }}

        // drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Stack.Screen name="login" options={{ headerShown: false, swipeEnabled: false }} component={LoginScreen} />
        <Stack.Screen name="work-places" options={{ headerShown: false, swipeEnabled: false }} component={ChooseWorkPlace} />
        <Stack.Screen name="/" component={HomePage} />
        <Stack.Screen name="create-transfers" component={CreateShipment} />
        <Stack.Screen name="add-product-for-transfer" component={AddProductForTransfer} />
        <Stack.Screen name="scan-product-transfer" component={ScanQrForAddProduct} />
        <Stack.Screen name="cart-for-scan" component={CartForScann} />
        <Stack.Screen name="sell" component={SellScreen} />
        <Stack.Screen name="sell-cart" component={SellCart} />
        <Stack.Screen name="sell-scan" component={SellScan} />
        {/* <Drawer.Screen name="scanner" component={Scanner} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
