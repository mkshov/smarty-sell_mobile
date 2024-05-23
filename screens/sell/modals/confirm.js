import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";
import SellCheckModal from "./sellCheckModal";

export default function SellConfirmModal(props) {
  const { modalVisible, setModalVisible, handleClick, setModalCheck, modalCheck, handleCloseTheSell, showCheck } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
      onBackdropPress={() => this.setModalVisible(false)}
    >
      <KeyboardAvoidingView behavior="padding">
        <Pressable onPress={() => setModalVisible(!modalVisible)} className="items-center justify-center w-full h-full px-6 bg-[#000000dc]">
          <Pressable activeOpacity={1} className="bg-white w-full rounded-2xl p-7">
            <Text className="font-bold text-base text-[#CD5297]">Оформление продажи</Text>
            <View className="w-full h-[1px] bg-[#cd5298] my-3"></View>
            <Text className="font-semibold text-[#CD5297]">Вы действительно хотите оформить продажу? </Text>
            <View className="flex-row justify-end gap-5 mt-2">
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 px-5 rounded-2xl">
                  <Text className="text-white font-semibold">Отмена</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClick}>
                <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 px-5 rounded-2xl">
                  <Text className="text-white font-semibold">Продать</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
      <SellCheckModal modalCheck={modalCheck} setModalCheck={setModalCheck} handleCloseTheSell={handleCloseTheSell} showCheck={showCheck} />
    </Modal>
  );
}
