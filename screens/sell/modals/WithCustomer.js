import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  ScrollViewBase,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SellConfirmModal from "./confirm";
import { sellContext } from "../../../contexts/sellContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import AdditionalServices from "./components/AdditionalServices";
import ToPay from "./components/ToPay";
import NotReserve from "./components/NotReserve";
import SellWithCustomerReserve from "./components/Reserve";

export default function ModalForSellWithCustomer(props) {
  const { modalVisible, setModalVisible, data, selectedSellPlace, setSelectedSellPlace, totalPrice, sellCart, defaultCurrency } = props;

  const navigation = useNavigation();

  const { setSellCart, setChangeAmount, modalCheck, setModalCheck, modalConfirm, setModalConfirm, sellCurrencies } = useContext(sellContext);

  const [mainCurrencyCash, setMainCurrencyCash] = useState("");
  const [additionalCurrencyCash, setAdditionalCurrencyCash] = useState(0);
  const [additionalCurrencies, setAdditionalCurrencies] = useState({
    currencies: [],
    selectedCurrency: null,
  });

  const [paymentInTwoCurrencies, setPaymentInTwoCurrencies] = useState(false);

  const [totalAmount, setTotalAmount] = useState(totalPrice());

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

  useEffect(() => {
    if (paymentInTwoCurrencies) {
      handleConvertAdditionalCurrency(mainCurrencyCash);
    }
  }, [paymentInTwoCurrencies, additionalCurrencies.selectedCurrency]);

  useEffect(() => {
    // if (paymentInTwoCurrencies) {
    calculateChange();
    // }
  }, [additionalCurrencyCash, paymentInTwoCurrencies, mainCurrencyCash]);

  useEffect(() => {
    let withOutSelectedCurrency = data.currencies.filter((currency) => currency.key.id !== selectedSellPlace.selectedCurency.id);
    setAdditionalCurrencies((prev) => ({ ...prev, currencies: withOutSelectedCurrency }));
    setMainCurrencyCash("");
  }, [selectedSellPlace.selectedCurency]);

  const handleChangeMainCurrency = (text) => {
    let amount = text.replace(/,/g, ".");

    const parts = amount.split(".");
    if (parts.length > 2) {
      amount = parts[0] + "." + parts.slice(1).join("");
    }

    setMainCurrencyCash(amount);
    handleConvertAdditionalCurrency(amount);
  };

  const handleConvertAdditionalCurrency = (amount) => {
    const cash = parseFloat(amount) || 0;
    const total = parseFloat(totalAmount);

    if (!isNaN(cash) && cash < total && additionalCurrencies.selectedCurrency && cash) {
      let convertToSelectedCurrency;
      if (selectedSellPlace.selectedCurency.rate === 1) {
        convertToSelectedCurrency = (total - cash) * additionalCurrencies.selectedCurrency.rate;
      } else {
        if (additionalCurrencies.selectedCurrency.rate === 1) {
          convertToSelectedCurrency = (total - cash) / selectedSellPlace.selectedCurency.rate;
        } else {
          convertToSelectedCurrency = ((total - cash) / selectedSellPlace.selectedCurency.rate) * additionalCurrencies.selectedCurrency.rate;
        }
      }
      setAdditionalCurrencyCash(convertToSelectedCurrency);
      return convertToSelectedCurrency;
    }

    const change = cash > total ? (cash - total).toFixed(2) : 0;
    if (cash < total || total === 0) {
      setDisabled(true);
      setChangeAmount(0);
    } else {
      setDisabled(false);
      setChangeAmount(change);
      console.log("change lol: ", change);
    }
    return 0;
  };

  const calculateChange = () => {
    let mainCash = parseFloat(mainCurrencyCash) || 0;
    const total = parseFloat(totalAmount);

    if (paymentInTwoCurrencies && additionalCurrencies.selectedCurrency) {
      let additionalCash = additionalCurrencyCash || 0;

      let convertedAdditionalCash =
        additionalCurrencies.selectedCurrency.rate === 1
          ? additionalCash * selectedSellPlace.selectedCurency.rate
          : (additionalCash / additionalCurrencies.selectedCurrency.rate) * selectedSellPlace.selectedCurency.rate;

      mainCash += parseFloat(convertedAdditionalCash.toFixed(2));
    }

    mainCash = parseFloat(mainCash.toFixed(2));

    if (mainCash >= total) {
      setChangeAmount((mainCash - total).toFixed(2));
      setDisabled(false);
      return (mainCash - total).toFixed(2);
    } else {
      setChangeAmount(0);
      setDisabled(true);
      return 0;
    }
  };
  // const defaultCurrency = {
  //   key: selectedSellPlace.selectedCurency,
  //   value: selectedSellPlace.selectedCurency?.name,
  // };
  // console.log("defaultCurrency sdsd: ", defaultCurrency);

  const handleClick = async () => {
    setChangeAmount(0);
    setTotalAmount(0);
    setMainCurrencyCash("");
  };
  const handleCloseTheSell = async () => {
    setModalCheck(false);
    setModalConfirm(false);
    setModalVisible(false);
    setChangeAmount(0);
    setTotalAmount(0);
    setMainCurrencyCash("");
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
                    handleConvertAdditionalCurrency={handleConvertAdditionalCurrency}
                    isChecked={isChecked}
                    setTotalAmount={setTotalAmount}
                    totalAmount={totalAmount}
                  />

                  <AdditionalServices
                    defaultCurrency={defaultCurrency}
                    data={data}
                    setTotalAmount={setTotalAmount}
                    setMainCurrencyCash={setMainCurrencyCash}
                    setChangeAmount={setChangeAmount}
                  />
                  <View className="w-full h-[2px] bg-gray-200 my-2 relative z-[-2]"></View>

                  {!isChecked.reserve && (
                    <NotReserve
                      handleChangeMainCurrency={handleChangeMainCurrency}
                      calculateChange={calculateChange}
                      setAdditionalCurrencyCash={setAdditionalCurrencyCash}
                      setPaymentInTwoCurrencies={setPaymentInTwoCurrencies}
                      setAdditionalCurrencies={setAdditionalCurrencies}
                      handleConvertAdditionalCurrency={handleConvertAdditionalCurrency}
                      setTotalAmount={setTotalAmount}
                      additionalCurrencies={additionalCurrencies}
                      paymentInTwoCurrencies={paymentInTwoCurrencies}
                      mainCurrencyCash={mainCurrencyCash}
                      additionalCurrencyCash={additionalCurrencyCash}
                      data={data}
                      defaultCurrency={defaultCurrency}
                      isChecked={isChecked}
                      totalAmount={totalAmount}
                    />
                  )}

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
