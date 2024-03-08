import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

export default function ModalTransfers(props) {
  const { setModalVisible, modalVisible } = props;
  const [isChecked, setIsChecked] = useState(false);
  const [selected, setSelected] = useState([]);

  const data = [
    { key: "1", value: "Jammu & Kashmir" },
    { key: "2", value: "Gujrat" },
    { key: "3", value: "Maharashtra" },
    { key: "4", value: "Goa" },
  ];
  const toggleCheckmark = () => {
    setIsChecked((prev) => !prev);
  };
  console.log("isChecked: ", isChecked);
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
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        className="items-center justify-center w-full h-full px-6 bg-[#00000077]"
      >
        <TouchableOpacity
          activeOpacity={1}
          className="bg-white h-2/4 w-full rounded-2xl p-7"
        >
          <Text className="text-center text-xl font-semibold">
            Создать отгрузку
          </Text>
          <View className="flex-row items-center gap-x-4 mt-7">
            <Checkbox
              className="w-6 h-6 rounded-lg"
              value={isChecked}
              onValueChange={setIsChecked}
            />
            <Pressable onPress={toggleCheckmark}>
              <Text className="text-[20px]">На экспорт</Text>
            </Pressable>
          </View>
          <View className="mt-7">
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
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
