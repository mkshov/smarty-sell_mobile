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
  ActivityIndicator,
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
  const { sellCart, setSellCart, selectedSellPlace, saveCart, loadCart } = useContext(sellContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
    if (selectedSellPlace && selectedSellPlace.selectedCurency) {
      setLoading(false);
    }
  }, [selectedSellPlace]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const convertPrice = (price, rate) => {
    return price * rate;
  };

  const calculateDiscountedPrice = (price, discount = 0) => {
    return price - (price * discount) / 100;
  };

  const totalChangePrice = (item) => {
    const rate = selectedSellPlace.selectedCurency.rate;
    const priceInSelectedCurrency = convertPrice(item.product.price_rule.price, rate);
    const discountedPrice = calculateDiscountedPrice(priceInSelectedCurrency, selectedSellPlace.selectedCustomer?.discount || 0);
    return (item.newQuantity || 0) * discountedPrice;
  };

  const handleQuantityChange = (index, newQuantity, action, item) => {
    const quantity = parseInt(newQuantity, 10) || 0;
    const updatedCart = [...sellCart];
    const stockQuantity = updatedCart[index].quantity;

    if (action === "minus" && quantity < 1) {
      return;
    }

    if (quantity <= stockQuantity) {
      updatedCart[index].newQuantity = quantity;
      // updatedCart[index].discountPrice = parseInt(
      //   calculateDiscountedPrice(
      //     convertPrice(item.product.price_rule.price, selectedSellPlace.selectedCurency.rate),
      //     selectedSellPlace.selectedCustomer?.discount
      //   ).toFixed(2)

      // );
      console.log(
        calculateDiscountedPrice(
          convertPrice(item.product.price_rule.price, selectedSellPlace.selectedCurency.rate),
          selectedSellPlace.selectedCustomer?.discount
        ).toFixed(2)
      );
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

  const checkEmptyInputs = () => {
    for (let item of sellCart) {
      if (item.newQuantity === 0) {
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

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ED83C1FF" />
          <Text>Загрузка...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

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
              {sellCart.length ? (
                sellCart.map((item, index) => (
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
                            ? `${convertPrice(item.product.price_rule.price, selectedSellPlace.selectedCurency.rate).toFixed(2)} ${
                                selectedSellPlace.selectedCurency.name || selectedSellPlace.selectedCurency.currency.name
                              }`
                            : "price_rule = null"}
                        </Text>
                      </View>
                      <View>
                        <Text>Скидка покупателя</Text>
                        <Text className="text-base font-semibold mt-1">
                          {selectedSellPlace.selectedCustomer ? `${selectedSellPlace.selectedCustomer?.discount}%` : "0%"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row mt-10">
                      <View className="w-1/2">
                        <Text>Цена со скидкой</Text>
                        <Text className="text-base font-semibold mt-1">
                          {item.product.price_rule
                            ? `${calculateDiscountedPrice(
                                convertPrice(item.product.price_rule.price, selectedSellPlace.selectedCurency.rate),
                                selectedSellPlace.selectedCustomer?.discount
                              ).toFixed(2)} ${selectedSellPlace.selectedCurency.name || selectedSellPlace.selectedCurency.currency.name}`
                            : "price_rule = null"}
                        </Text>
                      </View>
                      <View>
                        <Text>Итого</Text>
                        <Text className="text-base font-semibold mt-1">
                          {item.product.price_rule
                            ? `${totalChangePrice(item).toFixed(2)} ${
                                selectedSellPlace.selectedCurency.name || selectedSellPlace.selectedCurency.currency.name
                              }`
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
                        <View className="flex-row items-center max-w-[100px] mt-2">
                          <TextInput
                            value={String(item.newQuantity || "")}
                            onChangeText={(e) => handleQuantityChange(index, e)}
                            keyboardType="numeric"
                            className="text-base font-semibold w-1/2 mt-1 border-b-[1px] pb-1"
                          />
                          <TouchableOpacity
                            className="ml-3 border-2 border-[#CD5297] rounded-full"
                            onPress={() => handleQuantityChange(index, (item.newQuantity || 0) - 1, "minus", item)}
                          >
                            <AddIcon name="minus" size={22} color={"#CD5297"} />
                          </TouchableOpacity>
                          <TouchableOpacity className="ml-3" onPress={() => handleQuantityChange(index, (item.newQuantity || 0) + 1, "plus", item)}>
                            <AddIcon name="pluscircleo" size={26} color={"#CD5297"} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-lg font-bold text-center color-white">В корзине пусто :(</Text>
              )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
