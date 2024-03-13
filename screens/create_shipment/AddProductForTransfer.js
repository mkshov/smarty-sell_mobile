import React, { useContext, useEffect } from "react";
import { ImageBackground, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { transferContext } from "../../contexts/transferContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";

export default function AddProductForTransfer({ route, navigation }) {
  console.log("route: ", route);
  const { transferId } = route.params;
  const { transfer, transferProducts, getTransfer, getTransferProducts } = useContext(transferContext);

  useEffect(() => {
    getTransfer(transferId);
    getTransferProducts(transferId);
  }, []);
  console.log("transferProducsts: ", transferProducts);
  const handleNavigate = (path, id) => {
    navigation.navigate(path, { transferId: id });
  };
  return (
    <ImageBackground resizeMode="cover" className="h-full" source={require("../../assets/login-bg.png")}>
      <SafeAreaProvider>
        <SafeAreaView>
          <TouchableOpacity onPress={() => handleNavigate("create-transfers")} className="flex-row items-center ml-2">
            <Icon name="chevron-back" color={"white"} size={25} />
            <Text className="text-white">Назад</Text>
          </TouchableOpacity>
          <Text className="text-center text-2xl font-bold text-white">Details: {transferId}</Text>
          <ScrollView horizontal={true} className="px-6 mt-10 gap-x-5">
            {transferProducts?.results.map((element, i) => (
              <View key={i} className="rounded-xl border-x-4 border-y-4 border-[#efceff87] bg-white p-7 min-w-[370px] max-w-[400px]">
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
                    <Text>Кол-во {element.quantity_sent}</Text>
                    <TextInput value={element.quantity_sent.toString()} className="text-base font-semibold w-full mt-1 border-b-[1px] pb-1" />
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
