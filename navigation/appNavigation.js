import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import ChooseWorkPlace from "../screens/ChooseWorkPlace";
import HomePage from "../screens/HomePage";
import CreateShipment from "../screens/CreateShipment";
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="WorkPlaces" component={ChooseWorkPlace} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Create-transfers" component={CreateShipment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
