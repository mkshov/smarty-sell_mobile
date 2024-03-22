import React, { useContext, useEffect, useState } from "react";
import { Alert, ImageBackground, RefreshControl, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { transferContext } from "../../contexts/transferContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import AddIcon from "react-native-vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import ModalChooseAddVariant from "./components/modalChooseAddVariant";

export default function AddProductForTransfer({ route, navigation }) {
  const { transferId } = route.params;
  const { transfer, transferProducts, getTransfer, getTransfers, getTransferProducts, deleteTransfer } = useContext(transferContext);

  const [productQuantities, setProductQuantities] = useState(null);
  const [modalAddVariant, setModalAddVariant] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleChangeQuantity = (product, text) => {};

  const getAllTransfers = () => {
    getTransfers({ status: "preparing" });
  };

  useEffect(() => {
    getTransfer(transferId);
    getTransferProducts(transferId);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getAllTransfers();
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleNavigate = (path, id) => {
    navigation.navigate(path, { transferId: id });
  };

  const handleDeleteTransfer = () => {
    deleteTransfer(transferId);
    Alert.alert("Трансфер удален");
    getAllTransfers();
    navigation.navigate("create-transfers");
  };

  const confirmDelete = (id) => {
    Alert.alert("Подтвердите удаление", "Вы уверены в том, что хотите удалить трансфер? После удаления, данные вернуть невозможно.", [
      {
        text: "Отмена",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Удалить", onPress: () => handleDeleteTransfer() },
    ]);
  };

  return (
    <ImageBackground resizeMode="cover" className="h-full" source={require("../../assets/login-bg.png")}>
      <SafeAreaProvider>
        <SafeAreaView>
          <TouchableOpacity onPress={() => handleNavigate("create-transfers")} className="flex-row items-center ml-2">
            <Icon name="chevron-back" color={"white"} size={25} />
            <Text className="text-white">Назад</Text>
          </TouchableOpacity>
          <Text className="text-center text-2xl font-bold text-white ">Details: {transferId}</Text>
          <View className="flex-row justify-between px-4 mt-5">
            <TouchableOpacity onPress={() => confirmDelete()}>
              <LinearGradient colors={["#efceff87", "#efceff87"]} className="py-5 rounded-2xl w-[180px]">
                <Text className="text-center text-white font-semibold">Удалить трансфер</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity>
              <LinearGradient colors={["#efceff87", "#efceff87"]} className="py-5 rounded-2xl w-[180px]">
                <Text className="text-center text-white font-semibold">Редактировать</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setModalAddVariant(!modalAddVariant)} className="px-4 mt-5">
            <LinearGradient colors={["#efceff87", "#efceff87"]} className="py-5 rounded-2xl w-full">
              <Text className="text-center text-white font-semibold">Добавить продукт</Text>
            </LinearGradient>
          </TouchableOpacity>
          <ModalChooseAddVariant handleNavigate={handleNavigate} setModalVisible={setModalAddVariant} modalVisible={modalAddVariant} />
          <ScrollView
            refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefresh} />}
            vertical={true}
            className="px-6 mt-10 max-h-[400px]"
          >
            {transferProducts?.results.map((element, i) => (
              <View key={i} className="rounded-xl border-x-4 border-y-4 border-[#efceff87] bg-white p-7 mt-5">
                <View>
                  <Text>Название</Text>
                  <Text className="text-base font-semibold mt-1">{element.product.name}</Text>
                </View>
                <View className="flex-row  mt-10">
                  <View className="w-1/2">
                    <Text>Модель</Text>
                    <Text className="text-base font-semibold mt-1">{element.product.model}</Text>
                  </View>
                  <View>
                    <Text>Тип</Text>
                    <Text className="text-base font-semibold mt-1">{element.product.type.name}</Text>
                  </View>
                </View>
                <View className="flex-row mt-10">
                  <View className="w-1/2">
                    <Text>Артикул модели</Text>
                    <Text className="text-base font-semibold mt-1">{element.product.model_code}</Text>
                  </View>
                  <View>
                    <Text>Артикул ткани</Text>
                    <Text className="text-base font-semibold mt-1">Quattro Siyah</Text>
                  </View>
                </View>
                <View className="flex-row mt-10">
                  <View className="w-1/2">
                    <Text>Размер</Text>
                    <View className="bg-gray-200 max-w-[80px] py-1 items-center mt-2 rounded-full">
                      <Text className="text-base font-medium">{element.size.name}</Text>
                    </View>
                  </View>
                  <View>
                    <Text>Кол-во </Text>
                    <View className="flex-row items-end max-w-[100px] gap-x-7">
                      <TextInput
                        keyboardType="name-phone-pad"
                        // defaultValue={element.quantity_sent}
                        value={element.quantity_sent.toString()}
                        // onChangeText={(text) => handleChangeQuantity(element, text)}
                        className="text-base font-semibold w-1/2 mt-1 border-b-[1px] pb-1"
                      />
                      <TouchableOpacity>
                        <AddIcon name="pluscircleo" size={25} color={"#CD5297"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}
