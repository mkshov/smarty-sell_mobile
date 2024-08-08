import React, { useContext, useEffect, useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "../styles";
import { sellContext } from "../../../../contexts/sellContext";

export default function CustomerBalance({ defaultCurrency, data }) {
  const windowWidth = useWindowDimensions().width;

  const { selectedSellPlace } = useContext(sellContext);

  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [balance, setBalance] = useState(selectedSellPlace.customer.balance);

  const convertToDefaultCurrency = (balance, defaultRate) => {
    return balance * defaultRate;
  };

  const convertBalance = (balance, defaultRate, selectedRate) => {
    const balanceInDefaultCurrency = convertToDefaultCurrency(balance, defaultRate);
    return balanceInDefaultCurrency * selectedRate;
  };

  useEffect(() => {
    const convertedBalance = convertBalance(selectedSellPlace.customer.balance, defaultCurrency.key.rate, selectedCurrency.rate);
    setBalance(convertedBalance);
  }, [selectedCurrency]);

  return (
    <View className="relative z-[20]">
      <View className="relative z-[21]">
        <Text className="font-bold text-base text-[#CD5297] mb-2">Баланс покупателя</Text>
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
            defaultOption={defaultCurrency}
            setSelected={(currency) => {
              setSelectedCurrency(currency);
            }}
            data={data.currencies}
            search={false}
          />
          <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
          <Text className={`font-bold text-lg text-[#CD5297] w-[150] ${windowWidth <= 385 && "w-[100] text-sm"}`}>
            {balance} {selectedCurrency.name}
          </Text>
        </View>
      </View>
      <View>
        <Text className="font-bold text-base text-[#CD5297] my-2">Сдача в баланс</Text>
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
    </View>
  );
}
