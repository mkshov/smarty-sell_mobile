import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import ChooseWorkPlace from "../screens/ChooseWorkPlace";
import HomePage from "../screens/HomePage";
import CreateShipment from "../screens/CreateShipment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContextProvider from "../contexts/authContext";
import { TOKEN } from "../constants";
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem(TOKEN);
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoggedIn();
    console.log("isLoggedIn: ", isLoggedIn);
  }, []);

  return (
    <AuthContextProvider>
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
    </AuthContextProvider>
  );
}
