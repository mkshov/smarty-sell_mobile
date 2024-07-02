import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function WithOutSearchSelect({ data, defaultOption, title, zIndex, onSelect }) {
  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(defaultOption);
  console.log("selected: ", selected);

  function handleSelect(selectedValue) {
    setSelected(selectedValue);
    setOpen((prev) => !prev);

    if (onSelect) {
      onSelect(selectedValue);
    }
  }

  return (
    <View style={[styles.container, { zIndex: zIndex }]}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.selectBox}>
        <Pressable onPress={() => setOpen((prev) => !prev)} style={styles.boxStyles}>
          <Text style={styles.selectedValue}>{selected?.value}</Text>
        </Pressable>

        <TouchableOpacity onPress={() => setOpen((prev) => !prev)} style={styles.arrowDown}>
          <Ionicons name="arrow-down" size={20} color={"white"} />
        </TouchableOpacity>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownStyles}>
          <ScrollView>
            {data.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handleSelect(item)} style={styles.dropdownItemStyles}>
                <Text style={styles.dropdownTextStyles}>{item.value}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: "relative",
  },
  selectBox: {
    position: "relative",
  },
  arrowDown: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "#ED83C1",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    maxHeight: 300,
    position: "absolute",
    left: 0,
    right: 0,
    top: 85,
    elevation: Platform.OS === "android" ? 5 : 0,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  boxStyles: {
    backgroundColor: "#ED83C1",
    height: 50,
    // alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    elevation: Platform.OS === "android" ? 5 : 0,
    shadowColor: "white",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderRadius: 10,
    paddingLeft: 15,
    color: "white",
  },
  dropdownItemStyles: {
    height: 40,
    backgroundColor: "#ED83C1",
    borderRadius: 20,
    justifyContent: "center",
    marginVertical: 3,
    marginHorizontal: 20,
    paddingLeft: 20,
  },
  loadingText: {
    fontWeight: "600",
    marginLeft: 20,
    marginVertical: 3,
  },
  userNotDefined: {
    marginHorizontal: 25,
    marginVertical: 3,
    fontWeight: "500",
  },
  selectedValue: {
    color: "white",
  },
});
