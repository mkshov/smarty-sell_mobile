import React, { createContext, useState, useEffect } from "react";
import { LOGIN, TOKEN } from "../constants";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ENDPOINTS = {
  PLACES: "/company/v1/places/",
  PLACE_CURRENCY: "/company/v1/place_currencies/",
  PLACE_TYPE_RATES: "company/v1/place_type_rates/",
};
export const sellContext = createContext();

const SellContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sellPlaces, setSellPlaces] = useState(null);

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
  return <sellContext.Provider value={{ sellPlaces, getSellPlaces }}>{children}</sellContext.Provider>;
};
export default SellContextProvider;
