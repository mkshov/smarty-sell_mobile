import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  ScrollViewBase,
  ScrollViewComponent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import { sellContext } from "../../contexts/sellContext";
import { workPlaceContext } from "../../contexts/workPlaceContext";
import { SelectList } from "react-native-dropdown-select-list";
import ModalChooseAddVariant from "../../components/AddVariant/modalChooseAddVariant";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withRepeat, withSequence } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SellScreen({ navigation }) {
  const { sellCart, sellPlaces, sellCustomers, sellCurrencies, selectedSellPlace, setSelectedSellPlace, setSellCart } = useContext(sellContext);
  const { getSavedPlace, savedPlace } = useContext(workPlaceContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCartFromStorage();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const totalPrice = (
    currency = {
      id: selectedSellPlace.selectedCurency?.currency?.id || selectedSellPlace.selectedCurency?.id,
      name: selectedSellPlace.selectedCurency?.currency?.name || selectedSellPlace.selectedCurency?.name,
      rate: selectedSellPlace.selectedCurency?.rate,
    }
  ) => {
    console.log("currency: ", currency);
    if (!currency) {
      console.log("No currency selected");
      return "0.00";
    }
    return sellCart
      .reduce((sum, item) => {
        if (item.product.price_rule) {
          return sum + item.product.price_rule.price * item.newQuantity * currency.rate;
        }
        return sum;
      }, 0)
      .toFixed(2);
  };
  console.log("totalPrice: ", totalPrice());
  // const totalPrice2 = sellCart.reduce((sum, item) => {
  //   if (item.product.price_rule) {
  //     if(selectedSellPlace.currencies[])
  //   }
  //   return sum;
  // }, 0);

  const totalQuantity = sellCart.reduce((sum, item) => {
    return sum + item.newQuantity;
  }, 0);

  useEffect(() => {
    getSavedPlace();
    setSelectedSellPlace({
      ...selectedSellPlace,
      selectedPlace: [savedPlace?.type.id, savedPlace?.name],
    });
  }, []);

  const data = {
    places: sellPlaces?.map((place) => ({
      key: [place.type.id, place.name],
      value: place.name,
    })),
    currencies: sellCurrencies?.map((currency) => ({
      key: { id: currency.currency.id, name: currency.currency.name, rate: currency.rate },
      value: currency.currency.name,
    })),
    customers: sellCustomers?.map((customer) => ({
      key: customer.id,
      value: `${customer.name} - Скидка ${customer.percentage_discount}%`,
    })),
    basePlace: {
      key: savedPlace?.type.id,
      value: savedPlace?.name,
    },
    baseCurrency: {
      key: sellCurrencies?.find((currency) => currency.is_base_currency),
      value: sellCurrencies?.find((currency) => currency.is_base_currency).currency.name,
    },
  };

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };

  const offset = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const OFFSET = 5;
  const TIME = 250;

  const handlePress = () => {
    offset.value = withSequence(withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true), withTiming(0, { duration: TIME / 2 }));
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handlePress();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getCartFromStorage();
  }, []);

  async function getCartFromStorage() {
    let from = await AsyncStorage.getItem("sellCart");
    let res = JSON.parse(from) || [];
    setSellCart(res);
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#8469A4FF", "#ED83C1FF", "#7E8BCD"]}>
        <SafeAreaView style={styles.AndroidSafeArea}>
          <View className="flex-row justify-between pl-2 pr-5">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
              <Icon name="chevron-back" color={"white"} size={25} />
              <Text className="text-white">Назад</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-2xl text-white font-bold">Продажа</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ justifyContent: "space-between", flex: 1, paddingHorizontal: 20 }}
          >
            <View>
              <View style={{ marginTop: 20, position: "relative", zIndex: 10 }}>
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
                  defaultOption={data.basePlace}
                  setSelected={(place) => {
                    console.log("place: ", place);
                    setSelectedSellPlace({
                      ...selectedSellPlace,
                      selectedPlace: place,
                    });
                  }}
                  placeholder={"Выбрать от куда продать"}
                  search={false}
                  data={data.places}
                />
              </View>
              <View style={{ marginTop: 20, position: "relative", zIndex: 9 }}>
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
                  defaultOption={data.baseCurrency}
                  setSelected={(currency) => {
                    console.log("currency: ", currency);
                    totalPrice(currency);
                    setSelectedSellPlace({
                      ...selectedSellPlace,
                      selectedCurency: currency,
                    });
                  }}
                  placeholder={"Выбрать валюту"}
                  search={false}
                  data={data.currencies}
                />
              </View>
              <View style={{ marginTop: 20, position: "relative", zIndex: 8 }}>
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
                    setSelectedSellPlace({
                      ...selectedSellPlace,
                      selectedCustomer: customer,
                    })
                  }
                  placeholder={"Выбрать покупателя..."}
                  searchPlaceholder="Поиск..."
                  data={data.customers}
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <View>
                  <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.addProductButton}>
                    <Text className="text-lg font-bold text-[#CD5297] text-center">Добавить продукт</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 17, color: "white", fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                  В корзине {sellCart.length}{" "}
                  {sellCart.length === 1 ? "продукт" : sellCart.length > 1 && sellCart.length < 5 ? "продукта" : "продуктов"}
                </Text>
                <Text style={{ fontSize: 17, color: "white", fontWeight: "bold", textAlign: "center", marginBottom: 2 }}>
                  Общее добавляемое кол-во - {totalQuantity}шт.
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate("sell-cart")} className="flex-row justify-center items-center mt-2">
                  <Text className="text-xl font-bold text-white text-center">Перейти в корзину</Text>
                  <Animated.View style={[style]}>
                    <Octicons name="arrow-right" size={22} color="white" style={{ marginTop: 4, marginLeft: 15 }} />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text className="text-xl text-white font-bold text-center mb-2">
                Итого: {totalPrice()} {selectedSellPlace.selectedCurency?.name}
              </Text>
              <TouchableOpacity style={styles.addProductButton} className="" onPress={getCartFromStorage}>
                <Text className="text-lg font-bold text-[#CD5297] text-center">Оформить продажу</Text>
              </TouchableOpacity>
            </View>
            <ModalChooseAddVariant
              scanPath="sell-scan"
              handleNavigate={handleNavigate}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
            />
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

    backgroundColor: "white",
    width: "100%",
  },
});
