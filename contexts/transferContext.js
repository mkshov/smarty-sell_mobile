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
  const [scannedProducts, setScannedProducts] = useState([]);
  const [amountInPlace, setAmountInPlace] = useState(null);

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
      console.log("error: ", error);
      setIsLoading(false);
      setError(error.response.data);
      return error.response.data;
    }
  };
  const addProductToTransfer = async (data, id) => {
    setIsLoading(true);
    try {
      const response = await api.post(`${ENDPOINTS.TRANSFER}${id}/products/`, data);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      return error.response.data.errors[0];
    }
  };
  const getAmountInPlace = async (id) => {
    setIsLoading(true);
    try {
      const response = await api.get(`${ENDPOINTS.TRANSFER}${id}/products/?get_amount=true`);
      setIsLoading(false);
      setAmountInPlace(response.data.results);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      return error.response.data.errors[0];
    }
  };

  const sendTransfer = async (id) => {
    setIsLoading(true);
    try {
      await api.post(`${ENDPOINTS.TRANSFER}${id}/send/`);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
        const errorMessage = error.response.data.errors[0].message;
        if (errorMessage === "Transfer is empty!") {
          return { error: { code: "emptiness", message: "Невозможно перевезти пустой трансфер! Для перевозки добавьте продукты." } };
        } else {
          return { error: { code: "unknown", message: errorMessage } };
        }
      } else {
        return { error: { code: "unknown", message: "Произошла неизвестная ошибка" } };
      }
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
        scannedProducts,
        amountInPlace,
        setError,
        setScannedProducts,
        getTransfers,
        getTransfer,
        createTransfer,
        getTransferProducts,
        deleteTransfer,
        scanProductForTransfer,
        addProductToTransfer,
        getAmountInPlace,
        sendTransfer,
      }}
    >
      {children}
    </transferContext.Provider>
  );
};
export default TransferContextProvider;
