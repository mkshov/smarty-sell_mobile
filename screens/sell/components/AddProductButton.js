import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AddProductButton = ({ modalVisible, setModalVisible, sellCart, totalQuantity }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.button}>
      <Text style={styles.buttonText}>Добавить продукт</Text>
    </TouchableOpacity>
    <Text style={styles.cartInfo}>
      В корзине {sellCart.length} {sellCart.length === 1 ? "продукт" : sellCart.length > 1 && sellCart.length < 5 ? "продукта" : "продуктов"}
    </Text>
    <Text style={styles.cartInfo}>Общее добавляемое кол-во - {totalQuantity}шт.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    color: "#CD5297",
    fontWeight: "bold",
  },
  cartInfo: {
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
});

export default AddProductButton;
