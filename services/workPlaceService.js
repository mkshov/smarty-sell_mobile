import api from "../api/axios";

const ENDPOINTS = {
  PLACES: "/company/v1/places/",
  PLACE_CURRENCY: "/company/v1/place_currencies/",
  PLACE_TYPE_RATES: "company/v1/place_type_rates/",
};

export const getPlaces = async (params) => {
  try {
    const response = await api.get(ENDPOINTS.PLACES);
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
  }
};
