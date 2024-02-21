import { LOGIN } from "../constants";
import ApiManager from "./apiManager";

export const userLogin = async (data) => {
  try {
    const res = await ApiManager(LOGIN, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      data: data,
    });
    return res;
  } catch (error) {
    return error.response.data;
  }
};
