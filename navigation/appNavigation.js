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
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {},
          headerTransparent: true,
          drawerPosition: "right",
          headerLeft: false,
          headerRight: () => <Icon size={20} name="menu" color="white" style={{ marginRight: 20 }} />,
          headerTintColor: "white",
          headerShown: false,
        }}

        // drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen name="login" options={{ headerShown: false }} component={LoginScreen} />
        <Drawer.Screen name="work-places" options={{ headerShown: false }} component={ChooseWorkPlace} />
        <Drawer.Screen name="/" component={HomePage} />
        <Drawer.Screen name="create-transfers" component={CreateShipment} />
        <Drawer.Screen name="add-product-for-transfer" component={AddProductForTransfer} />
        <Drawer.Screen name="scan-qr-for-add-product" component={ScanQrForAddProduct} />
        <Drawer.Screen name="cart-for-scann" component={CartForScann} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
