import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { workPlaceContext } from "../../contexts/workPlaceContext";
import { sellContext } from "../../contexts/sellContext";
import { transferContext } from "../../contexts/transferContext";
import Icon from "react-native-vector-icons/Ionicons";
import AddIcon from "react-native-vector-icons/AntDesign";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function SellCart({ navigation }) {
  const { savedPlace, logOut, getSavedPlace } = useContext(workPlaceContext);
  const { transfer, setScannedProducts, getTransfer, getTransferProducts, addProductToTransfer, getAmountInPlace } = useContext(transferContext);
  const {
    getSellPlaces,
    getSellCurrencies,
    getSellCustomers,
    sellCart,
    setSellCart,
    selectedSellPlace,
    getSavedProduct,
    productStates,
    setProductStates,
  } = useContext(sellContext);
  const [refreshing, setRefreshing] = useState(false);
  console.log("sellCart: ", sellCart);

  // useEffect(() => {
  //   loadCart();
  // }, []);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem("sellCart");
      console.log("cartData: ", JSON.parse(cartData));
      if (cartData !== null) {
        setSellCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error("Failed to load cart from storage", error);
    }
  };

  const saveCart = () => {
    try {
      sellCart.forEach(async (item) => {
        if (item.newQuantity > item.quantity) {
          Alert.alert("Добавляемое кол-во превышает кол-во на складе!");
          return;
        } else {
          await AsyncStorage.setItem("sellCart", JSON.stringify(sellCart));
          loadCart();
          showMessage({
            message: "Корзина сохранена",
            type: "success",
          });
        }
      });
    } catch (error) {
      console.error("Failed to save cart to storage", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    const quantity = parseInt(newQuantity, 10) || 0;
    const updatedCart = [...sellCart];
    const stockQuantity = updatedCart[index].quantity;

    if (quantity <= stockQuantity) {
      updatedCart[index].newQuantity = quantity;
      setSellCart(updatedCart);
    } else {
      showMessage({
        message: `Количество не может превышать количество на складе (${stockQuantity})`,
        type: "danger",
      });
    }
  };
  const handleDeleteProduct = async (productId) => {
    const updatedCart = sellCart.filter((item) => item.id !== productId);
    setSellCart(updatedCart);
    await AsyncStorage.setItem("sellCart", JSON.stringify(updatedCart));
  };

  const totalChangePrice = (item) => {
    return (item.newQuantity || 0) * item.product.price_rule.price;
  };

  const checkEmptyInputs = () => {
    for (let item of sellCart) {
      console.log("item: ", item);
      if (item.newQuantity === 0) {
        console.log(false);
        showMessage({
          message: "Пожалуйста, заполните все поля количества",
          type: "danger",
        });
        return false;
      }
    }
    return true;
  };

  const handleSaveCart = () => {
    if (checkEmptyInputs()) {
      saveCart();
    }
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView behavior="padding">
        <LinearGradient colors={["#8469A4FF", "#ED83C1FF"]}>
          <SafeAreaView style={styles.AndroidSafeArea}>
            <View className="flex-row justify-between pl-2 pr-5">
              <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
                <Icon name="chevron-back" color={"white"} size={25} />
                <Text className="text-white">Назад</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-2xl text-white font-bold">Корзина продаж</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefresh} />}
              vertical={true}
              className="mt-10 px-6"
            >
              {sellCart.map((item, index) => (
                <View key={index} className="rounded-xl border-x-4 border-y-4 border-[#efceff87] bg-white p-7 mt-5">
                  <View className="flex-row justify-between">
                    <View>
                      <Text>Название</Text>
                      <Text className="text-base font-semibold mt-1">{item.product.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} className="bg-red-500 justify-center px-3 rounded-2xl">
                      <Text className="text-white">Удалить</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row mt-10">
                    <View className="w-1/2">
                      <Text>Модель</Text>
                      <Text className="text-base font-semibold mt-1">{item.product.model}</Text>
                    </View>
                    <View>
                      <Text>Тип</Text>
                      <Text className="text-base font-semibold mt-1">{item.product.type.name}</Text>
                    </View>
                  </View>
                  <View className="flex-row mt-10">
                    <View className="w-1/2">
                      <Text>Артикул модели</Text>
                      <Text className="text-base font-semibold mt-1">{item.product.model_code}</Text>
                    </View>
                    <View>
                      <Text>Кол-во на складе</Text>
                      <Text className="text-base font-semibold mt-1">{item.quantity}</Text>
                    </View>
                  </View>
                  <View className="flex-row mt-10">
                    <View className="w-1/2">
                      <Text>Цена</Text>
                      <Text className="text-base font-semibold mt-1">
                        {item.product.price_rule
                          ? `${item.product.price_rule.price.toFixed(2)} ${selectedSellPlace.selectedCurency?.name}`
                          : "price_rule = null"}
                      </Text>
                    </View>
                    <View>
                      <Text>Итого</Text>
                      <Text className="text-base font-semibold mt-1">
                        {item.product.price_rule
                          ? `${totalChangePrice(item).toFixed(2)} ${selectedSellPlace.selectedCurency?.name}`
                          : "price_rule = null"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row mt-10">
                    <View className="w-1/2">
                      <Text>Размер</Text>
                      <View className="bg-gray-200 max-w-[80px] py-1 items-center mt-2 rounded-full">
                        <Text className="text-base font-medium">{item.size.name}</Text>
                      </View>
                    </View>
                    <View>
                      <Text>Добавляемое кол-во</Text>
                      <View className="flex-row items-end max-w-[100px] gap-x-7">
                        <TextInput
                          value={String(item.newQuantity || "")}
                          onChangeText={(e) => handleQuantityChange(index, e)}
                          keyboardType="numeric"
                          className="text-base font-semibold w-1/2 mt-1 border-b-[1px] pb-1"
                        />
                        <TouchableOpacity onPress={() => handleQuantityChange(index, (item.newQuantity || 0) + 1)}>
                          <AddIcon name="pluscircleo" size={25} color={"#CD5297"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View className="py-4 rounded-2xl mb-3 mt-5 bg-white mx-6">
              <TouchableOpacity onPress={handleSaveCart}>
                <Text className="text-lg font-bold text-[#CD5297] text-center">Сохранить</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: "100%",
  },
});
