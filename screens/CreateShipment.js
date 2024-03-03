import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateIcon from "../assets/icons/date";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { getTransfers } from "../services/transferActions";
export default function CreateShipment({ navigation }) {
  const [transfers, setTransfers] = useState([]);
  console.log("transfers: ", transfers);

  const formattedDates = transfers.map((item) => {
    const date = new Date(item.date);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    let formattedDate = date.toLocaleDateString("ru-RU", options);
    formattedDate = formattedDate.replace(/г.\s/, "");
    formattedDate = formattedDate.replace(/\sв\s/, ", в ");
    return formattedDate;
  });

  const getAllTransfers = async () => {
    try {
      const transfers = await getTransfers();
      setTransfers(transfers);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    getAllTransfers();
  }, []);

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TouchableOpacity
          onPress={() => handleNavigate("Home")}
          className="flex-row items-center ml-2"
        >
          <Icon name="chevron-back" size={25} />
          <Text>Назад</Text>
        </TouchableOpacity>
        <View className="h-full w-full flex justify-start items-center px-6">
          <TouchableOpacity className="bg-sky-400 w-full py-5 px-10 rounded-2xl mt-10">
            <Text className="text-white text-center text-xl ">
              Добавить отгрузку
            </Text>
          </TouchableOpacity>
          <View className="w-full">
            <View className="w-full justify-start mt-10 mb-10">
              <Text className="text-base mb-2">Дата</Text>
              <View className="flex-row items-center gap-x-3 ml-1">
                <DateIcon />
                <Text className="text-base">01.03.24</Text>
              </View>
            </View>
            <ScrollView vertical={true} className="gap-5">
              {transfers.map((transfer, i) => (
                <View key={i} className="border rounded-xl border-gray-300">
                  <View className="p-4 border-b border-gray-300 mt-3">
                    <Text className="text-base">{formattedDates[i]}</Text>
                  </View>
                  <View className="p-3 flex-row justify-between">
                    <Text>Отправитель</Text>
                    <Text className="font-semibold">
                      {transfer.creator.name === null
                        ? "Асель"
                        : transfer.creator.name}
                    </Text>
                  </View>
                  <View className="p-3 flex-row justify-between">
                    <Text>Количество</Text>
                    <Text className="font-semibold">
                      {transfer.quantity ? transfer.quantity : "неизвестно"}
                    </Text>
                  </View>
                  <View className="p-3 flex-row justify-between mb-5">
                    <Text>В торговую точку</Text>
                    <Text className="font-semibold">Европа 2</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
