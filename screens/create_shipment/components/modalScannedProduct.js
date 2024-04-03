import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

export default function ModalScannedProduct(props) {
  const { modalVisible, scannedProduct, setModalVisible, handleNavigate, newScan } = props;
  console.log("scannedProduct: ", scannedProduct);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
      onBackdropPress={() => this.setModalVisible(false)}
    >
      <Pressable onPress={() => setModalVisible(!modalVisible)} className="items-center justify-center w-full h-full px-6 bg-[#00000077]">
        <Pressable activeOpacity={1} className="bg-white w-full rounded-2xl p-7">
          <Text className="text-xl font-bold text-center">Продукт найден!</Text>
          <View className="flex-row justify-between mt-10">
            <Text className="text-center font-semibold text-lg">Код продукта:</Text>
            <Text className="text-center text-lg">{scannedProduct?.barcode}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-center font-semibold text-lg">Название:</Text>
            <Text className="text-center text-lg">{scannedProduct?.product.name}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-center font-semibold text-lg">Модель:</Text>
            <Text className="text-center text-lg">{scannedProduct?.product.model}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-center font-semibold text-lg">Артикул:</Text>
            <Text className="text-center text-lg">{scannedProduct?.product.model_code}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-center font-semibold text-lg">Размер:</Text>
            <Text className="text-center text-lg">{scannedProduct?.size.name}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-center font-semibold text-lg">Тип:</Text>
            <Text className="text-center text-lg">{scannedProduct?.product.type.name}</Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-center font-semibold text-lg">Кол-во на складе:</Text>
            <Text className="text-center text-lg">{scannedProduct?.quantity}</Text>
          </View>
          <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mb-3 mt-10">
            <TouchableOpacity onPress={() => newScan()}>
              <Text className="text-lg font-bold text-white text-center">Добавить в корзину</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mb-3 ">
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text className="text-lg font-bold text-white text-center">Отменить</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
