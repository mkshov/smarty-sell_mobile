import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
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

export default function SellCart({ navigation }) {
  const { savedPlace, logOut, getSavedPlace } = useContext(workPlaceContext);
  const { transfer, setScannedProducts, getTransfer, getTransferProducts, addProductToTransfer, getAmountInPlace } = useContext(transferContext);
  const { getSellPlaces, getSellCurrencies, getSellCustomers, sellCart, setSellCart } = useContext(sellContext);
  const [productStates, setProductStates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const initialProductStates = sellCart.map((product) => ({
      product: product.product.id,
      size: product.size.id,
      quantity_sent: 1,
    }));
    setProductStates(initialProductStates);
  }, [sellCart]);

  const handleQuantityChange = (index, newQuantity) => {
    setProductStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index].quantity_sent = newQuantity;
      return updatedStates;
    });
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = sellCart.filter((product) => product.id !== productId);
    setScannedProducts(updatedProducts);
  };

  return (
    <SafeAreaProvider>
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

          <ScrollView refreshControl={<RefreshControl tintColor={"white"} />} vertical={true} className="px-6 mt-10 max-h-[600px]">
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
                    <Text>Размер</Text>
                    <View className="bg-gray-200 max-w-[80px] py-1 items-center mt-2 rounded-full">
                      <Text className="text-base font-medium">{item.size.name}</Text>
                    </View>
                  </View>
                  <View>
                    <Text>Добавляемое кол-во</Text>
                    <View className="flex-row items-end max-w-[100px] gap-x-7">
                      <TextInput
                        value={String(productStates[index]?.quantity_sent)}
                        onChangeText={(e) => handleQuantityChange(index, e)}
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
