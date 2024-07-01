import React, { useContext } from "react";
import { styles } from "../styles";
import { Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SellCheckbox from "../../components/CheckBox";
import { SelectList } from "react-native-dropdown-select-list";
import { sellContext } from "../../../../contexts/sellContext";
import useTotalPrice from "../../hooks/useTotalPrice";

export default function ToPay({ data, defaultCurrency, setChecked, isChecked, calculateChange, setTotalAmount, cashAmount }) {
  const windowWidth = useWindowDimensions().width;

  const { selectedSellPlace, sellCart, setSelectedSellPlace } = useContext(sellContext);

  console.log("selectedSellPlace: ", selectedSellPlace);

  const totalPrice = useTotalPrice(sellCart, selectedSellPlace);

  return (
    <View className="mt-5 relative z-[12]">
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
          search={false}
          data={data.currencies}
        />
        <View className="w-3 h-[2px] bg-gray-200 mx-1"></View>
        <Text className={`font-bold text-lg text-[#CD5297] w-[150] ${windowWidth <= 385 && "w-[100] text-sm"}`}>
          {totalPrice()} {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name}
        </Text>
      </View>
      <Text className="font-bold text-base text-[#CD5297] mt-3 mb-2 relative z-[-1]">Способ оплаты</Text>

      <View className={`flex-row gap-x-12 relative z-[-1] ${windowWidth <= 385 && " gap-x-5"}`}>
        <View className="gap-y-4">
          <View className="flex-row items-center">
            <SellCheckbox
              onChange={() =>
                setChecked((prev) => ({
                  inDebt: false,
                  fromTheBalance: false,
                  cash: true,
                  reserve: false,
                }))
              }
              checked={isChecked.cash}
            />
            <TouchableOpacity
              className="ml-2"
              onPress={() =>
                setChecked((prev) => ({
                  inDebt: false,
                  fromTheBalance: false,
                  cash: true,
                  reserve: false,
                }))
              }
            >
              <Text className="font-bold text-[#CD5297]">Наличными</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <SellCheckbox
              checked={isChecked.fromTheBalance}
              onChange={() =>
                setChecked((prev) => ({
                  inDebt: false,
                  fromTheBalance: true,
                  cash: false,
                  reserve: false,
                }))
              }
            />
            <TouchableOpacity
              className="ml-2"
              onPress={() =>
                setChecked((prev) => ({
                  inDebt: false,
                  fromTheBalance: true,
                  cash: false,
                  reserve: false,
                }))
              }
            >
              <Text className="font-bold text-[#CD5297]">С баланса</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="gap-y-4">
          <View className="flex-row items-center">
            <SellCheckbox
              checked={isChecked.inDebt}
              onChange={() =>
                setChecked((prev) => ({
                  inDebt: true,
                  fromTheBalance: false,
                  cash: false,
                  reserve: false,
                }))
              }
            />
            <TouchableOpacity
              className="ml-2"
              onPress={() =>
                setChecked((prev) => ({
                  inDebt: true,
                  fromTheBalance: false,
                  cash: false,
                  reserve: false,
                }))
              }
            >
              <Text className="font-bold text-[#CD5297]">В долг</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <SellCheckbox
              checked={isChecked.reserve}
              onChange={() =>
                setChecked((prev) => ({
                  inDebt: false,
                  fromTheBalance: false,
                  cash: false,
                  reserve: true,
                }))
              }
            />
            <TouchableOpacity
              className="ml-2"
              onPress={() =>
                setChecked((prev) => ({
                  inDebt: false,
                  fromTheBalance: false,
                  cash: false,
                  reserve: true,
                }))
              }
            >
              <Text className="font-bold text-[#CD5297]">Забронировать</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="w-full h-[2px] bg-gray-200 my-2 z-[-3]"></View>
    </View>
  );
}
