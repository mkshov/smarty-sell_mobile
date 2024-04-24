import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { sellContext } from "../../contexts/sellContext";
import { workPlaceContext } from "../../contexts/workPlaceContext";
import { SelectList } from "react-native-dropdown-select-list";

export default function SellScreen({ navigation }) {
  const { getSellPlaces, sellPlaces, sellCustomers, sellCurrencies } = useContext(sellContext);
  const { getSavedPlace, savedPlace } = useContext(workPlaceContext);

  const [selected, setSelected] = useState({
    selectedPlace: null,
    selectedCurency: null,
    selectedCustomer: null,
  });
  console.log("selected: ", selected);

  const data = {
    places: sellPlaces?.map((place) => ({
      key: place.type.id,
      value: place.name,
    })),
    currencies: sellCurrencies?.map((currency) => ({
      key: currency.id,
      value: currency.currency.name,
    })),
    customers: sellCustomers?.map((customer) => ({
      key: customer.id,
      value: `${customer.name} - Скидка ${customer.percentage_discount}%`,
    })),
  };

  useEffect(() => {
    getSavedPlace();
  }, []);

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
          <ScrollView>
            <View style={{ marginTop: 20, position: "relative", zIndex: 10, marginHorizontal: 20 }}>
              <Text style={{ color: "white", fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}>Продать товар из другой точки</Text>
              <SelectList
                dropdownTextStyles={styles.dropdownTextStyles}
                dropdownStyles={styles.dropdownStyles}
                boxStyles={styles.boxStyles}
                inputStyles={{ color: "white" }}
                closeicon={<Icon name="close" color="white" size={25} />}
                searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
                arrowicon={<Icon name="arrow-down" color="white" size={20} />}
                dropdownItemStyles={styles.dropdownItemStyles}
                setSelected={(place) =>
                  setSelected({
                    ...selected,
                    selectedPlace: place,
                  })
                }
                placeholder={"Выбрать от куда продать"}
                search={false}
                data={data.places}
              />
            </View>
            <View style={{ marginTop: 20, position: "relative", zIndex: 9, marginHorizontal: 20 }}>
              <Text style={{ color: "white", fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}>Валюта</Text>
              <SelectList
                dropdownTextStyles={styles.dropdownTextStyles}
                dropdownStyles={styles.dropdownStyles}
                boxStyles={styles.boxStyles}
                inputStyles={{ color: "white" }}
                closeicon={<Icon name="close" color="white" size={25} />}
                searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
                arrowicon={<Icon name="arrow-down" color="white" size={20} />}
                dropdownItemStyles={styles.dropdownItemStyles}
                setSelected={(currency) =>
                  setSelected({
                    ...selected,
                    selectedCurency: currency,
                  })
                }
                placeholder={"Выбрать валюту"}
                search={false}
                data={data.currencies}
              />
            </View>
            <View style={{ marginTop: 20, position: "relative", zIndex: 8, marginHorizontal: 20 }}>
              <Text style={{ color: "white", fontWeight: "bold", marginLeft: 5, marginBottom: 5 }}>Покупатель</Text>
              <SelectList
                dropdownTextStyles={styles.dropdownTextStyles}
                dropdownStyles={styles.dropdownStyles}
                boxStyles={styles.boxStyles}
                inputStyles={{ color: "white" }}
                closeicon={<Icon name="close" color="white" size={25} />}
                searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
                arrowicon={<Icon name="arrow-down" color="white" size={20} />}
                dropdownItemStyles={styles.dropdownItemStyles}
                setSelected={(customer) =>
                  setSelected({
                    ...selected,
                    selectedCustomer: customer,
                  })
                }
                placeholder={"Выбрать покупателя..."}
                search={false}
                data={data.customers}
              />
            </View>
            <TouchableOpacity style={styles.addProductButton}>
              <Text className="text-lg font-bold text-[#CD5297] text-center">Добавить продукт</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addProductButton}>
              <Text className="text-lg font-bold text-[#CD5297] text-center">Оформить продажу</Text>
            </TouchableOpacity>
          </ScrollView>
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
  dropdownItemStyles: {
    height: 40,
    backgroundColor: "#ED83C1",
    borderRadius: 20,
    justifyContent: "center",
    marginVertical: 3,
    marginHorizontal: 20,
  },
  boxStyles: {
    backgroundColor: "#ED83C1",
    height: 50,
    alignItems: "center",
    borderWidth: 0,
    elevation: Platform.OS === "android" ? 5 : 0,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownStyles: {
    borderWidth: 0,
    height: 200,
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    top: 45,
    backgroundColor: "white",
  },
  dropdownTextStyles: {
    fontSize: 17,
    color: "white",
  },
  addProductButton: {
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 20,
    backgroundColor: "white",
    marginTop: 40,
  },
});
