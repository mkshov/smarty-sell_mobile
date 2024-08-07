import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { transferContext } from "../../contexts/transferContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import AddIcon from "react-native-vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import FlashMessage, { showMessage } from "react-native-flash-message";
import ModalChooseAddVariant from "../../components/AddVariant/modalChooseAddVariant";

export default function AddProductForTransfer({ route, navigation }) {
  const { transferId } = route.params;
  const { transfer, transferProducts, getTransfer, getTransfers, getTransferProducts, deleteTransfer, amountInPlace, sendTransfer } =
    useContext(transferContext);

  const [productQuantities, setProductQuantities] = useState(null);
  const [modalAddVariant, setModalAddVariant] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleChangeQuantity = (product, text) => {};

  useEffect(() => {
    getTransfer(transferId);
    getTransferProducts(transferId);
  }, [transferId]);

  const onRefreshProducts = React.useCallback(async () => {
    setRefreshing(true);
    await getTransfers({ status: "preparing" });
    setRefreshing(false);
  }, []);

  const handleNavigate = (path, id) => {
    navigation.navigate(path, { transferId: id });
  };

  const handleDeleteTransfer = async () => {
    deleteTransfer(transferId);
    await getTransfers({ status: "preparing" });
    Alert.alert("Трансфер удален");
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

  const handleSendTransfer = async () => {
    const { error, success } = await sendTransfer(transferId);
    if (error) {
      const { code, message } = error;
      if (code === "emptiness") {
        Alert.alert(message);
      } else {
        Alert.alert("Ошибка", message);
      }
    } else if (success) {
      showMessage({
        message: "Продукты успешно отправились!",
        type: "success",
        position: "top",
        statusBarHeight: 1,
        textProps: {
          style: { fontSize: 17, color: "white" },
        },
      });
      await getTransfers({ status: "preparing" });
      handleNavigate("create-transfers");
    }
  };
  return (
    <LinearGradient colors={["#ED83C1", "#8469A4"]} className="h-full">
      <SafeAreaProvider>
        <SafeAreaView style={styles.AndroidSafeArea}>
          <TouchableOpacity onPress={() => navigation.navigate("create-transfers")} className="flex-row items-center ml-2">
            <Icon name="chevron-back" color={"white"} size={25} />
            <Text className="text-white">Назад</Text>
          </TouchableOpacity>
          <Text className="text-center text-2xl font-bold text-white ">Отгрузка №{transferId}</Text>
          <View className="flex-row justify-between items-center px-4 mt-5 w-full">
            <TouchableOpacity onPress={() => confirmDelete()}>
              <LinearGradient colors={["#efceff87", "#efceff87"]} className="py-5 px-5 rounded-2xl">
                <Text className="text-center text-white font-semibold">Удалить отгрузку</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity>
              <LinearGradient colors={["#efceff87", "#efceff87"]} className="py-5 px-5 rounded-2xl">
                <Text className="text-center text-white font-semibold">Редактировать</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setModalAddVariant(!modalAddVariant)} className="px-4 mt-5">
            <LinearGradient colors={["#efceff87", "#efceff87"]} className="py-5 rounded-2xl w-full">
              <Text className="text-center text-white font-semibold">Добавить продукт</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSendTransfer()} className="px-4 mt-5">
            <LinearGradient colors={["#efceff87", "#efceff87"]} className="py-5 rounded-2xl w-full">
              <Text className="text-center text-white font-semibold">
                {transfer?.to_place?.name ? `Перевезти в ${transfer?.to_place?.name}` : "Отправить на экспорт"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <ModalChooseAddVariant
            scanPath="scan-product-transfer"
            handleNavigate={handleNavigate}
            setModalVisible={setModalAddVariant}
            modalVisible={modalAddVariant}
          />
          <ScrollView
            refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={onRefreshProducts} />}
            vertical={true}
            style={{ height: 450 }}
            className="px-6 min-h-[380px]"
          >
            {transferProducts?.results.length ? (
              transferProducts?.results.map((element, i) => (
                <View key={i} className="rounded-xl border-x-4 border-y-4 border-[#efceff87] bg-white p-7 mt-5">
                  <View className="flex-row">
                    <View className="w-1/2">
                      <Text>Название</Text>
                      <Text className="text-base font-semibold mt-1">{element.product.name}</Text>
                    </View>
                    <View>
                      <Text>Тип</Text>
                      <Text className="text-base font-semibold mt-1">{element.product.type.name}</Text>
                    </View>
                  </View>
                  <View className="flex-row  mt-10">
                    <View className="w-1/2">
                      <Text>Модель</Text>
                      <Text className="text-base font-semibold mt-1">{element.product.model}</Text>
                    </View>
                    <View>
                      <Text>Артикул ткани</Text>
                      <Text className="text-base font-semibold mt-1">Quattro Siyah</Text>
                    </View>
                  </View>
                  <View className="flex-row mt-10">
                    <View className="w-1/2">
                      <Text>Артикул модели</Text>
                      <Text className="text-base font-semibold mt-1">{element.product.model_code}</Text>
                    </View>
                    <View>
                      <Text>Кол-во на складе</Text>
                      <Text className="text-base font-semibold mt-1">{amountInPlace[i]?.amount_in_place || 0}</Text>
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
                      <Text>Кол-во в отгрузке</Text>
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
              ))
            ) : (
              <View className="items-center mt-10">
                <Text className="text-center text-base color-white font-semibold">
                  Продукты не добавлены! Для добавления, нажмите кнопку "Добавить продукт".
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
        <FlashMessage />
      </SafeAreaProvider>
    </LinearGradient>
  );
}
let styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
