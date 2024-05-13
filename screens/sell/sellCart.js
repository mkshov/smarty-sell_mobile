import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
  Keyboard,
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
  TouchableWithoutFeedback,
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
  console.log("productStates: ", productStates);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const initialProductStates = sellCart.map((product, idx) => ({
      product: product.product.id,
      size: product.size.id,
      quantity: 1,
      id: product.id,
    }));
    setProductStates(initialProductStates);
  }, [sellCart]);

  // useEffect(() => {
  //   getSavedProduct();
  // }, []);

  const handleQuantityChange = (index, newQuantity, item) => {
    setProductStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index].quantity = newQuantity > item.quantity ? item.quantity : newQuantity;
      return updatedStates;
    });
  };

  const handleDeleteProduct = async (productId) => {
    const updatedProducts = sellCart.filter((product) => product.id !== productId);
    setSellCart(updatedProducts);
    try {
      const str = await AsyncStorage.getItem("sellCartData");
      if (str) {
        const fromStorage = JSON.parse(str);
        const updatedStorage = fromStorage.filter((item) => item.id !== productId);
        await AsyncStorage.setItem("sellCartData", JSON.stringify(updatedStorage));
      }
    } catch (error) {
      console.log("Ошибка при удалении данных из AsyncStorage:", error);
    }
  };

  const totalChangePrice = (item, idx) => {
    return productStates[idx]?.quantity * item.product.price_rule.price;
  };

  const saveData = async () => {
    try {
      const inputData = productStates.map((item) => ({
        product: item.product,
        size: item.size,
        quantity: +item.quantity,
        id: item.id,
      }));
      console.log("inputData: ", inputData);
      await AsyncStorage.setItem("sellCartData", JSON.stringify(inputData));
      navigation.navigate("sell");
      showMessage({
        message: "Кол-во успешно обновилось!",
        type: "success",
        position: "bottom",
        statusBarHeight: 1,
        textProps: {
          style: { fontSize: 17, color: "white" },
        },
      });
    } catch (error) {
      console.error("Ошибка при сохранении данных в AsyncStorage:", error);
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
                <Text className="text-2xl text-white font-bold">Коризина продаж</Text>
              </TouchableOpacity>
            </View>

            <ScrollView refreshControl={<RefreshControl tintColor={"white"} />} vertical={true} className="mt-10 px-6">
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
                  <View className="flex-row  mt-10">
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
                          ? `${totalChangePrice(item, index).toFixed(2)} ${selectedSellPlace.selectedCurency?.name}`
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
                          value={String(productStates[index]?.quantity)}
                          onChangeText={(e) => handleQuantityChange(index, e, item)}
                          keyboardType="numeric"
                          className="text-base font-semibold w-1/2 mt-1 border-b-[1px] pb-1"
                        />
                        <TouchableOpacity>
                          <AddIcon name="pluscircleo" size={25} color={"#CD5297"} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <View className="py-4 rounded-2xl mb-3 mt-5 bg-white mx-6">
              <TouchableOpacity onPress={() => saveData()}>
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
