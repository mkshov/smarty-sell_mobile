import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

export default function ModalChooseAddVariant(props) {
  const { modalVisible, setModalVisible, handleNavigate } = props;

  const toScan = () => {
    setModalVisible(!modalVisible);
    handleNavigate("scan-qr-for-add-product");
  };
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
      <Pressable onPress={() => setModalVisible(!modalVisible)} className="items-center justify-center w-full h-full px-6 bg-[#00000077]">
        <Pressable activeOpacity={1} className="bg-white w-full rounded-2xl p-7">
          <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mb-3 mt-5">
            <TouchableOpacity onPress={() => toScan()}>
              <Text className="text-lg font-bold text-white text-center">Отсканировать QR Code</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mb-3 ">
            <TouchableOpacity>
              <Text className="text-lg font-bold text-white text-center">Добавить вручную</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
