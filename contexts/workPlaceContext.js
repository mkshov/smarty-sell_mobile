import React, { createContext, useState, useEffect, useCallback } from "react";
import { STORAGE, LOGIN, TOKEN } from "../constants";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

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
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [savedPlace, setSavedPlace] = useState(null);

  // для входа
  async function getPlaces(params) {
    setIsLoading(true);

    try {
      const response = await api.get(ENDPOINTS.PLACES);
      setPlaces(response.data.results);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error);
    }
  }

  const handleSave = useCallback(
    async (navigation) => {
      await AsyncStorage.setItem(STORAGE.SAVED_PLACE, JSON.stringify(selectedPlace));
      getSavedPlace();
      navigation.navigate("/");
    },
    [selectedPlace]
  );

  const getSavedPlace = async () => {
    let placeStr = await AsyncStorage.getItem(STORAGE.SAVED_PLACE);
    let place = JSON.parse(placeStr);
    setSavedPlace(place);
    return place;
  };

  const logOut = async (navigation) => {
    await AsyncStorage.removeItem(TOKEN);
    await AsyncStorage.removeItem(STORAGE.SAVED_PLACE);
    setSavedPlace(null);
    navigation.navigate("login");
  };

  return (
    <workPlaceContext.Provider
      value={{
        places,
        isLoading,
        selectedPlace,
        savedPlace,
        setSelectedPlace,
        getPlaces,
        handleSave,
        getSavedPlace,
        logOut,
      }}
    >
      {children}
    </workPlaceContext.Provider>
  );
};
export default WorkPlaceContextProvider;
