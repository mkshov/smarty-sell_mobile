import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Image, ImageBackground, Modal, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DateIcon from "../../assets/icons/date";
import Icon from "react-native-vector-icons/Ionicons";

import ModalTransfers, { ModalForTransfer } from "./components/choosePlaceForTransfer";
import { workPlaceContext } from "../../contexts/workPlaceContext";
import { STORAGE } from "../../constants";
import { transferContext } from "../../contexts/transferContext";
import { Skeleton } from "moti/skeleton";

export default function CreateShipment({ navigation }) {
  const { getPlaces, places } = useContext(workPlaceContext);
  const { transfers, newTransfer, isLoading, isLoadingTransfers, getTransfers } = useContext(transferContext);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getAllTransfers();
      getCurrentPlace();
      setRefreshing(false);
    }, 2000);
  }, []);

  const getCurrentPlace = async () => {
    const savedPlace = JSON.parse((await AsyncStorage.getItem(STORAGE.SAVED_PLACE)) || null);
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
    getTransfers({ from_place: currentPlace?.id, status: "preparing" });
  };

  const handleOpenModal = () => {
    getPlaces();
    setModalVisible(true);
  };

  useEffect(() => {
    getAllTransfers();
    getCurrentPlace();
  }, []);

  const handleNavigate = (path, id) => {
    navigation.navigate(path, { transferId: id });
  };
  return (
    <SafeAreaProvider>
      <ImageBackground resizeMode="cover" source={require("../../assets/login-bg.png")}>
        <SafeAreaView>
          <TouchableOpacity onPress={() => handleNavigate("/")} className="flex-row items-center ml-2">
            <Icon name="chevron-back" color={"white"} size={25} />
            <Text className="text-white">Назад</Text>
          </TouchableOpacity>
          <View className="h-full w-full flex justify-start items-center px-6">
            <ModalTransfers
              places={places}
              currentPlace={currentPlace}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              getAllTransfers={onRefresh}
            />
            <TouchableOpacity onPress={handleOpenModal} className="bg-white w-full py-5 px-10 rounded-2xl mt-10">
              <Text className="text-[#CD5297] text-xl font-bold text-center">Добавить отгрузку</Text>
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
                refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefresh} />}
                style={{ height: 500 }}
                vertical={true}
                className="gap-3 pb-28"
              >
                {isLoadingTransfers ? (
                  <Text className="text-white text-xl font-bold text-center">Загрузка...</Text>
                ) : (
                  transfers.map((transfer, i) => (
                    <TouchableOpacity key={i} onPress={() => handleNavigate("add-product-for-transfer", transfer.id)}>
                      <View className="rounded-xl border-x-4 border-y-4 border-[#efceff87] bg-white">
                        <View className="p-4 border-b border-gray-300 mt-3">
                          {isLoading ? (
                            <Skeleton show height={24} width={"100%"} radius={"round"} colorMode="light" />
                          ) : (
                            <Text className="text-base">{formattedDates[i]}</Text>
                          )}
                        </View>
                        <View className="p-3 flex-row justify-between">
                          <Text>{isLoading ? <Skeleton show height={17} width={85} radius={"round"} colorMode="light" /> : "Отправитель"}</Text>
                          <Text className="font-semibold text-[#2e2f2f]">
                            {isLoading ? (
                              <Skeleton show height={17} width={50} radius={"round"} colorMode="light" />
                            ) : transfer.creator.name === null ? (
                              "Асель"
                            ) : (
                              transfer.creator.name
                            )}
                          </Text>
                        </View>
                        <View className="p-3 flex-row justify-between">
                          <Text>{isLoading ? <Skeleton show height={17} width={85} radius={"round"} colorMode="light" /> : "Количество"}</Text>
                          <Text className="font-semibold text-[#2e2f2f]">
                            {isLoading ? (
                              <Skeleton show height={17} width={100} radius={"round"} colorMode="light" />
                            ) : transfer.quantity ? (
                              transfer.quantity
                            ) : (
                              "неизвестно"
                            )}
                          </Text>
                        </View>
                        <View className="p-3 flex-row justify-between mb-5">
                          <Text>{isLoading ? <Skeleton show height={17} width={150} radius={"round"} colorMode="light" /> : "В торговую точку"}</Text>
                          <Text className="font-semibold text-[#2e2f2f]">
                            {isLoading ? (
                              <Skeleton show height={17} width={100} radius={"round"} colorMode="light" />
                            ) : transfer?.is_export ? (
                              "На экспорт"
                            ) : (
                              transfer.to_place?.name
                            )}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
}
