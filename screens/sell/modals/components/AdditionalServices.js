import React, { useContext, useEffect, useState } from "react";
import { Text, TextInput, View, useWindowDimensions } from "react-native";
import { sellContext } from "../../../../contexts/sellContext";
import WithOutSearchSelect from "../../components/WithOutSearchSelect";
import { styles } from "../styles";

export default function AdditionalServices({ data, setTotalAmount, totalAmount, defaultCurrency }) {
  console.log("totalAmount: ", totalAmount);
  const windowWidth = useWindowDimensions().width;
  const { selectedSellPlace, setSelectedSellPlace } = useContext(sellContext);

  const [cash, setCash] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [converted, setConverted] = useState(0);
  const [previousConverted, setPreviousConverted] = useState(0); // для хранения предыдущего значения

  useEffect(() => {
    if (cash) {
      let convertedValue = convertToUSD(parseFloat(cash), selectedCurrency, data);
      if (!isNaN(convertedValue)) {
        setConverted(convertedValue);
        updateTotalAmount(convertedValue - previousConverted); // обновить на разницу
        setPreviousConverted(convertedValue); // обновить предыдущее значение
      }
    } else {
      updateTotalAmount(-previousConverted); // уменьшить на предыдущее значение
      setPreviousConverted(0); // сбросить предыдущее значение
      setConverted(0); // сбросить конвертированное значение
    }
  }, [selectedCurrency, cash]);

  function convertToUSD(amount, currency, data) {
    const selectedCurrencyData = data.currencies.find((cur) => cur.key.id === currency.key.id);
    const exchangeRate = selectedCurrencyData ? selectedCurrencyData.key.rate : 1;

    if (selectedSellPlace.selectedCurency.id === currency.key.id) {
      return amount;
    } else {
      return amount / exchangeRate;
    }
  }

  function updateTotalAmount(additionalUSD) {
    setTotalAmount((prevTotal) => (parseFloat(prevTotal) + parseFloat(additionalUSD)).toFixed(2));
  }

  function handleTextChange(text) {
    let newText = text.replace(/,/g, ".");
    const parts = newText.split(".");
    if (parts.length > 2) {
      newText = parts[0] + "." + parts.slice(1).join("");
    }
    setCash(newText);
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

        <WithOutSearchSelect
          width={150}
          defaultOption={defaultCurrency}
          onSelect={(currency) => {
            setSelectedCurrency(currency);
          }}
          search={false}
          data={data.currencies}
        />
      </View>
      <Text className="font-bold text-base text-[#CD5297] mt-2">
        Конвертация: {converted.toFixed(2)} {selectedSellPlace.selectedCurency.name}
      </Text>
    </View>
  );
}
