import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";

export default function ModalForSellWithOutCustomer(props) {
  const { modalVisible, setModalVisible, data, selectedSellPlace, setSelectedSellPlace, totalPrice } = props;

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
        <Pressable onPress={() => setModalVisible(!modalVisible)} className="items-center justify-center w-full h-full px-6 bg-[#00000077]">
          <Pressable activeOpacity={1} className="bg-white w-full rounded-2xl p-7">
            <Text className="text-xl font-bold text-[#CD5297] text-center">Оформление продажи</Text>
            <View className="mt-5">
              <Text className="font-bold text-base text-[#CD5297] mb-2">Оплата по валюте</Text>
              <SelectList
                dropdownTextStyles={styles.dropdownTextStyles}
                dropdownStyles={styles.dropdownStyles}
                boxStyles={styles.boxStyles}
                inputStyles={{ color: "white" }}
                closeicon={<Icon name="close" color="white" size={25} />}
                searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
                arrowicon={<Icon name="arrow-down" color="white" size={20} />}
                dropdownItemStyles={styles.dropdownItemStyles}
                defaultOption={data.baseCurrency}
                setSelected={(currency) => {
                  console.log("currency: ", currency);
                  totalPrice(currency);
                  setSelectedSellPlace({
                    ...selectedSellPlace,
                    selectedCurency: currency,
                  });
                }}
                placeholder={"Выбрать валюту"}
                search={false}
                data={data.currencies}
              />
            </View>
            <View className="mt-2" style={{ position: "relative", zIndex: -1 }}>
              <Text className="font-bold text-base text-[#CD5297] mb-2">Оплата наличными</Text>
              <TextInput placeholder="Введите сумму..." placeholderTextColor="white" style={styles.inputStyles} />
            </View>

            <View className="mt-5" style={{ position: "relative", zIndex: -1 }}>
              <Text className="font-bold text-lg text-[#CD5297] mb-1">
                К оплате: {totalPrice()} {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency.name}
              </Text>
              <Text className="font-bold text-lg text-[#CD5297]">Сдача: 0</Text>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: "100%",
  },
  dropdownItemStyles: {
    height: 40,
    backgroundColor: "#ED83C1",
    borderRadius: 20,
    justifyContent: "center",
    marginVertical: 3,
    marginHorizontal: 20,
  },
  boxStyles: {
    backgroundColor: "#ED83C1",
    height: 50,
    alignItems: "center",
    borderWidth: 0,
    elevation: Platform.OS === "android" ? 5 : 0,
  },
  dropdownStyles: {
    borderWidth: 0,
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    top: 45,
    backgroundColor: "#f5f5f5",
  },
  dropdownTextStyles: {
    fontSize: 17,
    color: "white",
  },
  addProductButton: {
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "white",
    width: "100%",
  },
  inputStyles: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    width: "100%",
    paddingLeft: 15,
    backgroundColor: "#ED83C1",
    color: "white",
  },
});
