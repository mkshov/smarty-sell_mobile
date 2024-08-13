import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { Text, useWindowDimensions } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SellCheckbox from "../../components/CheckBox";
import { SelectList } from "react-native-dropdown-select-list";
import { sellContext } from "../../../../contexts/sellContext";

export default function SellChangeWithCustomer({ data, calculateChange }) {
  const windowWidth = useWindowDimensions().width;

  const { changeAmount, selectedSellPlace, setChangeAmount } = useContext(sellContext);
  const [balanceSheet, setBalanceSheet] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(selectedSellPlace.selectedCurency);

  return (
    <>
      <View className="relative z-10">
        <Text className="font-bold text-base text-[#CD5297] mb-2">Сдача</Text>
        <View className="flex-row items-center justify-between">
          <SelectList
            dropdownTextStyles={styles.dropdownTextStyles}
            dropdownStyles={[styles.dropdownStyles]}
            boxStyles={styles.boxStyles}
            inputStyles={{ color: "white" }}
            closeicon={<Icon name="close" color="white" size={25} />}
            searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
            arrowicon={<Icon name="arrow-down" color="white" size={20} />}
            dropdownItemStyles={styles.dropdownItemStyles}
            defaultOption={{ key: selectedSellPlace.selectedCurency, value: selectedSellPlace.selectedCurency.name }}
            setSelected={(currency) => {
              const total = calculateChange();
              const changeInDefaultCurrency = total / selectedSellPlace.selectedCurency.rate;
              const converted = currency.rate * changeInDefaultCurrency;
              setSelectedCurrency(currency);
              setChangeAmount(converted);
            }}
            placeholder={"Выбрать валюту"}
            search={false}
            data={data.currencies}
          />
          <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
          <Text className={`font-bold text-lg text-[#CD5297] w-[150] ${windowWidth <= 385 && "w-[100] text-sm"} relative z-[-1]`}>
            {parseFloat(changeAmount).toFixed(2)} {selectedCurrency.name}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mt-3 mb-2">
        <SellCheckbox onChange={() => setBalanceSheet((prev) => !prev)} checked={balanceSheet} />
        <Text onPress={() => setBalanceSheet((prev) => !prev)} className="ml-2 font-bold text-[#CD5297]">
          Добавить сдачу в баланс
        </Text>
      </View>
    </>
  );
}
