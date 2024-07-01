import React, { useContext, useState } from "react";
import { styles } from "../styles";
import { Text, TextInput, useWindowDimensions } from "react-native";
import { View } from "react-native";
import { sellContext } from "../../../../contexts/sellContext";

export default function SellWithCustomerReserve() {
  const windowWidth = useWindowDimensions().width;

  const { selectedSellPlace } = useContext(sellContext);

  const [cashAmount, setCashAmount] = useState("");

  function handleTextChange(text) {
    let newText = text.replace(/,/g, ".");

    const parts = newText.split(".");
    if (parts.length > 2) {
      newText = parts[0] + "." + parts.slice(1).join("");
    }

    setCashAmount(newText);
  }

  return (
    <>
      <View className="mb-1 z-[-5]">
        <Text className="font-bold text-base text-[#CD5297] mb-2">Предоплата</Text>
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
          <Text className={`font-bold text-lg text-[#CD5297] w-[150] ${windowWidth <= 385 && "w-[100] text-sm"}`}>
            {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name}
          </Text>
        </View>
        <View className="w-full h-[2px] bg-gray-200 mb-4 mt-2 z-[-4]"></View>
      </View>
    </>
  );
}
