import React, { createContext, useState, useEffect } from "react";
import { LOGIN, TOKEN } from "../constants";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const workPlaceContext = createContext();

const ENDPOINTS = {
  PLACES: "/company/v1/places/",
  PLACE_CURRENCY: "/company/v1/place_currencies/",
  PLACE_TYPE_RATES: "company/v1/place_type_rates/",
};

const WorkPlaceContextProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // для входа
  async function getPlaces(params) {
    setIsLoading(true);

    try {
      const response = await api.get(ENDPOINTS.PLACES);
      console.log("response: ", response);
      setPlaces(response.data.results);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error);
    }
  }

  return (
    <workPlaceContext.Provider value={{ places, getPlaces, isLoading }}>
      {children}
    </workPlaceContext.Provider>
  );
};
export default WorkPlaceContextProvider;
