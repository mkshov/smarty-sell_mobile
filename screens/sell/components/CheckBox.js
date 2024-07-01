import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SellCheckbox({ onChange, checked }) {
  return (
    <Pressable style={[styles.checkboxBase, checked && styles.checkboxChecked]} onPress={onChange}>
      {checked && <Ionicons name="checkmark" size={20} color="white" />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkboxBase: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#CD5297",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#CD5297",
  },
});
