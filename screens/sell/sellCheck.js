import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  ScrollViewBase,
  ScrollViewComponent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import { sellContext } from "../../contexts/sellContext";
import { workPlaceContext } from "../../contexts/workPlaceContext";
import { SelectList } from "react-native-dropdown-select-list";
import ModalChooseAddVariant from "../../components/AddVariant/modalChooseAddVariant";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withRepeat, withSequence } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalForSellWithOutCustomer from "./modals/WithOutCustomer";
import SellCheckModal from "./modals/sellCheckModal";

export default function SellCheck({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCartFromStorage();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);
  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#8469A4FF", "#ED83C1FF", "#7E8BCD"]}>
        <SafeAreaView style={styles.AndroidSafeArea}>
          <View className="flex-row justify-between pl-2 pr-5">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
              <Icon name="chevron-back" color={"white"} size={25} />
              <Text className="text-white">Назад</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-2xl text-white font-bold">Чек товара №340</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ justifyContent: "space-between", flex: 1, paddingHorizontal: 20 }}
          ></ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
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
    shadowColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownStyles: {
    borderWidth: 0,
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    top: 45,
    backgroundColor: "white",
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
});
