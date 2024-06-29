import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: "100%",
  },
  dropdownItemStyles: {
    height: 40,
    backgroundColor: "#ED83C1",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 3,
    marginHorizontal: 20,
  },
  boxStyles: {
    backgroundColor: "#ED83C1",
    height: 50,
    alignItems: "center",
    borderWidth: 0,
    elevation: Platform.OS === "android" ? 5 : 0,
    width: 150,
    position: "relative",
    zIndex: 5,
  },
  dropdownStyles: {
    borderWidth: 0,
    position: "absolute",
    left: 0,
    right: 0,
    top: 45,
    backgroundColor: "#f5f5f5",
    width: 150,
    zIndex: 10,
  },
  dropdownChangeStyle: {
    bottom: 55,
    top: "none",
  },
  dropdownTextStyles: {
    fontSize: 17,
    color: "white",
  },
  addProductButton: {
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "white",
    width: "100%",
  },
  inputStyles: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    width: 150,
    paddingLeft: 15,
    backgroundColor: "#ED83C1",
    color: "white",
    fontWeight: "bold",
  },
});
