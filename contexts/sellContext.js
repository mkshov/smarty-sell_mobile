import React, { createContext, useState, useReducer } from "react";
import api from "../api/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

const ENDPOINTS = {
  PLACES: "/company/v1/places/",
  PLACE_CURRENCY: "/company/v1/places/",
  CUSTOMERS: "/customers/v1/customers/",
  SELLS: "/realization/v1/sells/",
};
export const sellContext = createContext();

const INIT_STATE = {
  sellSendWithOutCustomer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case ENDPOINTS.SELLS:
      return { ...state, sellSendWithOutCustomer: action.payload };
    default:
      return state;
  }
}

const SellContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const [isLoading, setIsLoading] = useState(false);
  const [sellPlaces, setSellPlaces] = useState(null);
  const [sellCurrencies, setSellCurrencies] = useState(null);
  const [sellCustomers, setSellCustomers] = useState(null);
  const [selectedSellPlace, setSelectedSellPlace] = useState({
    selectedPlace: null,
    selectedCurency: null,
    selectedCustomer: null,
    withOutCustomer: false,
    customer: null,
  });
  const [sellCart, setSellCart] = useState([]);
  const [productStates, setProductStates] = useState([]);
  const [changeAmount, setChangeAmount] = useState(0);
  const [error, setError] = useState(null);
  const [modalCheck, setModalCheck] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [withOutCustomerModal, setWithOutCustomerModal] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState(null);

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
  const getSellCustomers = async (search = "") => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`${ENDPOINTS.CUSTOMERS}?is_active=true&search=${search}`);
      setIsLoading(false);
      setSellCustomers(data.results);

      return data.results;
    } catch (error) {
      setIsLoading(false);

      console.log("error: ", error);
    }
  };

  const getCustomer = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`${ENDPOINTS.CUSTOMERS}${id}/`);
      setIsLoading(false);
      setSelectedSellPlace((prev) => ({ ...prev, customer: data }));

      return data;
    } catch (error) {
      setIsLoading(false);

      console.log("error: ", error);
    }
  };

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem("sellCart");
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

  async function sendProductsWithOutCustomer(data) {
    try {
      setIsLoading(true);
      let res = await api.post(ENDPOINTS.SELLS, data);
      dispatch({
        type: ENDPOINTS.SELLS,
        payload: res.data,
      });
      setIsLoading(false);
      setModalCheck(true);
    } catch (error) {
      console.log("error: ", error);
      // setError(error.response.data);
      setModalCheck(false);
      setModalConfirm(false);
      setWithOutCustomerModal(false);
      if (error.response.data.errors[0].code === "change_greater_than_balance") {
        showMessage({
          message: `Сумма сдачи превышает сумму на балансе кошелька!`,
          type: "danger",
          duration: 3000,
        });
      }
    }
  }

  async function createUser(name) {
    let res = await api.post(`${ENDPOINTS.CUSTOMERS}`, name);
    return res;
  }

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
        changeAmount,
        sellSendWithOutCustomer: state.sellSendWithOutCustomer,
        error,
        modalCheck,
        modalConfirm,
        withOutCustomerModal,
        setSellCart,
        setError,
        setChangeAmount,
        setSelectedSellPlace,
        getSellPlaces,
        getSellCurrencies,
        getSellCustomers,
        setProductStates,
        loadCart,
        saveCart,
        sendProductsWithOutCustomer,
        setModalCheck,
        setModalConfirm,
        setWithOutCustomerModal,
        createUser,
        getCustomer,
      }}
    >
      {children}
    </sellContext.Provider>
  );
};
export default SellContextProvider;
