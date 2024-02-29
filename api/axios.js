import axios from "axios";
import { BASE_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  console.log("config: ", config);
  const customConfig = config;
  const token = await AsyncStorage.getItem("_ss:access");
  console.log("token: ", token);
  if (token) {
    console.log("hello");
    customConfig.headers.Authorization = `Bearer ${token}`;
  }
  console.log("customConfig: ", customConfig);

  return customConfig;
});

export default api;
