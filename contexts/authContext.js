import React, { createContext, useState, useEffect } from "react";
import { LOGIN, TOKEN } from "../constants";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // для входа
  async function logIn(formData, navigation) {
    setIsLoading(true);
    try {
      setIsLoggedIn(true);
      let res = await api.post(LOGIN, formData);
      await AsyncStorage.setItem(TOKEN, JSON.stringify(res.data.token));
      await AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));
      navigation.navigate("work-places");
      setIsLoading(false);

      return res.data;
    } catch (error) {
      console.log("error: ", error);
      setIsLoading(false);
      setIsLoggedIn(false);
    }
  }

  return (
    <authContext.Provider
      value={{ user, error, isLoading, isLoggedIn, logIn, setIsLoading }}
    >
      {children}
    </authContext.Provider>
  );
};
export default AuthContextProvider;
