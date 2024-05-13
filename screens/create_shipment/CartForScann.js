import React, { useContext, useEffect, useState } from "react";
import { Alert, ImageBackground, RefreshControl, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { transferContext } from "../../contexts/transferContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import AddIcon from "react-native-vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function CartForScann({ route, navigation }) {
  const { transfer, scannedProducts, setScannedProducts, getTransfer, getTransferProducts, addProductToTransfer, getAmountInPlace } =
    useContext(transferContext);
  const [productStates, setProductStates] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const initialProductStates = scannedProducts.map((product) => ({
      product: product.product.id,
      size: product.size.id,
      quantity_sent: 1,
    }));
    setProductStates(initialProductStates);
  }, [scannedProducts]);

  const handleQuantityChange = (index, newQuantity) => {
    setProductStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index].quantity_sent = newQuantity;
      return updatedStates;
    });
  };

  const sendProduct = async () => {
    let res = await addProductToTransfer(productStates, transfer.id);
    if (productStates.length) {
      if (res.errors) {
        if (res.errors[0].code === "transfer_src_placement_not_enough") {
          Alert.alert("Добавляемый продукт превышает кол-во на складе!");
        }
      } else {
        setScannedProducts([]);
        setProductStates([]);
        await getTransferProducts(transfer.id);
        await getAmountInPlace(transfer.id);
        Alert.alert("Продукты успешно добавлены в отгрузку!");
        navigation.navigate("add-product-for-transfer", { transferId: transfer.id });
      }
    } else {
      Alert.alert("Добавьте хотя бы один продукт в корзину!");
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = scannedProducts.filter((product) => product.id !== productId);
    setScannedProducts(updatedProducts);
  };

  return (
    <ImageBackground resizeMode="cover" className="h-full" source={require("../../assets/login-bg.png")}>
      <SafeAreaProvider>
        <SafeAreaView>
          <TouchableOpacity onPress={() => navigation.navigate("scan-product-transfer")} className="flex-row items-center ml-2">
            <Icon name="chevron-back" color={"white"} size={25} />
            <Text className="text-white">Назад</Text>
          </TouchableOpacity>
          <Text className="text-center text-2xl font-bold text-white mt-5">Корзина трансфера №456</Text>

          <TouchableOpacity onPress={() => sendProduct()} className="px-4 mt-5">
            <LinearGradient colors={["#efceff87", "#efceff87"]} className="py-5 rounded-2xl w-full">
              <Text className="text-center text-white font-semibold">Добавить в отгрузку</Text>
            </LinearGradient>
          </TouchableOpacity>
          <ScrollView refreshControl={<RefreshControl tintColor={"white"} />} vertical={true} className="px-6 mt-10 max-h-[400px]">
            {scannedProducts.map((item, index) => (
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
          <FlashMessage />
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}
