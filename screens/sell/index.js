import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { sellContext } from "../../contexts/sellContext";
import { workPlaceContext } from "../../contexts/workPlaceContext";
import { SelectList } from "react-native-dropdown-select-list";

export default function SellScreen({ navigation }) {
  const { getSellPlaces, sellPlaces } = useContext(sellContext);
  console.log("sellPlaces: ", sellPlaces);
  const { getSavedPlace, savedPlace } = useContext(workPlaceContext);

  const [selected, setSelected] = useState({
    selectedPlace: null,
    selectedCurency: null,
  });

  const data = sellPlaces?.map((place) => ({
    key: place.type.id,
    value: place.name,
  }));
  console.log("data: ", data);

  useEffect(() => {
    getSavedPlace();
    handleGetPlaces();
  }, []);

  const handleGetPlaces = async () => {
    if (savedPlace) {
      const params = {
        is_active: true,
        type: savedPlace.id,
        limit: 100,
      };
      let res = await getSellPlaces(params);
    } else {
      getSavedPlace();
      console.log("Нет торговой точки в хранилище!");
    }
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#8469A4FF", "#ED83C1FF", "#7E8BCD"]}>
        <SafeAreaView style={styles.AndroidSafeArea}>
          <View className="flex-row justify-between pl-2 pr-5">
            <TouchableOpacity onPress={() => navigation.navigate("/")} className="flex-row items-center">
              <Icon name="chevron-back" color={"white"} size={25} />
              <Text className="text-white">Назад</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleGetPlaces()}>
              <Text className=" text-2xl text-white font-bold">Продажа</Text>
            </TouchableOpacity>
          </View>
          <View>
            <View style={{ marginTop: 20, position: "relative", zIndex: 999 }}>
              <SelectList
                dropdownTextStyles={{
                  fontSize: 17,
                  color: "white",
                }}
                dropdownStyles={{
                  borderWidth: 0,
                  height: 120,
                  position: "absolute",
                  zIndex: 10,
                  left: 0,
                  right: 0,
                  top: 40,
                }}
                boxStyles={{ backgroundColor: "#ED83C1", marginHorizontal: 20 }}
                inputStyles={{ color: "white" }}
                dropdownItemStyles={{
                  height: 40,
                  backgroundColor: "#CD5297",
                  borderRadius: 20,
                  justifyContent: "center",
                  marginVertical: 3,
                  marginHorizontal: 20,
                }}
                setSelected={(place) =>
                  setSelected({
                    ...selected,
                    selectedPlace: place,
                  })
                }
                placeholder={"Выбрать от куда продать"}
                data={data}
              />
            </View>
            <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mb-3 mx-5">
              <TouchableOpacity>
                <Text className="text-lg font-bold text-white text-center">Добавить вручную</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: "100%",
  },
});
