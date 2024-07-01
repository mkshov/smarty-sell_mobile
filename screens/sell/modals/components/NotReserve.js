import React, { useContext, useState } from "react";
import { styles } from "../styles";
import { Text, TextInput, TouchableOpacity, useWindowDimensions } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SellCheckbox from "../../components/CheckBox";
import { SelectList } from "react-native-dropdown-select-list";
import { sellContext } from "../../../../contexts/sellContext";
import CustomerBalance from "./CustomerBalance";

export default function NotReserve({ data, defaultCurrency, isChecked, handleChange, cashAmount }) {
  const windowWidth = useWindowDimensions().width;

  const { selectedSellPlace } = useContext(sellContext);

  const [paymentInTwoCurrnecies, setPaymentInTwoCurrencies] = useState(false);

  return (
    <>
      <View className="my-2 relative z-[10]">
        <View className="flex-row items-center">
          <SellCheckbox onChange={() => setPaymentInTwoCurrencies((prev) => !prev)} checked={paymentInTwoCurrnecies} />
          <TouchableOpacity onPress={() => setPaymentInTwoCurrencies((prev) => !prev)}>
            <Text className="font-bold text-[#CD5297] ml-2">Оплата двумя валютами</Text>
          </TouchableOpacity>
        </View>

        {paymentInTwoCurrnecies && (
          <View className="relative z-[5]">
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
                dropdownTextStyles={[styles.dropdownTextStyles, windowWidth <= 385 && { fontSize: 14 }]}
                dropdownStyles={[styles.dropdownStyles, windowWidth <= 385 && { width: 100 }]}
                boxStyles={[styles.boxStyles, windowWidth <= 385 && { width: 100 }]}
                inputStyles={{ color: "white" }}
                closeicon={<Icon name="close" color="white" size={25} />}
                searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
                arrowicon={<Icon name="arrow-down" color="white" size={20} />}
                dropdownItemStyles={[
                  styles.dropdownItemStyles,
                  windowWidth <= 385 && {
                    marginHorizontal: 10,
                  },
                ]}
                defaultOption={defaultCurrency}
                setSelected={(currency) => {
                  console.log("currency: ", currency);
                }}
                search={false}
                data={data.currencies}
              />
            </View>
          </View>
        )}
      </View>

      <View className="w-full h-[2px] bg-gray-200 my-2 relative z-[-4]"></View>

      <View className="mb-1 z-[-5]">
        <Text className="font-bold text-base text-[#CD5297] mb-2">Основная валюта</Text>
        <View className="flex-row items-center justify-between ">
          <TextInput
            onChangeText={handleChange}
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
        <View>
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
