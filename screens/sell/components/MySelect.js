import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TextInput, Text, View, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function MySelect({ data, defaultOption, onSelect, title }) {
  console.log("data: ", data);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(defaultOption ? defaultOption.value : "");
  const [filteredData, setFilteredData] = useState(data ? data : []);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleSelect = (option) => {
    setInputValue(option.value);
    setOpen(false);
    if (onSelect) {
      onSelect(option.key);
    }
  };

  const handleInputChange = (text) => {
    setOpen(true);
    setInputValue(text);
    setFilteredData(data.filter((item) => item.value.toLowerCase().includes(text.toLowerCase())));
  };

  const handleClearInput = () => {
    setInputValue("");
    onSelect(null);
    setOpen((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => setOpen((prev) => !prev)}>
        <View style={styles.selectBox}>
          <TextInput
            onPress={() => setOpen(true)}
            value={inputValue}
            onChangeText={handleInputChange}
            contextMenuHidden={true}
            placeholderTextColor="white"
            style={styles.boxStyles}
            placeholder="Выбрать покупателя..."
            autoComplete="off"
            importantForAutofill="no"
            textContentType="none"
          />
          {open ? (
            <Ionicons onPress={handleClearInput} style={styles.arrowDown} name="close" size={20} color={"white"} />
          ) : (
            <Ionicons style={styles.arrowDown} name="arrow-down" size={20} color={"white"} />
          )}
        </View>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownStyles}>
          <ScrollView>
            {filteredData.map((item, index) => (
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
    zIndex: 20,
  },
  selectBox: {
    position: "relative",
  },
  arrowDown: {
    position: "absolute",
    right: 15,
    bottom: 15,
    backgroundColor: "#ED83C1",
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
    alignItems: "center",
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
});
