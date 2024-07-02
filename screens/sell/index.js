import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import Octicons from "react-native-vector-icons/Octicons";
import { sellContext } from "../../contexts/sellContext";
import { workPlaceContext } from "../../contexts/workPlaceContext";
import { SelectList } from "react-native-dropdown-select-list";
import ModalChooseAddVariant from "../../components/AddVariant/modalChooseAddVariant";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSequence, withRepeat } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalForSellWithOutCustomer from "./modals/WithOutCustomer";
import SellCheckModal from "./modals/sellCheckModal";
import useTotalPrice from "./hooks/useTotalPrice";
import useTotalQuantity from "./hooks/useTotalQuantity";
import getData from "./utils/getData";
import SelectDropdown from "./components/SelectDropdown";
import AddProductButton from "./components/AddProductButton";
import GoToCartButton from "./components/GoToCartButton";
import ModalForSellWithCustomer from "./modals/WithCustomer";
import MySelect from "./components/WithSearchSelect";
import WithOutSearchSelect from "./components/WithOutSearchSelect";
import WithSearchSelect from "./components/WithSearchSelect";

export default function SellScreen({ navigation }) {
  const {
    sellCart,
    sellPlaces,
    sellCustomers,
    sellCurrencies,
    selectedSellPlace,
    setSelectedSellPlace,
    setSellCart,
    withOutCustomerModal,
    setWithOutCustomerModal,
    getCustomer,
  } = useContext(sellContext);

  const { getSavedPlace, savedPlace } = useContext(workPlaceContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  const totalPrice = useTotalPrice(sellCart, selectedSellPlace);
  const totalQuantity = useTotalQuantity(sellCart);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCartFromStorage();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    getSavedPlace();
    setSelectedSellPlace((prevState) => ({
      ...prevState,
      selectedPlace: [savedPlace?.type.id, savedPlace?.name],
    }));
  }, []);

  useEffect(() => {
    getCartFromStorage();
  }, []);

  async function getCartFromStorage() {
    const from = await AsyncStorage.getItem("sellCart");
    const res = JSON.parse(from) || [];
    setSellCart(res);
  }

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };

  const offset = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const OFFSET = 5;
  const TIME = 250;

  const handlePress = () => {
    offset.value = withSequence(withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true), withTiming(0, { duration: TIME / 2 }));
  };

  useEffect(() => {
    const intervalId = setInterval(handlePress, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (sellCurrencies) {
      setData(getData({ sellPlaces, sellCurrencies, sellCustomers, savedPlace }));
    }
  }, [sellCurrencies]);

  useEffect(() => {
    if (data) {
      setSelectedSellPlace((prev) => ({ ...prev, selectedCurency: data.baseCurrency.key, selectedPlace: data.basePlace.key }));
    }
  }, [data]);

  if (!data)
    return (
      <SafeAreaProvider>
        <LinearGradient colors={["#8469A4FF", "#ED83C1FF"]}>
          <SafeAreaView style={[styles.AndroidSafeArea, { justifyContent: "center" }]}>
            <ActivityIndicator size="large" color="white" />
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaProvider>
    );

  console.log("data: ", data.baseCurrency);

  return (
    <SafeAreaProvider>
      <LinearGradient colors={["#8469A4FF", "#ED83C1FF", "#7E8BCD"]}>
        <SafeAreaView style={styles.AndroidSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="chevron-back" color={"white"} size={25} />
              <Text style={styles.backButtonText}>Назад</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Продажа</Text>
          </View>
          <ScrollView
            refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View>
              <SelectDropdown
                zIndex={22}
                title="Продать товар из другой точки"
                data={data.places}
                defaultOption={data.basePlace}
                onSelect={(place) =>
                  setSelectedSellPlace({
                    ...selectedSellPlace,
                    selectedPlace: place,
                  })
                }
              />

              <WithOutSearchSelect
                zIndex={10}
                title="Валюта"
                data={data.currencies}
                defaultOption={data.baseCurrency}
                onSelect={(currency) => {
                  setSelectedSellPlace((prevState) => ({
                    ...prevState,
                    selectedCurency: currency.key,
                  }));
                }}
              />

              <WithSearchSelect
                zIndex={9}
                title="Покупатель"
                data={data.customers}
                onSelect={(customer) => {
                  if (customer) {
                    getCustomer(customer.id);
                  }
                  setSelectedSellPlace({
                    ...selectedSellPlace,
                    selectedCustomer: customer,
                    withOutCustomer: true,
                  });
                }}
                search
                placeholder="Выбрать покупателя..."
              />
              <AddProductButton modalVisible={modalVisible} setModalVisible={setModalVisible} sellCart={sellCart} totalQuantity={totalQuantity} />
              <GoToCartButton navigation={navigation} style={style} />
            </View>
            <View className="mb-2 relative -z-10">
              <Text style={styles.totalPriceText}>
                Итого: {totalPrice()} {selectedSellPlace.selectedCurency?.name || selectedSellPlace.selectedCurency?.currency?.name}
              </Text>
              <TouchableOpacity style={styles.addProductButton} onPress={() => setWithOutCustomerModal(!withOutCustomerModal)}>
                <Text style={styles.addProductButtonText}>Оформить продажу</Text>
              </TouchableOpacity>
            </View>
            <ModalChooseAddVariant
              scanPath="sell-scan"
              handleNavigate={handleNavigate}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
            />
            {selectedSellPlace.withOutCustomer ? (
              <ModalForSellWithCustomer
                data={data}
                sellCart={sellCart}
                setSelectedSellPlace={setSelectedSellPlace}
                selectedSellPlace={selectedSellPlace}
                modalVisible={withOutCustomerModal}
                totalPrice={totalPrice}
                setModalVisible={setWithOutCustomerModal}
              />
            ) : (
              <ModalForSellWithOutCustomer
                data={data}
                sellCart={sellCart}
                setSelectedSellPlace={setSelectedSellPlace}
                selectedSellPlace={selectedSellPlace}
                modalVisible={withOutCustomerModal}
                totalPrice={totalPrice}
                setModalVisible={setWithOutCustomerModal}
              />
            )}
          </ScrollView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  scrollViewContent: {
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 20,
  },
  totalPriceText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  addProductButton: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
  },
  addProductButtonText: {
    fontSize: 18,
    color: "#CD5297",
    fontWeight: "bold",
  },
});
