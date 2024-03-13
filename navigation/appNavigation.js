import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import ChooseWorkPlace from "../screens/ChooseWorkPlace";
import HomePage from "../screens/HomePage";
import CreateShipment from "../screens/create_shipment/CreateShipment";
import { authContext } from "../contexts/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN } from "../constants";
import AddProductForTransfer from "../screens/create_shipment/AddProductForTransfer";
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(TOKEN);
        console.log("storedUser: ", storedUser);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error retrieving user from AsyncStorage:", error);
      }
    };

    restoreUser();
  }, []);

  const initialRoute = {};
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "/" : "login"} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="work-places" component={ChooseWorkPlace} />
        <Stack.Screen name="/" component={HomePage} />
        <Stack.Screen name="create-transfers" component={CreateShipment} />
        <Stack.Screen name="add-product-for-transfer" component={AddProductForTransfer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
