import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateIcon from "../../assets/icons/date";
import Icon from "react-native-vector-icons/Ionicons";
import { getTransfers } from "../../services/transferActions";
import { LOCAL_STORAGE_KEYS } from "../../constants";
import ModalTransfers, {
  ModalForTransfer,
} from "./components/choosePlaceForTransfer";
export default function CreateShipment({ navigation }) {
  const [transfers, setTransfers] = useState([]);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getAllTransfers();
      getCurrentPlace();
      setRefreshing(false);
    }, 1000);
  }, []);

  console.log("currentPlace: ", currentPlace?.id);
  const getCurrentPlace = async () => {
    const savedPlace = JSON.parse(
      (await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.SALE_PLACE)) || null
    );
    setCurrentPlace(savedPlace);
  };

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
      const transfers = await getTransfers({
        from_place: currentPlace?.id,
        status: "preparing",
      });
      // const transfers = await getTransfers();
      console.log("transfers-: ", transfers);
      setTransfers(transfers);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    getAllTransfers();
    getCurrentPlace();
  }, []);

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };
  return (
    <SafeAreaProvider>
      <ImageBackground
        resizeMode="cover"
        source={require("../../assets/login-bg.png")}
      >
        <SafeAreaView>
          <TouchableOpacity
            onPress={() => handleNavigate("/")}
            className="flex-row items-center ml-2"
          >
            <Icon name="chevron-back" color={"white"} size={25} />
            <Text className="text-white">Назад</Text>
          </TouchableOpacity>
          <View className="h-full w-full flex justify-start items-center px-6">
            <ModalTransfers
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-white w-full py-5 px-10 rounded-2xl mt-10"
            >
              <Text className="text-[#CD5297] text-xl font-bold text-center">
                Добавить отгрузку
              </Text>
            </TouchableOpacity>
            <View className="w-full">
              <View className="w-full justify-start mt-10 mb-10">
                <Text className="text-base mb-2 text-white">Дата</Text>
                <View className="flex-row items-center gap-x-3 ml-1">
                  <DateIcon color="white" />
                  <Text className="text-base text-white">01.03.24</Text>
                </View>
              </View>
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                style={{ height: 500 }}
                vertical={true}
                className="gap-5 pb-28"
              >
                {transfers.map((transfer, i) => (
                  <View
                    key={i}
                    className="rounded-xl border-x-4 border-y-4 border-[#efceff87] bg-white"
                  >
                    <View className="p-4 border-b border-gray-300 mt-3">
                      <Text className="text-base">{formattedDates[i]}</Text>
                    </View>
                    <View className="p-3 flex-row justify-between">
                      <Text>Отправитель</Text>
                      <Text className="font-semibold text-[#2e2f2f]">
                        {transfer.creator.name === null
                          ? "Асель"
                          : transfer.creator.name}
                      </Text>
                    </View>
                    <View className="p-3 flex-row justify-between">
                      <Text>Количество</Text>
                      <Text className="font-semibold text-[#2e2f2f]">
                        {transfer.quantity ? transfer.quantity : "неизвестно"}
                      </Text>
                    </View>
                    <View className="p-3 flex-row justify-between mb-5">
                      <Text>В торговую точку</Text>
                      <Text className="font-semibold text-[#2e2f2f]">
                        {transfer.to_place?.name
                          ? transfer.to_place?.name
                          : "неизвестно"}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
}
