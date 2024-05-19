import React, { createContext, useState, useEffect } from "react";
import { LOGIN, TOKEN } from "../constants";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

const ENDPOINTS = {
  PLACES: "/company/v1/places/",
  PLACE_CURRENCY: "/company/v1/places/",
  CUSTOMERS: "/customers/v1/customers/",
};
export const sellContext = createContext();

const SellContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sellPlaces, setSellPlaces] = useState(null);
  const [sellCurrencies, setSellCurrencies] = useState(null);
  const [sellCustomers, setSellCustomers] = useState(null);
  const [selectedSellPlace, setSelectedSellPlace] = useState({
    selectedPlace: null,
    selectedCurency: null,
    selectedCustomer: null,
  });
  const [sellCart, setSellCart] = useState([]);
  const [productStates, setProductStates] = useState([]);

  const getSellPlaces = async (params) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.PLACES, { params });
      setIsLoading(false);
      setSellPlaces(data.results);

      return data.results;
    } catch (error) {
      setIsLoading(false);

      console.log("error: ", error);
    }
  };
  const getSellCurrencies = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`${ENDPOINTS.PLACE_CURRENCY}${id}/currencies/`);
      setIsLoading(false);
      setSellCurrencies(data);

      return data;
    } catch (error) {
      setIsLoading(false);

      console.log("error: ", error);
    }
  };
  const getSellCustomers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.CUSTOMERS, { is_active: true });
      setIsLoading(false);
      setSellCustomers(data.results);

      return data.results;
    } catch (error) {
      setIsLoading(false);

      console.log("error: ", error);
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem("sellCart");
      console.log("cartData: ", JSON.parse(cartData));
      if (cartData !== null) {
        setSellCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error("Failed to load cart from storage", error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem("sellCart", JSON.stringify(sellCart));
      loadCart();
      showMessage({
        message: "Корзина сохранена",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to save cart to storage", error);
    }
  };

  return (
    <sellContext.Provider
      value={{
        isLoading,
        productStates,
        sellPlaces,
        sellCurrencies,
        sellCustomers,
        selectedSellPlace,
        sellCart,
        setSellCart,
        setSelectedSellPlace,
        getSellPlaces,
        getSellCurrencies,
        getSellCustomers,
        setProductStates,
        loadCart,
        saveCart,
      }}
    >
      {children}
    </sellContext.Provider>
  );
};
export default SellContextProvider;
