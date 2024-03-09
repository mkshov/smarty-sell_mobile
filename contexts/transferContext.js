import React, { createContext, useState, useEffect } from "react";
import { LOGIN, TOKEN } from "../constants";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const transferContext = createContext();

const ENDPOINTS = {
  BARCODES: "/barcode/v1/barcodes/",
  PLACEMENTS: "/product/v1/placements/",
  TRANSFER: "/transfer/v1/transfers/",
  ALLPLACES: "/company/v1/places/all/",
};

const TransferContextProvider = ({ children }) => {
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getTransfers = async (params) => {
    setIsLoading(true);
    try {
      const response = await api.get(ENDPOINTS.TRANSFER, { params: params });
      setTransfers(response.data.results);
      setIsLoading(false);

      return response.data.results;
    } catch (error) {
      setIsLoading(false);

      console.log("error: ", error);
    }
  };

  const createTransfer = async (data, navigation) => {
    setIsLoading(true);
    try {
      const response = await api.post(ENDPOINTS.TRANSFER, data);
      console.log("response create: ", response);

      setIsLoading(false);
      return response.data.results;
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error);
    }
  };

  return (
    <transferContext.Provider
      value={{ transfers, isLoading, getTransfers, createTransfer }}
    >
      {children}
    </transferContext.Provider>
  );
};
export default TransferContextProvider;
