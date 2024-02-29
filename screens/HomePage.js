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

export default function HomePage() {
  const [savedPlace, setSavedPlace] = useState(null);
  console.log("savedPlace: ", savedPlace);
  const getSavedPlace = async () => {
    const savedPlace = JSON.parse(
      (await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.SALE_PLACE)) || null
    );
    setSavedPlace(savedPlace);
  };
  useEffect(() => {
    getSavedPlace();
  }, []);
  return (
    <View
      style={{ backgroundColor: "#f4f6f8" }}
      className="w-full h-full bg-orange-400 flex justify-center items-center"
    >
      <Text className="mb-10 text-2xl">{savedPlace?.name}</Text>
      <TouchableOpacity
        className="bg-orange-400 px-7 py-3 rounded-2xl"
        onPress={() => getSavedPlace()}
      >
        <Text className="text-white text-base">Get place</Text>
      </TouchableOpacity>
    </View>
  );
}
