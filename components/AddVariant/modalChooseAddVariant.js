import { LinearGradient } from "expo-linear-gradient";
import React, { useContext } from "react";
import { Alert, Modal, Pressable, Text, TouchableOpacity } from "react-native";
import { showMessage } from "react-native-flash-message";
import { transferContext } from "../../contexts/transferContext";
import { sellContext } from "../../contexts/sellContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ModalChooseAddVariant(props) {
  const { modalVisible, setModalVisible, handleNavigate, scanPath } = props;
  const { scannedProduct, scanInPlace } = useContext(transferContext);
  const { selectedSellPlace, sellCart, setSellCart } = useContext(sellContext);

  const toScan = () => {
    setModalVisible(!modalVisible);
    handleNavigate(scanPath);
  };

  const handleBarCodeScanned = async ({ data = "0113067500038" }) => {
    const dataSend = {
      barcode: data,
      place: selectedSellPlace.selectedPlace.id,
    };
    let res = await scanInPlace(dataSend);
    console.log("res: ", res);
    if (res.barcode && data.length >= 12) {
      newScan(res);
    } else if (data.length < 12) {
      Alert.alert(`Продукт с кодом - ${data} не найден! Убедитесь, что в коде не менее 12 символов.`);
      return;
    } else {
      if (res.errors[0].code === "not_found") {
        Alert.alert(`Продукт с кодом - ${data} не найден!`);
      }
    }
  };

  const newScan = async (res) => {
    const isProductExist = sellCart.some((product) => product.id === res.id);

    if (!res.quantity) {
      Alert.alert("Нет продуктов для добавления!");
      return;
    } else if (!res.product.price_rule) {
      Alert.alert("У продукта нет цены, такой продукт невозможно добавить в корзину!");
    } else {
      if (!isProductExist) {
        const newScannedProducts = [...sellCart, { ...res, newQuantity: 1, discountPrice: res.product.price_rule.price }];
        setSellCart(newScannedProducts);
        await AsyncStorage.setItem("sellCart", JSON.stringify(newScannedProducts));
        Alert.alert("Продукт успешно добавлен в корзину!");
      } else {
        Alert.alert("Продукт уже есть в корзине!");
      }
    }
    showMessage({
      message: "Продукт добавлен в корзину",
      type: "success",
    });
    setModalVisible(!modalVisible);
  };

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
          <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mb-3 mt-5">
            <TouchableOpacity onPress={() => toScan()}>
              <Text className="text-lg font-bold text-white text-center">Отсканировать QR Code</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mb-3 ">
            <TouchableOpacity onPress={handleBarCodeScanned}>
              <Text className="text-lg font-bold text-white text-center">Добавить вручную</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
