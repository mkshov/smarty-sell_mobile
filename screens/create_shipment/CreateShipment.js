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
import { LinearGradient } from "expo-linear-gradient";

export default function CreateShipment({ navigation }) {
  const { getPlaces, places } = useContext(workPlaceContext);
  const { transfers, newTransfer, isLoading, isLoadingTransfers, getTransfers, getTransferProducts, getAmountInPlace } = useContext(transferContext);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getTransfers({ status: "preparing" });
      getCurrentPlace();
      setRefreshing(false);
    }, 2000);
  }, []);

  const getCurrentPlace = async () => {
    const savedPlace = JSON.parse((await AsyncStorage.getItem(STORAGE.SAVED_PLACE)) || null);
    console.log("getCurrentPlace(): ", savedPlace);
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

  const handleOpenModal = () => {
    getCurrentPlace();
    getPlaces();
    setModalVisible(true);
  };

  useEffect(() => {
    getCurrentPlace();
  }, []);

  const handleNavigate = (path, id, onRefresh) => {
    getTransferProducts(id);
    getAmountInPlace(id);
    navigation.navigate(path, { transferId: id, onRefreshTransfers: onRefresh });
  };
  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#8469A4FF", "#ED83C1FF", "#7E8BCDFF"]}>
        <SafeAreaView>
          <TouchableOpacity onPress={() => navigation.navigate("/")} className="flex-row items-center ml-2">
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
              getCurrentPlace={getCurrentPlace}
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
                ) : transfers.length === 0 ? (
                  <View className="items-center">
                    <Text className="text-center text-base color-white font-semibold">
                      Отгрузки не созданы! Чтобы создать новую отгрузку, нажмите кнопку "Добавить отгрузку".
                    </Text>
                  </View>
                ) : (
                  transfers.map((transfer, i) => (
                    <TouchableOpacity key={i} onPress={() => handleNavigate("add-product-for-transfer", transfer.id, onRefresh)}>
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
                              "Отправитель не указан"
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
                        <View className="p-3 flex-row justify-between">
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
                        <View className="p-3 flex-row justify-between mb-5">
                          <Text>{isLoading ? <Skeleton show height={17} width={150} radius={"round"} colorMode="light" /> : "От куда"}</Text>
                          <Text className="font-semibold text-[#2e2f2f]">
                            {isLoading ? <Skeleton show height={17} width={100} radius={"round"} colorMode="light" /> : transfer?.from_place.name}
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
      </LinearGradient>
    </SafeAreaProvider>
  );
}
