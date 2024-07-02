import React, { useContext, useEffect, useState } from "react";
import { Text, TextInput, View, useWindowDimensions } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "../styles";
import { sellContext } from "../../../../contexts/sellContext";

export default function AdditionalServices({ data, defaultCurrency, setTotalAmount }) {
  const windowWidth = useWindowDimensions().width;

  const { selectedSellPlace } = useContext(sellContext);
  console.log("К оплате: ", selectedSellPlace.selectedCurency);

  const [cash, setCash] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [converted, setConverted] = useState(0);
  console.log("Выбранная валюта: ", selectedCurrency);

  useEffect(() => {
    let converted = parseFloat((cash / selectedCurrency.rate).toFixed(2));
    setTotalAmount((prevTotal) => {
      const newTotal = prevTotal + converted;
      return parseFloat(newTotal).toFixed(2);
    });
  }, [selectedCurrency]);

  function handleTextChange(text) {
    let newText = text.replace(/,/g, ".");
    const parts = newText.split(".");
    if (parts.length > 2) {
      newText = parts[0] + "." + parts.slice(1).join("");
    }
    const previousCash = parseFloat(cash) || 0;
    setCash(newText);

    const newCash = parseFloat(newText) || 0;
    const newConverted = parseFloat((newCash / selectedCurrency.rate).toFixed(2));
    setConverted(newConverted);

    setTotalAmount((prevTotal) => {
      const newTotal = prevTotal - previousCash / selectedCurrency.rate + newConverted;
      return parseFloat(newTotal.toFixed(2));
    });
  }
  return (
    <View className="relative z-[11]">
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
          dropdownTextStyles={[styles.dropdownTextStyles, windowWidth <= 385 && { fontSize: 14 }]}
          dropdownStyles={[styles.dropdownStyles, windowWidth <= 385 && { width: 100 }]}
          boxStyles={[styles.boxStyles, windowWidth <= 385 && { width: 100 }]}
          inputStyles={{ color: "white" }}
          closeicon={<Icon name="close" color="white" size={25} />}
          searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
          arrowicon={<Icon name="arrow-down" color="white" size={20} />}
          dropdownItemStyles={[styles.dropdownItemStyles, windowWidth <= 385 && { marginHorizontal: 10 }]}
          defaultOption={defaultCurrency}
          setSelected={(currency) => {
            setSelectedCurrency(currency);
          }}
          search={false}
          data={data.currencies}
        />
      </View>
    </View>
  );
}
