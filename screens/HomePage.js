import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { STORAGE, TOKEN } from "../constants";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { transferContext } from "../contexts/transferContext";
import { workPlaceContext } from "../contexts/workPlaceContext";
import { LinearGradient } from "expo-linear-gradient";
import { sellContext } from "../contexts/sellContext";

export default function HomePage({ navigation }) {
  const { getTransfers } = useContext(transferContext);
  const { savedPlace, logOut, getSavedPlace } = useContext(workPlaceContext);
  const { getSellPlaces, getSellCurrencies, getSellCustomers } = useContext(sellContext);

  const handleNavigate = async (path) => {
    if (path === "create-transfers") {
      getTransfers({ status: "preparing" });
      navigation.navigate(path);
    } else if (path === "sell") {
      if (savedPlace) {
        const params = {
          is_active: true,
          type: savedPlace.type.id,
          limit: 100,
        };
        await getSellPlaces(params);
        await getSellCurrencies(savedPlace.id);
        await getSellCustomers();
      } else {
        getSavedPlace();
      }
    }
    navigation.navigate(path);
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#8469A4FF", "#ED83C1FF"]}>
        <SafeAreaView style={styles.AndroidSafeArea}>
          <View>
            <View className="w-full flex-row-reverse items-center justify-evenly">
              <TouchableOpacity onPress={() => logOut(navigation)} className="bg-sky-400 px-7 py-3 rounded-2xl">
                <Text className="text-white text-base ">Выйти</Text>
              </TouchableOpacity>
              <Text className="text-xl">Торговая точка: {savedPlace?.name}</Text>
            </View>

            <View className="w-full h-full flex justify-center items-center">
              <View className="items-center justify-center w-full gap-4">
                <TouchableOpacity onPress={() => handleNavigate("create-transfers")} className="bg-sky-400 px-7 w-1/2 py-3 rounded-2xl">
                  <Text className="text-white text-center text-base">Исходящие отгрузки</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("sell")} className="bg-sky-400 px-7 w-1/2 py-3 rounded-2xl">
                  <Text className="text-white text-center text-base">Продажа</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("transfers/history")} className="bg-sky-400 px-7 py-3 w-1/2 rounded-2xl">
                  <Text className="text-white text-center text-base">История отгрузок</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  DrawerButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  ButtonText: {
    color: "#fff",
  },
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
