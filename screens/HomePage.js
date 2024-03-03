import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LOCAL_STORAGE_KEYS } from "../constants";

export default function HomePage({ navigation }) {
  const [savedPlace, setSavedPlace] = useState(null);
  const getSavedPlace = async () => {
    const savedPlace = JSON.parse(
      (await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.SALE_PLACE)) || null
    );
    setSavedPlace(savedPlace);
  };
  useEffect(() => {
    getSavedPlace();
  }, []);

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };
  return (
    <View
      style={{ backgroundColor: "#f4f6f8" }}
      className="w-full h-full bg-orange-400 flex justify-center items-center  gap-y-5 "
    >
      <Text className="text-2xl mb-10">Торговая точка: {savedPlace?.name}</Text>
      <TouchableOpacity
        onPress={() => handleNavigate("Create-transfers")}
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
  );
}
