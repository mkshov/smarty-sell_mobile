import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { transferContext } from "../../../contexts/transferContext";

const initState = {
  isChecked: false,
  selected: null,
};

export default function ModalTransfers(props) {
  const { modalVisible, places, currentPlace, navigation, getAllTransfers, setModalVisible } = props;

  const { createTransfer, isLoading } = useContext(transferContext);
  const [isChecked, setIsChecked] = useState(false);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState(initState);

  useEffect(() => {
    if (!modalVisible) {
      setSelected(null);
      setIsChecked(false);
    }
  }, [modalVisible]);

  const data = places
    .filter((place) => place.name !== currentPlace?.name)
    .map((place) => ({
      key: place.id,
      value: place.name,
    }));

  const toggleCheckmark = () => {
    setIsChecked((prev) => !prev);
  };

  const handleCreateTransfer = () => {
    const param = isChecked ? "is_export" : "to_place";
    const data = {
      from_place: currentPlace?.id,
      [param]: isChecked || selected,
    };
    if (selected || isChecked) {
      getAllTransfers();
      createTransfer(data, navigation);
      setModalVisible(false);
    } else {
      Alert.alert("Заполните необходимые поля");
    }
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
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} className="items-center justify-center w-full h-full px-6 bg-[#00000077]">
        <TouchableOpacity activeOpacity={1} className="bg-white w-full rounded-2xl p-7">
          <Text className="text-center text-xl font-semibold">Создать отгрузку</Text>
          <View className="flex-row items-center gap-x-4 mt-14">
            <Checkbox className="w-6 h-6 rounded-lg" value={isChecked} onValueChange={setIsChecked} />
            <Pressable onPress={toggleCheckmark}>
              <Text className="text-[20px]">На экспорт</Text>
            </Pressable>
          </View>
          <View className="mt-7">
            {!isChecked ? (
              <SelectList
                dropdownTextStyles={{
                  fontSize: 17,
                  color: "white",
                }}
                dropdownStyles={{
                  borderWidth: 0,
                }}
                dropdownItemStyles={{
                  height: 50,
                  backgroundColor: "#CD5297",
                  borderRadius: 20,
                  justifyContent: "center",
                  marginVertical: 5,
                }}
                setSelected={(val) => setSelected(val)}
                placeholder={"Выбрать куда отправить"}
                data={data}
              />
            ) : null}
          </View>
          <TouchableOpacity onPress={() => handleCreateTransfer()} className="mt-10">
            <LinearGradient
              className="w-full py-5 px-10 rounded-2xl"
              colors={["#8469a4", "#ed83c1", "#ce83e5"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text className="text-white text-xl font-bold text-center">{isLoading ? "Создаем..." : "Создать отгрузку"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
