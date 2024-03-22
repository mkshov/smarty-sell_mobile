import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Button, Alert, Dimensions } from "react-native";
import { Camera, CameraView } from "expo-camera/next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BarCodeScanner } from "expo-barcode-scanner";
import { transferContext } from "../../contexts/transferContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const initialText = "Наведитесь на QR code \n или штрих код";

export default function ScanQrForAddProduct({ navigation }) {
  const { transfer, scannedProduct, error, scanProductForTransfer } = useContext(transferContext);
  console.log("scannedProduct: ", scannedProduct);
  console.log("transfer qr: ", transfer);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState(initialText);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    console.log("Type: " + type + "\nData: " + data);
    handleScan(data);
  };

  const newScan = () => {
    setScanned(false);
    setText(initialText);
  };

  const handleScan = async (scanResult) => {
    const data = {
      barcode: scanResult,
      place: transfer.from_place.id,
    };
    scanProductForTransfer(data);
    // Alert.alert("Добавить в корзину", "продукт добавить сначала в корзину, а после можно будет перепроверить", [
    //   {
    //     text: "Отмена",
    //     onPress: () => console.log("Cancel Pressed"),
    //     style: "Отменить",
    //   },
    //   { text: "Добавить", onPress: () => scanProductForTransfer(data) },
    // ]);
    // Alert.alert(scannedProduct?.barcode, scannedProduct?.product.name);
  };

  // if (error) {
  //   Alert.alert(error.data.errors[0].message);
  // }

  // Check permissions and return the screens
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
  // Return the View
  return (
    <SafeAreaProvider>
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={{ height: windowHeight }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back" color={"white"} size={25} />
          <Text style={styles.backButton.text}>Назад</Text>
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.maintext}>{text}</Text>
          <View style={styles.barcodebox}>
            <View style={[styles.cornerTopLeft, styles.corner]} />
            <View style={[styles.cornerTopRight, styles.corner]} />
            <View style={[styles.cornerBottomLeft, styles.corner]} />
            <View style={[styles.cornerBottomRight, styles.corner]} />
          </View>
          {scanned && (
            <TouchableOpacity style={styles.newSkan} onPress={() => newScan()}>
              <LinearGradient colors={["#ED83C1", "#8469A4"]} style={styles.newSkan.bg}>
                <Text style={styles.newSkan.text}>Сканировать еще раз</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
