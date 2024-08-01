import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import ChooseWorkPlace from "../screens/ChooseWorkPlace";
import HomePage from "../screens/HomePage";
import CreateShipment from "../screens/create_shipment/CreateShipment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN } from "../constants";
import AddProductForTransfer from "../screens/create_shipment/AddProductForTransfer";
import ScanQrForAddProduct from "../screens/create_shipment/ScanQr";
import CartForScann from "../screens/create_shipment/CartForScann";
import { workPlaceContext } from "../contexts/workPlaceContext";
import SellScreen from "../screens/sell";
import SellCart from "../screens/sell/sellCart";
import SellScan from "../screens/sell/scanQr";
import SellCheck from "../screens/sell/sellCheck";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
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
          headerTransparent: true,
          headerTitleStyle: {
            color: "white",
          },
        }}

        // drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Stack.Screen name="login" options={{ headerShown: false, swipeEnabled: false }} component={LoginScreen} />
        <Stack.Screen name="work-places" options={{ headerShown: false, swipeEnabled: false }} component={ChooseWorkPlace} />
        <Stack.Screen name="/" options={{ headerShown: false }} component={HomePage} />
        <Stack.Screen name="create-transfers" options={{ title: "Создать отгрузку" }} component={CreateShipment} />
        <Stack.Screen name="add-product-for-transfer" component={AddProductForTransfer} />
        <Stack.Screen name="scan-product-transfer" component={ScanQrForAddProduct} />
        <Stack.Screen name="cart-for-scan" component={CartForScann} />
        <Stack.Screen name="sell" component={SellScreen} />
        <Stack.Screen name="sell-cart" component={SellCart} />
        <Stack.Screen name="sell-scan" component={SellScan} />
        <Stack.Screen options={{ gestureEnabled: false }} name="sell-check" component={SellCheck} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
