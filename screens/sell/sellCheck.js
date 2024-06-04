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
import { showMessage } from "react-native-flash-message";

export default function SellCheck({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const { sellSendWithOutCustomer, sellCart, selectedSellPlace, setSellCart } = useContext(sellContext);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const totalQuantity = sellCart.reduce((sum, curr) => sum + curr.newQuantity, 0);
  const totalPrice = (
    sellCart.reduce((sum, item) => sum + item.product.price_rule.price * item.newQuantity, 0) * selectedSellPlace.selectedCurency.rate
  ).toFixed(2);
  const change = sellSendWithOutCustomer.payments[0].amount - totalPrice;

  async function closeCheck() {
    setSellCart([]);
    await AsyncStorage.removeItem("sellCart");
    navigation.navigate("sell");
    showMessage({
      message: `Продажа произведена успешно!`,
      type: "success",
    });
  }

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
              <Text className="text-2xl text-white font-bold">Чек товара №{sellSendWithOutCustomer?.id}</Text>
            </TouchableOpacity>
          </View>
          <View
            // refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefresh} />}
            style={{ justifyContent: "space-between", flex: 1, paddingHorizontal: 20 }}
          >
            <View style={{ backgroundColor: "white", paddingVertical: 40, paddingHorizontal: 20, borderRadius: 20, marginTop: 50 }}>
              <View style={{ alignItems: "center", gap: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>SMART DORDOI</Text>
                <Text style={{ fontSize: 17, letterSpacing: 2 }}>Оплата наличными</Text>
              </View>
              <View style={{ marginTop: 20, gap: 5 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={{ width: 140, fontSize: 17, letterSpacing: 1 }}>Покупатель:</Text>
                  <Text style={{ fontSize: 15, letterSpacing: 1, fontWeight: "bold" }}>Аселя</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={{ width: 140, fontSize: 17, letterSpacing: 1 }}>Продавец:</Text>
                  <Text style={{ fontSize: 15, letterSpacing: 1, fontWeight: "bold" }}>{sellSendWithOutCustomer.employee?.name || "Не указан"}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={{ width: 140, fontSize: 17, letterSpacing: 1 }}>Тор. точка:</Text>
                  <Text style={{ fontSize: 15, letterSpacing: 1, fontWeight: "bold" }}>{sellSendWithOutCustomer.place?.name}</Text>
                </View>
              </View>
              <View style={styles.table}>
                <View style={styles.headerRow}>
                  <Text style={styles.cell.firstSell}>Наименование</Text>
                  <Text style={styles.cell}>Цена</Text>
                  <Text style={styles.cell}>Кол.</Text>
                  <Text style={styles.cell}>Сумма</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 210 }}>
                  {sellCart.map((item) => (
                    <View key={item.id} style={styles.row}>
                      <Text style={styles.cell.firstSell}>
                        {item.product.type.name} {item.product.vendor_code} {item.size.name}
                      </Text>
                      <Text style={styles.cell}>{(item.product.price_rule.price * selectedSellPlace.selectedCurency.rate).toFixed(2)}</Text>
                      <Text style={styles.cell}>{item.newQuantity}</Text>
                      <Text style={styles.cell}>
                        {(item.newQuantity * item.product.price_rule.price * selectedSellPlace.selectedCurency.rate).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.footreRow}>
                  <Text style={styles.cell}>Общее количесвто: {totalQuantity}</Text>
                </View>
              </View>
              <View style={{ gap: 5, marginTop: 20 }}>
                <Text>Доп. услуги</Text>
                <View style={{ height: 1.5, width: "100%", backgroundColor: "#C4C4C4" }}></View>
              </View>
              <View style={{ marginTop: 10, gap: 5 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={{ width: 140, fontSize: 17, letterSpacing: 1 }}>Итого:</Text>
                  <Text style={{ fontSize: 15, letterSpacing: 1, fontWeight: "bold" }}>
                    {totalPrice} {selectedSellPlace.selectedCurency.name}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={{ width: 140, fontSize: 17, letterSpacing: 1 }}>Оплачено:</Text>
                  <Text style={{ fontSize: 15, letterSpacing: 1, fontWeight: "bold" }}>
                    {sellSendWithOutCustomer.payments[0].amount} {selectedSellPlace.selectedCurency.name}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text style={{ width: 140, fontSize: 17, letterSpacing: 1 }}>Сдача:</Text>
                  <Text style={{ fontSize: 15, letterSpacing: 1, fontWeight: "bold" }}>
                    {change} {selectedSellPlace.selectedCurency.name}
                  </Text>
                </View>
                <View>
                  <Text style={{ textAlign: "center", marginTop: 30, fontSize: 20, fontWeight: "bold" }}>Спасибо за покупку!</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={closeCheck}>
            <LinearGradient colors={["#ED83C1", "#8469A4"]} className="py-4 rounded-2xl mx-5">
              <Text className="text-xl font-bold text-white text-center">Ок</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  table: {
    borderWidth: 1,
    borderColor: "#C4C4C4",
    marginBottom: 10,
    marginTop: 30,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C4C4C4",
  },
  footreRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C4C4C4",
    borderTopWidth: 1,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#C4C4C4",
  },
  cell: {
    flex: 1,
    width: 200,
    textAlign: "center",
    fontSize: 14,
    color: "black",
    firstSell: {
      flex: 2,
      padding: 10,
      width: 200,
      // textAlign: "center",
      fontSize: 14,
      color: "black",
    },
  },
});
