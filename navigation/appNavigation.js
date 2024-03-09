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
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkUser = async () => {
    const user = await AsyncStorage.getItem(TOKEN);
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };
  useEffect(() => {
    checkUser();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "/" : "login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="work-places" component={ChooseWorkPlace} />
        <Stack.Screen name="/" component={HomePage} />
        <Stack.Screen name="create-transfers" component={CreateShipment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
