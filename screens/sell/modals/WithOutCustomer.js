import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";
import SellConfirmModal from "./confirm";
import { sellContext } from "../../../contexts/sellContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SellCheckModal from "./sellCheckModal";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";

export default function ModalForSellWithOutCustomer(props) {
  const { modalVisible, setModalVisible, data, selectedSellPlace, setSelectedSellPlace, totalPrice, sellCart } = props;
  console.log("sellCart: ", sellCart);

  const navigation = useNavigation();

  const { sendProductsWithOutCustomer, setSellCart } = useContext(sellContext);

  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);

  const [cashAmount, setCashAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(totalPrice());
  const [changeAmount, setChangeAmount] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [disabledStyle, setDisabledStyle] = useState(null);

  useEffect(() => {
    if (disabled) {
      setDisabledStyle({ opacity: 0.5 });
    } else {
      setDisabledStyle({ opacity: 1 });
    }
  }, [disabled]);

  const handleTextChange = (text) => {
    let newText = text.replace(/,/g, ".");

    const parts = newText.split(".");
    if (parts.length > 2) {
      newText = parts[0] + "." + parts.slice(1).join("");
    }

    setCashAmount(newText);
    calculateChange(newText);
  };

  const calculateChange = (amount) => {
    const cash = parseFloat(amount) || 0;
    const total = parseFloat(totalAmount) || parseFloat(totalPrice());
    const change = cash > total ? (cash - total).toFixed(2) : 0;
    cash < total ? setDisabled(true) : setDisabled(false);
    setChangeAmount(change);
  };

  const defaultCurrency = {
    key: selectedSellPlace.selectedCurency,
    value: selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name,
  };

  const handleClick = async () => {
    const products = sellCart.map((item) => {
      return { product: item.product.id, quantity: item.newQuantity, size: item.size.id, place: selectedSellPlace.selectedPlace[0] };
    });
    const total = parseFloat(totalAmount) || 0;
    const body = {
      place: selectedSellPlace.selectedPlace[0],
      payment: [{ currency: selectedSellPlace.selectedCurency.id, amount: total }],
      sell_products: products,
      change_currency: selectedSellPlace.selectedCurency.id,
    };
    setModalCheck(true);
    try {
      // sendProductsWithOutCustomer(body);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const handleCloseTheSell = async () => {
    setModalCheck(false);
    setModalConfirm(false);
    setModalVisible(false);
    setChangeAmount(0);
    setTotalAmount(0);
    setCashAmount("");
    // setSellCart([]);
    // await AsyncStorage.removeItem("sellCart");
    showMessage({
      message: `Продажа произведена успешно!`,
      type: "success",
    });
  };

  const showCheck = () => {
    setModalCheck(false);
    setModalConfirm(false);
    setModalVisible(false);
    navigation.navigate("sell-check");
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
      <KeyboardAvoidingView behavior="padding">
        <Pressable onPress={() => setModalVisible(!modalVisible)} className="items-center justify-center w-full h-full px-6 bg-[#00000077]">
          <Pressable activeOpacity={1} className="bg-white w-full rounded-2xl p-7">
            <Text className="text-xl font-bold text-[#CD5297] text-center">Оформление продажи</Text>
            <View className="mt-5">
              <Text className="font-bold text-base text-[#CD5297] mb-2">Оплата по валюте</Text>
              <SelectList
                dropdownTextStyles={styles.dropdownTextStyles}
                dropdownStyles={styles.dropdownStyles}
                boxStyles={styles.boxStyles}
                inputStyles={{ color: "white" }}
                closeicon={<Icon name="close" color="white" size={25} />}
                searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
                arrowicon={<Icon name="arrow-down" color="white" size={20} />}
                dropdownItemStyles={styles.dropdownItemStyles}
                defaultOption={defaultCurrency}
                setSelected={(currency) => {
                  console.log("currency: ", currency);
                  totalPrice(currency);
                  setSelectedSellPlace({
                    ...selectedSellPlace,
                    selectedCurency: currency,
                  });
                  const newTotal = totalPrice(currency);
                  setTotalAmount(newTotal);
                  calculateChange(cashAmount, newTotal);
                }}
                placeholder={"Выбрать валюту"}
                search={false}
                data={data.currencies}
              />
            </View>
            <View className="mt-2" style={{ position: "relative", zIndex: -1 }}>
              <Text className="font-bold text-base text-[#CD5297] mb-2">Оплата наличными</Text>
              <TextInput
                onChangeText={handleTextChange}
                value={cashAmount}
                keyboardType="numeric"
                placeholder="Введите сумму..."
                placeholderTextColor="white"
                style={styles.inputStyles}
              />
            </View>

            <View className="mt-5" style={{ position: "relative", zIndex: -1 }}>
              <Text className="font-bold text-lg text-[#CD5297] mb-1">
                К оплате: {totalPrice()} {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name}
              </Text>
              <Text className="font-bold text-lg text-[#CD5297]">
                Сдача: {changeAmount} {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name}
              </Text>
            </View>

            <View className="flex-row justify-between items-center mt-8">
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 px-10 rounded-2xl">
                  <Text className="text-white font-semibold">Закрыть</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={disabledStyle} disabled={disabled} onPress={() => setModalConfirm(true)}>
                <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 px-10 rounded-2xl">
                  <Text className="text-white font-semibold">Продать</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <SellConfirmModal
              setModalCheck={setModalCheck}
              modalCheck={modalCheck}
              modalVisible={modalConfirm}
              setModalVisible={setModalConfirm}
              handleClick={handleClick}
              handleCloseTheSell={handleCloseTheSell}
              showCheck={showCheck}
            />
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
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
  },
  dropdownStyles: {
    borderWidth: 0,
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    top: 45,
    backgroundColor: "#f5f5f5",
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
  inputStyles: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    width: "100%",
    paddingLeft: 15,
    backgroundColor: "#ED83C1",
    color: "white",
    fontWeight: "bold",
  },
});
