import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Platform, StyleSheet, TextInput, Text, View, TouchableOpacity, ScrollView, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sellContext } from "../../../contexts/sellContext";
import debounce from "lodash.debounce";
import { showMessage } from "react-native-flash-message";
import { Touchable } from "react-native";

export default function WithSearchSelect({ data, defaultOption, onSelect, title, placeholder, zIndex }) {
  const { getSellCustomers, createUser, setSelectedSellPlace } = useContext(sellContext);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(defaultOption ? defaultOption.value : "");
  const [filteredData, setFilteredData] = useState(data ? data : []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const handleSearchSelect = (option) => {
    setInputValue(option.value);
    setOpen(false);
    if (onSelect) {
      onSelect(option.key);
    }
  };

  const handleTextDebounce = useMemo(
    () =>
      debounce(async (text) => {
        setOpen(true);
        setInputValue(text);
        setLoading(true);
        let res = await getSellCustomers(text);
        let searchCustomers = res.map((item) => ({
          key: {
            id: item.id,
            discount: item.percentage_discount,
          },
          value: `${item.name} - Скидка ${item.percentage_discount}%`,
        }));
        setFilteredData(searchCustomers);
        setLoading(false);
      }, 600),
    [getSellCustomers]
  );

  const handleInputChange = (text) => {
    setInputValue(text);
    handleTextDebounce(text);
  };

  const handleClearInput = () => {
    setInputValue("");
    onSelect(null);
    setSelectedSellPlace((prev) => ({ ...prev, withOutCustomer: false }));
    setOpen((prev) => !prev);
  };

  const handleCreateUser = async () => {
    const newUser = {
      name: inputValue,
    };

    await createUser(newUser);
    showMessage({
      message: `Пользователь - ${inputValue} успешно создан!`,
      type: "success",
    });
    handleClearInput();
  };

  return (
    <View style={[styles.container, { zIndex: zIndex }]}>
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
            placeholder={placeholder}
            autoComplete="off"
            importantForAutofill="no"
            textContentType="none"
          />
          {open ? (
            <TouchableOpacity onPress={handleClearInput} style={styles.arrowDown}>
              <Ionicons name="close" size={20} color={"white"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setOpen((prev) => !prev)} style={styles.arrowDown}>
              <Ionicons name="arrow-down" size={20} color={"white"} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownStyles}>
          <ScrollView>
            {loading ? (
              <Text style={styles.loadingText}>Загрузка...</Text>
            ) : (
              filteredData.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => handleSearchSelect(item)} style={styles.dropdownItemStyles}>
                  <Text style={styles.dropdownTextStyles}>{item.value}</Text>
                </TouchableOpacity>
              ))
            )}

            {!loading && !filteredData.length && (
              <View>
                <Text style={styles.userNotDefined}>Пользователь не найден :(</Text>
                <TouchableOpacity onPress={handleCreateUser} style={styles.dropdownItemStyles}>
                  <Text style={styles.dropdownTextStyles}>Создать покупателя "{inputValue}"</Text>
                </TouchableOpacity>
              </View>
            )}
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
