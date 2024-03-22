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
  SCAN_IN_PLACE: "/barcode/v1/barcodes/scan_in_place/",
};

const TransferContextProvider = ({ children }) => {
  const [transfers, setTransfers] = useState([]);
  const [transfer, setTransfer] = useState(null);
  const [transferProducts, setTransferProducts] = useState(null);
  const [newTransfer, setNewTransfer] = useState(null);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(true);

  const getTransfers = async (params) => {
    setIsLoading(true);
    try {
      const response = await api.get(ENDPOINTS.TRANSFER, { params: params });
      setTransfers(response.data.results);
      setIsLoadingTransfers(false);
      setIsLoading(false);

      return response.data.results;
    } catch (error) {
      setIsLoadingTransfers(false);
      setIsLoading(false);

      console.log("error: ", error);
    }
  };

  const getTransfer = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`${ENDPOINTS.TRANSFER}${id}/`);
      setTransfer(data);
      setIsLoading(false);

      return data;
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error);
    }
  };

  const deleteTransfer = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await api.delete(`${ENDPOINTS.TRANSFER}${id}/`);
      setTransfer(data);
      setIsLoading(false);

      return data;
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error);
    }
  };

  const getTransferProducts = async (id, params) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`${ENDPOINTS.TRANSFER}${id}/products/`);
      setTransferProducts(data);
      setIsLoading(false);

      return data;
    } catch (error) {
      setIsLoading(false);

      console.log("error: ", error);
    }
  };

  const createTransfer = async (params, navigation) => {
    setIsLoading(true);
    try {
      const response = await api.post(ENDPOINTS.TRANSFER, params);
      setNewTransfer(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error);
    }
  };

  const scanProductForTransfer = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post(ENDPOINTS.SCAN_IN_PLACE, data);
      setScannedProduct(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.log("error: ", error);
      setError(error.response);
    }
  };

  return (
    <transferContext.Provider
      value={{
        error,
        transfers,
        transfer,
        isLoading,
        newTransfer,
        isLoadingTransfers,
        transferProducts,
        scannedProduct,
        getTransfers,
        getTransfer,
        createTransfer,
        getTransferProducts,
        deleteTransfer,
        scanProductForTransfer,
      }}
    >
      {children}
    </transferContext.Provider>
  );
};
export default TransferContextProvider;
