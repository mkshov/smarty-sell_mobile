import React, { useContext, useEffect, useRef, useState } from "react";
import { styles } from "../styles";
import { Animated, Text, TextInput, TouchableOpacity, useWindowDimensions } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SellCheckbox from "../../components/CheckBox";
import { SelectList } from "react-native-dropdown-select-list";
import { sellContext } from "../../../../contexts/sellContext";
import CustomerBalance from "./CustomerBalance";
import SellChangeWithCustomer from "./Change";

export default function NotReserve({
  data,
  defaultCurrency,
  isChecked,
  mainCurrencyCash,
  totalAmount,
  additionalCurrencyCash,
  paymentInTwoCurrencies,
  additionalCurrencies,
  handleChangeMainCurrency,
  setAdditionalCurrencyCash,
  setPaymentInTwoCurrencies,
  setAdditionalCurrencies,
}) {
  const windowWidth = useWindowDimensions().width;

  const { selectedSellPlace, sellCurrencies } = useContext(sellContext);

  const [isDisabled, setIsDisabled] = useState(false);
  const [displayValue, setDisplayValue] = useState(additionalCurrencyCash.toFixed(2));
  console.log("additionalCurrencyCash: ", additionalCurrencyCash);
  console.log("mainCurrencyCash: ", mainCurrencyCash);
  console.log("displayValue: ", displayValue);

  useEffect(() => {
    setDisplayValue(additionalCurrencyCash.toFixed(2));
  }, [mainCurrencyCash]);

  useEffect(() => {
    let mainCurrency = parseFloat(mainCurrencyCash) || 0;
    if (mainCurrency >= totalAmount) {
      // setAdditionalCurrencyCash("");
      console.log("lol");
      setPaymentInTwoCurrencies(false);
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [mainCurrencyCash]);

  const handleBlur = () => {
    if (displayValue === "" || displayValue === "." || displayValue === "-." || displayValue === "-") {
      setDisplayValue("0.00");
      setAdditionalCurrencyCash(0);
    } else {
      const fullValue = parseFloat(displayValue);
      setDisplayValue(fullValue);
      setAdditionalCurrencyCash(fullValue);
    }
  };

  function handleTextChange(text) {
    // let cash = text.replace(/,/g, ".");
    // const parts = cash.split(".");
    // if (parts.length > 2) {
    //   cash = parts[0] + "." + parts.slice(1).join("");
    // }
    // console.log("cash: ", cash);
    // setAdditionalCurrencyCash(+cash);
    // setDisplayValue(parseFloat(text).toFixed(2));

    // Обработка ввода и сохранение полного значения
    if (text === "" || text === "." || text === "-" || text === "-.") {
      setDisplayValue(text);
      return;
    }

    const fullValue = parseFloat(text);
    if (!isNaN(fullValue)) {
      setDisplayValue(text);
      setAdditionalCurrencyCash(fullValue);
    } else {
      setDisplayValue(displayValue); // Восстановление предыдущего значения при ошибке
    }
  }

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isDisabled ? 0.4 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isDisabled]);

  return (
    <>
      {isChecked.cash && <SellChangeWithCustomer data={data} defaultCurrency={defaultCurrency} />}
      <View className="my-2 relative z-[5]">
        <Animated.View style={{ flexDirection: "row", alignItems: "center", opacity }}>
          <SellCheckbox
            onChange={() => !isDisabled && setPaymentInTwoCurrencies((prev) => !prev)}
            disabled={isDisabled}
            checked={paymentInTwoCurrencies}
          />
          <TouchableOpacity onPress={() => !isDisabled && setPaymentInTwoCurrencies((prev) => !prev)}>
            <Text className="font-bold text-[#CD5297] ml-2">Оплата двумя валютами</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View className="mb-1 z-[5]">
        {/* {paymentInTwoCurrencies && ( */}
        <View className={`relative mb-3 ${paymentInTwoCurrencies ? "block" : "hidden"}`}>
          <Text className="font-bold text-base text-[#CD5297] my-2">Дополнительная валюта</Text>
          <View className="flex-row items-center justify-between">
            <TextInput
              onChangeText={handleTextChange}
              // defaultValue={additionalCurrencyCash.toFixed(2)}
              value={displayValue}
              keyboardType="numeric"
              placeholder="Введите сумму..."
              placeholderTextColor="white"
              style={styles.inputStyles}
              onBlur={handleBlur}
            />
            <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
            <SelectList
              dropdownTextStyles={[styles.dropdownTextStyles, windowWidth <= 385 && { fontSize: 14 }]}
              dropdownStyles={[styles.dropdownStyles, styles.dropdownChangeStyle, windowWidth <= 385 && { width: 100 }]}
              boxStyles={[styles.boxStyles, windowWidth <= 385 && { width: 100 }]}
              inputStyles={{ color: "white" }}
              closeicon={<Icon name="close" color="white" size={25} />}
              searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
              arrowicon={<Icon name="arrow-up" color="white" size={20} />}
              dropdownItemStyles={[
                styles.dropdownItemStyles,
                windowWidth <= 385 && {
                  marginHorizontal: 10,
                },
              ]}
              defaultOption={additionalCurrencies.currencies[0]}
              setSelected={(currency) => {
                setAdditionalCurrencies((prev) => ({ ...prev, selectedCurrency: currency }));
              }}
              search={false}
              data={additionalCurrencies.currencies}
            />
          </View>
        </View>
        {/* )} */}
        <Text className="font-bold text-base text-[#CD5297] mb-2">Основная валюта</Text>
        <View className="flex-row items-center justify-between ">
          <TextInput
            onChangeText={handleChangeMainCurrency}
            value={mainCurrencyCash}
            keyboardType="numeric"
            placeholder="Введите сумму..."
            placeholderTextColor="white"
            style={styles.inputStyles}
          />
          <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
          <Text className={`font-bold text-lg text-[#CD5297] w-[150] ${windowWidth <= 385 && "w-[100] text-sm"}`}>
            {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name}
          </Text>
        </View>
      </View>

      {isChecked.fromTheBalance && (
        <View>
          <View className="w-full h-[2px] bg-gray-200 my-2 relative z-[-4]"></View>

          <CustomerBalance defaultCurrency={defaultCurrency} data={data} />

          <Text className="font-bold text-base text-[#CD5297] my-2">Сдача в баланс</Text>
          <View className="flex-row items-center justify-between  relative z-10">
            <SelectList
              dropdownTextStyles={styles.dropdownTextStyles}
              dropdownStyles={[styles.dropdownStyles, styles.dropdownChangeStyle]}
              boxStyles={styles.boxStyles}
              inputStyles={{ color: "white" }}
              closeicon={<Icon name="close" color="white" size={25} />}
              searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
              arrowicon={<Icon name="arrow-up" color="white" size={20} />}
              dropdownItemStyles={styles.dropdownItemStyles}
              defaultOption={defaultCurrency}
              setSelected={(currency) => {
                console.log("currency: ", currency);
              }}
              search={false}
              data={data.currencies}
            />
            <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
            <Text className={`font-bold text-lg text-[#CD5297] w-[150] ${windowWidth <= 385 && "w-[100] text-sm"}`}>0</Text>
          </View>
        </View>
      )}

      {isChecked.inDebt && (
        <View className="relative z-10">
          <View className="w-full h-[2px] bg-gray-200 my-2 z-[-4]"></View>
          <Text className="font-bold text-base text-[#CD5297] mb-2">Сумма долга</Text>
          <View className="flex-row items-center justify-between">
            <SelectList
              dropdownTextStyles={styles.dropdownTextStyles}
              dropdownStyles={[styles.dropdownStyles, styles.dropdownChangeStyle]}
              boxStyles={styles.boxStyles}
              inputStyles={{ color: "white" }}
              closeicon={<Icon name="close" color="white" size={25} />}
              searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
              arrowicon={<Icon name="arrow-up" color="white" size={20} />}
              dropdownItemStyles={styles.dropdownItemStyles}
              defaultOption={defaultCurrency}
              setSelected={(currency) => {
                console.log("currency: ", currency);
              }}
              search={false}
              data={data.currencies}
            />
            <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
            <Text className={`font-bold text-lg text-[#CD5297] w-[150] ${windowWidth <= 385 && "w-[100] text-sm"}`}>0</Text>
          </View>
        </View>
      )}

      <View className="w-full h-[2px] bg-gray-200 my-2 z-[-4]"></View>
    </>
  );
}
