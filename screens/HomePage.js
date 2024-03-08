import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LOCAL_STORAGE_KEYS, TOKEN } from "../constants";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomePage({ navigation }) {
  const [savedPlace, setSavedPlace] = useState(null);

  const getSavedPlace = async () => {
    const savedPlace = JSON.parse(
      (await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.SALE_PLACE)) || null
    );
    console.log("savedPlace: ", savedPlace);
    setSavedPlace(savedPlace);
  };
  useEffect(() => {
    getSavedPlace();
  }, []);

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };

  const logOut = async () => {
    await AsyncStorage.removeItem(TOKEN);
    await AsyncStorage.removeItem(LOCAL_STORAGE_KEYS.SALE_PLACE);
    navigation.navigate("login");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={{ backgroundColor: "#f4f6f8" }}>
          <View className="w-full flex-row-reverse items-center justify-evenly">
            <TouchableOpacity
              onPress={() => logOut()}
              className="bg-sky-400 px-7 py-3 rounded-2xl"
            >
              <Text className="text-white text-base ">Выйти</Text>
            </TouchableOpacity>
            <Text className="text-xl">Торговая точка: {savedPlace?.name}</Text>
          </View>
          <View className="w-full h-full flex justify-center items-center">
            <View className="items-center justify-center w-full gap-4">
              <TouchableOpacity
                onPress={() => handleNavigate("create-transfers")}
                className="bg-sky-400 px-7 w-1/2 py-3 rounded-2xl"
              >
                <Text className="text-white text-center text-base">
                  Исходящие отгрузки
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNavigate("transfers/to-accept")}
                className="bg-sky-400 px-7 w-1/2 py-3 rounded-2xl"
              >
                <Text className="text-white text-center text-base">
                  Входящие отгрузки
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleNavigate("transfers/history")}
                className="bg-sky-400 px-7 py-3 w-1/2 rounded-2xl"
              >
                <Text className="text-white text-center text-base">
                  История отгрузок
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
