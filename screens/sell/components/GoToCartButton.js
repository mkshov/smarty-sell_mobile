import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import Octicons from "react-native-vector-icons/Octicons";

const GoToCartButton = ({ navigation, style }) => (
  <TouchableOpacity onPress={() => navigation.navigate("sell-cart")} style={styles.button}>
    <Text style={styles.buttonText}>Перейти в корзину</Text>
    <Animated.View style={[style]}>
      <Octicons name="arrow-right" size={22} color="white" style={styles.icon} />
    </Animated.View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  icon: {
    marginTop: 4,
    marginLeft: 15,
  },
});

export default GoToCartButton;
