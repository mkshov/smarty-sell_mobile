import api from "../api/axios";

const ENDPOINTS = {
  BARCODES: "/barcode/v1/barcodes/",
  PLACEMENTS: "/product/v1/placements/",
  TRANSFER: "/transfer/v1/transfers/",
  ALLPLACES: "/company/v1/places/all/",
};

export const getTransfers = async (params) => {
  try {
    const response = await api.get(`${ENDPOINTS.TRANSFER}`);
    return response.data.results;
  } catch (error) {
    console.log("error: ", error);
  }
};
