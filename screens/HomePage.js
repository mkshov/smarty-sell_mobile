import React, { useContext } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
        navigation.navigate(path);
        getSellPlaces(params);
        getSellCurrencies(savedPlace.id);
        getSellCustomers();
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
              <TouchableOpacity onPress={() => logOut(navigation)} className="bg-white px-5 py-3 rounded-2xl">
                <Text className="font-bold text-base text-[#CD5297]">Выйти</Text>
              </TouchableOpacity>
              <Text className="text-xl text-white font-bold">Торговая точка: {savedPlace?.name}</Text>
            </View>

            <View className="w-full h-full flex justify-center items-center">
              <View className="items-center justify-center w-full gap-4">
                <TouchableOpacity onPress={() => handleNavigate("create-transfers")} className="bg-white px-7 w-[250px] py-3 rounded-2xl">
                  <Text className="text-center font-bold text-base text-[#CD5297]">Исходящие отгрузки</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("sell")} className="bg-white px-7 w-[250px] py-3 rounded-2xl">
                  <Text className="text-center font-bold text-base text-[#CD5297]">Продажа</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNavigate("transfers/history")} className="bg-white px-7 py-3 w-[250px] rounded-2xl">
                  <Text className="text-center font-bold text-base text-[#CD5297]">История отгрузок</Text>
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
