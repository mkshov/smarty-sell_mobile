import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";
import SellConfirmModal from "./confirm";
import { sellContext } from "../../../contexts/sellContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SellCheckModal from "./sellCheckModal";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import { err } from "react-native-svg";
import SellCheckbox from "../components/CheckBox";
import CustomerBalance from "./components/CustomerBalance";
import AdditionalServices from "./components/AdditionalServices";
import ToPay from "./components/ToPay";
import NotReserve from "./components/NotReserve";
import SellChangeWithCustomer from "./components/Change";
import SellWithCustomerReserve from "./components/Reserve";

export default function ModalForSellWithCustomer(props) {
  const { modalVisible, setModalVisible, data, selectedSellPlace, setSelectedSellPlace, totalPrice, sellCart } = props;

  const windowWidth = useWindowDimensions().width;
  const navigation = useNavigation();

  const { sendProductsWithOutCustomer, setSellCart, changeAmount, setChangeAmount, error, modalCheck, setModalCheck, modalConfirm, setModalConfirm } =
    useContext(sellContext);

  const [cashAmount, setCashAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(totalPrice());
  const [additionalAmount, setAdditionalAmount] = useState(0);

  const [disabled, setDisabled] = useState(true);
  const [disabledStyle, setDisabledStyle] = useState(null);
  const isSellDisabled = sellCart.length === 0 || totalPrice === 0;

  const [isChecked, setChecked] = useState({
    cash: true,
    fromTheBalance: false,
    inDebt: false,
    reserve: false,
  });

  useEffect(() => {
    if (disabled) {
      setDisabledStyle({ opacity: 0.5 });
    } else {
      setDisabledStyle({ opacity: 1 });
    }
  }, [disabled]);

  useEffect(() => {
    return () => {
      setSelectedSellPlace((prev) => ({ ...prev, withOutCustomer: false }));
    };
  }, []);

  const handleCashCashChange = (text) => {
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
    const total = parseFloat(totalAmount);
    const change = cash > total ? (cash - total).toFixed(2) : 0;
    cash < total || total === 0 ? setDisabled(true) : setDisabled(false);
    setChangeAmount(change);
  };

  const defaultCurrency = {
    key: selectedSellPlace.selectedCurency,
    value: selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name,
  };

  const handleClick = async () => {
    setChangeAmount(0);
    setTotalAmount(0);
    setCashAmount("");
  };
  const handleCloseTheSell = async () => {
    setModalCheck(false);
    setModalConfirm(false);
    setModalVisible(false);
    setChangeAmount(0);
    setTotalAmount(0);
    setCashAmount("");
    setSellCart([]);
    await AsyncStorage.removeItem("sellCart");
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
      <Pressable onPress={() => setModalVisible(!modalVisible)} className="items-center justify-center w-full h-full px-3 bg-[#00000077]">
        <KeyboardAvoidingView behavior="padding" className="w-full">
          <SafeAreaView>
            <KeyboardAvoidingView behavior="padding">
              <Pressable activeOpacity={1} className="bg-white w-full h-full rounded-2xl p-7">
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text className="text-xl font-bold text-[#CD5297] text-center">Оформление продажи</Text>
                  <ToPay
                    data={data}
                    defaultCurrency={defaultCurrency}
                    setChecked={setChecked}
                    calculateChange={calculateChange}
                    isChecked={isChecked}
                    setTotalAmount={setTotalAmount}
                    totalAmount={totalAmount}
                  />

                  <AdditionalServices
                    defaultCurrency={defaultCurrency}
                    data={data}
                    onChange={setAdditionalAmount}
                    setTotalAmount={setTotalAmount}
                    totalAmount={totalAmount}
                  />
                  <View className="w-full h-[2px] bg-gray-200 my-2 relative z-[-2]"></View>

                  {!isChecked.reserve && (
                    <NotReserve
                      handleChange={handleCashCashChange}
                      cashAmount={cashAmount}
                      data={data}
                      defaultCurrency={defaultCurrency}
                      isChecked={isChecked}
                    />
                  )}
                  {isChecked.cash && <SellChangeWithCustomer data={data} defaultCurrency={defaultCurrency} />}

                  {isChecked.reserve && <SellWithCustomerReserve />}

                  <View className="flex-row justify-between items-center mt-3 z-[-1]">
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
                </ScrollView>
              </Pressable>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Pressable>
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
    alignItems: "center",
    marginVertical: 3,
    marginHorizontal: 20,
  },
  boxStyles: {
    backgroundColor: "#ED83C1",
    height: 50,
    alignItems: "center",
    borderWidth: 0,
    elevation: Platform.OS === "android" ? 5 : 0,
    width: 150,
    position: "relative",
    zIndex: 5,
  },
  dropdownStyles: {
    borderWidth: 0,
    position: "absolute",
    left: 0,
    right: 0,
    top: 45,
    backgroundColor: "#f5f5f5",
    width: 150,
    zIndex: 10,
  },
  dropdownChangeStyle: {
    bottom: 55,
    top: "none",
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
    width: 150,
    paddingLeft: 15,
    backgroundColor: "#ED83C1",
    color: "white",
    fontWeight: "bold",
  },
});
