import axios from "axios";
import { BASE_URL } from "../constants";

const ApiManager = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
  withCredentials: true,
});

export default ApiManager;
