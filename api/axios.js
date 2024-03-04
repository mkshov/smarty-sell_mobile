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

export default api;
