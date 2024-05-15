import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Button, Alert, Dimensions } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { sellContext } from "../../contexts/sellContext";
import { transferContext } from "../../contexts/transferContext";
import { useNavigation } from "@react-navigation/native";
import ModalScannedProduct from "../modalForProduct";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const initialText = "Наведитесь на QR code \n или штрих код";

export default function Scanner({ actionType, actionTitle, cartPath }) {
  const navigation = useNavigation();
  const { transfer, scannedProduct, scanInPlace, scannedProducts, setScannedProducts, setScannedProduct } = useContext(transferContext);
  const { selectedSellPlace, sellCart, setSellCart } = useContext(sellContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState(initialText);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setText(data);
    const dataSend = {
      barcode: data,
      place: actionType === "transfer" ? transfer.from_place.id : selectedSellPlace.selectedPlace[0],
    };
    console.log("selectedSellPlace: ", selectedSellPlace);
    console.log("dataSend: ", dataSend);
    let res = await scanInPlace(dataSend);
    if (res.barcode && data.length >= 12) {
      setModalVisible(!modalVisible);
    } else if (data.length < 12) {
      Alert.alert(`Продукт с кодом - ${data} не найден! Убедитесь, что в коде не менее 12 символов.`);
      return;
    } else {
      if (res.errors[0].code === "not_found") {
        Alert.alert(`Продукт с кодом - ${data} не найден!`);
      }
    }
  };

  const newScan = () => {
    if (actionType === "transfer") {
      const isProductExist = scannedProducts.some((product) => product.id === scannedProduct.id);
      if (!scannedProduct.quantity) {
        Alert.alert("Нет продуктов для добавления!");
        return;
      } else {
        if (!isProductExist) {
          const newScannedProducts = [...scannedProducts, scannedProduct];
          setScannedProducts(newScannedProducts);
          Alert.alert("Продукт успешно добавлен в корзину!");
        } else {
          Alert.alert("Продукт уже есть в корзине!");
        }
      }
    } else if (actionType === "sell") {
      const isProductExist = sellCart.some((product) => product.id === scannedProduct.id);

      if (!scannedProduct.quantity) {
        Alert.alert("Нет продуктов для добавления!");
        return;
      } else if (!scannedProduct.product.price_rule) {
        Alert.alert("У продукта нет цены, такой продукт невозможно добавить в корзину!");
      } else {
        if (!isProductExist) {
          const newScannedProducts = [...sellCart, { ...scannedProduct, newQuantity: 1 }];
          setSellCart(newScannedProducts);
          Alert.alert("Продукт успешно добавлен в корзину!");
        } else {
          Alert.alert("Продукт уже есть в корзине!");
        }
      }
    }
    setScanned(false);
    setModalVisible(false);
    setText(initialText);
  };

  const toInitial = () => {
    setScanned(false);
    setModalVisible(false);
    setText(initialText);
    setScannedProduct(null);
  };

  const handleNavigate = (path) => {
    navigation.navigate(path);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={"Allow Camera"} onPress={() => askForCameraPermission()} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ height: windowHeight }} className="pt-11">
      <ModalScannedProduct
        type={actionType === "sell" ? "sell" : null}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleNavigate={handleNavigate}
        newScan={newScan}
      />
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" color={"white"} size={25} />
          <Text style={styles.backButton.text}>Назад</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate(cartPath)}>
          <Text style={styles.backButton.text}>Корзина</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.maintext}>{text}</Text>
        <View style={styles.barcodebox}>
          <View style={[styles.cornerTopLeft, styles.corner]} />
          <View style={[styles.cornerTopRight, styles.corner]} />
          <View style={[styles.cornerBottomLeft, styles.corner]} />
          <View style={[styles.cornerBottomRight, styles.corner]} />
        </View>
        {!modalVisible && scanned ? (
          <TouchableOpacity style={styles.newSkan} onPress={toInitial}>
            <LinearGradient colors={["#ED83C1", "#8469A4"]} style={styles.newSkan.bg}>
              <Text style={styles.newSkan.text}>Сканировать еще раз</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlashMessage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    text: {
      color: "black",
      marginLeft: 5,
      fontWeight: "bold",
      color: "white",
    },
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 15,
    text: {},
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  maintext: {
    fontSize: 19,
    margin: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    top: 70,
  },
  barcodebox: {
    width: windowWidth * 0.88,
    height: windowHeight * 0.4,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 100,
  },
  newSkan: {
    text: {
      fontSize: 18,
      fontWeight: "700",
      color: "white",
    },
    bg: {
      padding: 20,
      borderRadius: 16,
    },
    position: "absolute",
    bottom: 130,
  },
  corner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderColor: "#FFF", // белый цвет
    borderWidth: 5,
    borderRadius: 5,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});
