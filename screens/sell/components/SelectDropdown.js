import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Icon from "react-native-vector-icons/Ionicons";

export default function SelectDropdown({ title, data, defaultOption, onSelect, placeholder = "Выбрать", zIndex }) {
  const styles = StyleSheet.create({
    container: {
      marginTop: 20,
      position: "relative",
      zIndex: zIndex,
    },
    title: {
      color: "white",
      fontWeight: "bold",
      marginLeft: 5,
      marginBottom: 5,
    },
    dropdownTextStyles: {
      fontSize: 17,
      color: "white",
    },
    dropdownStyles: {
      borderWidth: 0,
      position: "absolute",
      left: 0,
      right: 0,
      top: 50,
      backgroundColor: "white",
      zIndex: 10,
    },
    boxStyles: {
      backgroundColor: "#ED83C1",
      height: 50,
      alignItems: "center",
      borderWidth: 0,
      elevation: Platform.OS === "android" ? 5 : 0,
      shadowColor: "white",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      position: "relative",
      zIndex: 5,
    },
    inputStyles: {
      color: "white",
    },
    dropdownItemStyles: {
      height: 40,
      backgroundColor: "#ED83C1",
      borderRadius: 20,
      justifyContent: "center",
      marginVertical: 3,
      marginHorizontal: 20,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <SelectList
        dropdownTextStyles={styles.dropdownTextStyles}
        dropdownStyles={styles.dropdownStyles}
        boxStyles={styles.boxStyles}
        inputStyles={styles.inputStyles}
        closeicon={<Icon name="close" color="white" size={25} />}
        searchicon={<Icon name="search" color="white" size={20} style={{ marginRight: 10 }} />}
        arrowicon={<Icon name="arrow-down" color="white" size={20} />}
        dropdownItemStyles={styles.dropdownItemStyles}
        defaultOption={defaultOption}
        setSelected={onSelect}
        placeholder={placeholder}
        search={false}
        data={data}
      />
    </View>
  );
}
