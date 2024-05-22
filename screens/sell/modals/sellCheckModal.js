import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";

export default function SellCheckModal(props) {
  const { modalCheck, setModalCheck } = props;
  console.log("modalCheck: ", modalCheck);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalCheck}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalCheck(!modalCheck);
      }}
      onBackdropPress={() => this.setModalCheck(false)}
    >
      <KeyboardAvoidingView behavior="padding">
        <Pressable onPress={() => setModalCheck(!modalCheck)} className="items-center justify-center w-full h-full px-6 bg-[#000000dc]">
          <Pressable activeOpacity={1} className="bg-white w-full rounded-2xl p-7">
            <Text className="font-bold text-base text-[#CD5297]">Продажа произошла успешно!</Text>
            <View className="w-full h-[1px] bg-[#cd5298] my-3"></View>
            <Text className="font-semibold text-[#CD5297]">У вас есть возможность посмотреть чек. Открыть странцицу страницу чека? </Text>
            <View className="flex-row justify-end gap-5 mt-2">
              <TouchableOpacity onPress={() => setModalCheck(!modalCheck)}>
                <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 px-5 rounded-2xl">
                  <Text className="text-white font-semibold">Завершить продажу</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity>
                <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 px-5 rounded-2xl">
                  <Text className="text-white font-semibold">Открыть чек</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
