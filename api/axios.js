import axios from "axios";
import { BASE_URL, TOKEN } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const customConfig = config;
  const token = await AsyncStorage.getItem(TOKEN);
  if (token) {
    customConfig.headers.Authorization = `Bearer ${token}`;
  }

  return customConfig;
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log("error: ", error);
    // if (error && error.response && error.response.status >= 500) {
    //   throw new Error("Ошибка сервера");
    // }
    return Promise.reject(error);
  }
);

export default api;
