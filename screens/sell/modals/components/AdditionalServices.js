import React, { useContext, useEffect, useState } from "react";
import { Text, TextInput, View, useWindowDimensions } from "react-native";
import { sellContext } from "../../../../contexts/sellContext";
import { styles } from "../styles";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";

export default function AdditionalServices({ data, setTotalAmount, setMainCurrencyCash, setChangeAmount, defaultCurrency }) {
  const windowWidth = useWindowDimensions().width;
  const { selectedSellPlace } = useContext(sellContext);

  const [cash, setCash] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [converted, setConverted] = useState(0);
  const [previousConverted, setPreviousConverted] = useState(0);

  useEffect(() => {
    updateConversion();
  }, [selectedCurrency, cash]);

  useEffect(() => {
    updateTotalAmount(0);
    setPreviousConverted(0);
    setConverted(0);
    setCash("");
  }, [selectedSellPlace.selectedCurency]);

  function updateConversion() {
    if (cash) {
      const convertedValue = convertToSelectedCurrency(parseFloat(cash), selectedCurrency, selectedSellPlace.selectedCurency);
      if (!isNaN(convertedValue)) {
        setConverted(convertedValue);
        updateTotalAmount(convertedValue - previousConverted);
        setPreviousConverted(convertedValue);
      }
    } else {
      updateTotalAmount(-previousConverted);
      setPreviousConverted(0);
      setConverted(0);
    }
  }

  function convertToSelectedCurrency(amount, currencyFrom, currencyTo) {
    const currencyFromData = data.currencies.find((cur) => cur.key.id === currencyFrom.id);
    const currencyToData = data.currencies.find((cur) => cur.key.id === currencyTo.id);
    const rateFrom = currencyFromData ? currencyFromData.key.rate : 1;
    const rateTo = currencyToData ? currencyToData.key.rate : 1;

    return (amount / rateFrom) * rateTo;
  }

  function updateTotalAmount(additionalAmount) {
    if (isNaN(additionalAmount)) {
      additionalAmount = 0;
    }
    setTotalAmount((prevTotal) => {
      const newTotal = parseFloat(prevTotal) + parseFloat(additionalAmount);
      return newTotal.toFixed(2);
    });
  }

  function handleTextChange(text) {
    let newText = text.replace(/,/g, ".");
    const parts = newText.split(".");
    setMainCurrencyCash("");
    setChangeAmount(0);
    if (parts.length > 2) {
      newText = parts[0] + "." + parts.slice(1).join("");
    }
    if (!newText || isNaN(parseFloat(newText))) {
      newText = "";
      updateTotalAmount(-previousConverted);
      setPreviousConverted(0);
      setConverted(0);
    }
    setCash(newText);
  }

  return (
    <View className="relative z-[21]">
      <Text className="font-bold text-base text-[#CD5297] mb-2">Дополнительные услуги</Text>
      <View className="flex-row items-center justify-between">
        <TextInput
          onChangeText={handleTextChange}
          value={cash}
          keyboardType="numeric"
          placeholder="Введите сумму..."
          placeholderTextColor="white"
          style={styles.inputStyles}
        />
        <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>

        <SelectList
          dropdownTextStyles={styles.dropdownTextStyles}
          dropdownStyles={[styles.dropdownStyles]}
          boxStyles={styles.boxStyles}
          inputStyles={{ color: "white" }}
          closeicon={<Icon name="close" color="white" size={25} />}
          searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
          arrowicon={<Icon name="arrow-down" color="white" size={20} />}
          dropdownItemStyles={styles.dropdownItemStyles}
          defaultOption={defaultCurrency}
          setSelected={(currency) => {
            setSelectedCurrency(currency);
          }}
          placeholder={"Выбрать валюту"}
          search={false}
          data={data.currencies}
        />
      </View>
      <Text className="font-bold text-base text-[#CD5297] mt-2">
        Конвертация: {converted.toFixed(2)} {selectedSellPlace.selectedCurency.name}
      </Text>
      <Text className="font-bold text-base text-[#CD5297] max-w-[200px]">
        по курсу 1$ = {selectedCurrency.rate} {selectedCurrency.name}
      </Text>
    </View>
  );
}
