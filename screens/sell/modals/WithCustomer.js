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

export default function ModalForSellWithCustomer(props) {
  const { modalVisible, setModalVisible, data, selectedSellPlace, setSelectedSellPlace, totalPrice, sellCart } = props;

  const navigation = useNavigation();

  const { sendProductsWithOutCustomer, setSellCart, changeAmount, setChangeAmount, error, modalCheck, setModalCheck, modalConfirm, setModalConfirm } =
    useContext(sellContext);

  const [cashAmount, setCashAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState(totalPrice());

  const [disabled, setDisabled] = useState(true);
  const [disabledStyle, setDisabledStyle] = useState(null);
  const isSellDisabled = sellCart.length === 0 || totalPrice === 0;

  const [isChecked, setChecked] = useState({
    cash: true,
    fromTheBalance: false,
    inDebt: false,
    book: false,
  });

  const [paymentInTwoCurrnecies, setPaymentInTwoCurrencies] = useState(false);

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
    cash < total || total === 0 ? setDisabled(true) : setDisabled(false);
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
    const total = parseFloat(cashAmount) || 0;
    const body = {
      place: selectedSellPlace.selectedPlace[0],
      payment: [{ currency: selectedSellPlace.selectedCurency.id, amount: total }],
      sell_products: products,
      change_currency: selectedSellPlace.selectedCurency.id,
    };
    sendProductsWithOutCustomer(body);
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
                <ScrollView>
                  <Text className="text-xl font-bold text-[#CD5297] text-center">Оформление продажи</Text>
                  <View className="mt-5">
                    <Text className="font-bold text-base text-[#CD5297] mb-2">Баланс покупателя</Text>
                    <View className="flex-row items-center justify-between">
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
                      <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
                      <Text className="font-bold text-lg text-[#CD5297] w-[150]">0</Text>
                    </View>
                  </View>
                  <View className="w-full h-[2px] bg-gray-200 my-2 relative z-[-1]"></View>
                  <View className="relative z-[-1]">
                    <Text className="font-bold text-base text-[#CD5297] mb-2">Дополнительные услуги</Text>
                    <View className="flex-row items-center justify-between">
                      <TextInput
                        onChangeText={handleTextChange}
                        value={cashAmount}
                        keyboardType="numeric"
                        placeholder="Введите сумму..."
                        placeholderTextColor="white"
                        style={styles.inputStyles}
                      />
                      <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>

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
                  </View>
                  <View className="w-full h-[2px] bg-gray-200 my-2 relative z-[-1]"></View>

                  <View className="relative z-[-2]">
                    <Text className="font-bold text-base text-[#CD5297] mb-2">К оплате</Text>
                    <View className="flex-row items-center justify-between">
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
                      <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
                      <Text className="font-bold text-lg text-[#CD5297] w-[150]">
                        {totalPrice()} {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name}
                      </Text>
                    </View>
                    <View className="flex-row gap-x-12 mt-5 z-[-1]">
                      <View className="gap-y-4">
                        <View className="flex-row items-center">
                          <SellCheckbox
                            onChange={() => setChecked((prev) => ({ inDebt: false, fromTheBalance: false, cash: true, book: false }))}
                            checked={isChecked.cash}
                          />
                          <TouchableOpacity
                            className="ml-2"
                            onPress={() => setChecked((prev) => ({ inDebt: false, fromTheBalance: false, cash: true, book: false }))}
                          >
                            <Text className="font-bold text-[#CD5297]">Наличными</Text>
                          </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center">
                          <SellCheckbox
                            checked={isChecked.fromTheBalance}
                            onChange={() => setChecked((prev) => ({ inDebt: false, fromTheBalance: true, cash: false, book: false }))}
                          />
                          <TouchableOpacity
                            className="ml-2"
                            onPress={() => setChecked((prev) => ({ inDebt: false, fromTheBalance: true, cash: false, book: false }))}
                          >
                            <Text className="font-bold text-[#CD5297]">С баланса</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View className="gap-y-4">
                        <View className="flex-row items-center">
                          <SellCheckbox
                            checked={isChecked.inDebt}
                            onChange={() => setChecked((prev) => ({ inDebt: true, fromTheBalance: false, cash: false, book: false }))}
                          />
                          <TouchableOpacity
                            className="ml-2"
                            onPress={() => setChecked((prev) => ({ inDebt: true, fromTheBalance: false, cash: false, book: false }))}
                          >
                            <Text className="font-bold text-[#CD5297]">В долг</Text>
                          </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center">
                          <SellCheckbox
                            checked={isChecked.book}
                            onChange={() => setChecked((prev) => ({ inDebt: false, fromTheBalance: false, cash: false, book: true }))}
                          />
                          <TouchableOpacity
                            className="ml-2"
                            onPress={() => setChecked((prev) => ({ inDebt: false, fromTheBalance: false, cash: false, book: true }))}
                          >
                            <Text className="font-bold text-[#CD5297]">Забронировать</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="w-full h-[2px] bg-gray-200 my-2 z-[-3]"></View>

                  <View className="my-2 z-[-3]">
                    <View className="flex-row items-center">
                      <SellCheckbox onChange={() => setPaymentInTwoCurrencies((prev) => !prev)} checked={paymentInTwoCurrnecies} />
                      <TouchableOpacity onPress={() => setPaymentInTwoCurrencies((prev) => !prev)}>
                        <Text className="font-bold text-[#CD5297] ml-2">Оплата двумя валютами</Text>
                      </TouchableOpacity>
                    </View>

                    {paymentInTwoCurrnecies && (
                      <View>
                        <Text className="font-bold text-base text-[#CD5297] my-2">Дополнительная валюта</Text>
                        <View className="flex-row items-center justify-between">
                          <TextInput
                            onChangeText={handleTextChange}
                            value={cashAmount}
                            keyboardType="numeric"
                            placeholder="Введите сумму..."
                            placeholderTextColor="white"
                            style={styles.inputStyles}
                          />
                          <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
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
                      </View>
                    )}
                  </View>

                  <View className="w-full h-[2px] bg-gray-200 my-2 z-[-4]"></View>

                  <View className="mb-1 z-[-5]">
                    <Text className="font-bold text-base text-[#CD5297] mb-2">Основная валюта</Text>
                    <View className="flex-row items-center justify-between ">
                      <TextInput
                        onChangeText={handleTextChange}
                        value={cashAmount}
                        keyboardType="numeric"
                        placeholder="Введите сумму..."
                        placeholderTextColor="white"
                        style={styles.inputStyles}
                      />
                      <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
                      <Text className="font-bold text-lg text-[#CD5297] w-[150]">
                        {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name}
                      </Text>
                    </View>
                  </View>

                  <View className="w-full h-[2px] bg-gray-200 my-2 z-[-4]"></View>

                  <View className="">
                    <Text className="font-bold text-base text-[#CD5297] mb-2">Сдача</Text>
                    <View className="flex-row items-center justify-between">
                      <SelectList
                        dropdownTextStyles={styles.dropdownTextStyles}
                        dropdownStyles={[styles.dropdownStyles, styles.dropdownChangeStyle]}
                        boxStyles={styles.boxStyles}
                        inputStyles={{ color: "white" }}
                        closeicon={<Icon name="close" color="white" size={25} />}
                        searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
                        arrowicon={<Icon name="arrow-down" color="white" size={20} />}
                        dropdownItemStyles={styles.dropdownItemStyles}
                        defaultOption={defaultCurrency}
                        setSelected={(currency) => {
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
                      <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
                      <Text className="font-bold text-lg text-[#CD5297] w-[150]">0</Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mt-8 z-[-1]">
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
