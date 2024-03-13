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
  const [token, setToken] = useState(null);

  // для входа
  async function logIn(formData, navigation) {
    setIsLoading(true);
    try {
      setIsLoggedIn(true);
      let res = await api.post(LOGIN, formData);
      setUser(res.data);
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

  const getToken = async () => {
    const token = await AsyncStorage.getItem(TOKEN);
    setToken(token);
  };

  const getUser = async () => {
    const response = await api.get("/auth/v1/info/");
    setUser(response.data);
  };

  useEffect(() => {
    getToken();
  }, [getToken]);

  useEffect(() => {
    if (!user && token) {
      getUser();
    }
  }, [user, token, getUser]);

  return (
    <authContext.Provider
      value={{ user, error, isLoading, isLoggedIn, logIn, setIsLoading }}
    >
      {children}
    </authContext.Provider>
  );
};
export default AuthContextProvider;
