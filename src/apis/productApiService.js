import axios from "axios";
import {
  BASE_URL,
  CATEGORY,
  PRODUCT,
  BASE_URL_CORAL_TEAM_VERSION,
} from "./constants";

const token = localStorage.getItem("vhgp-token");

//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/products/s4/products?pageIndex=1&pageSize=10
export const getListProducts = (shopId, page, size) => {
  return axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}/${PRODUCT}/${shopId}/${PRODUCT}?pageIndex=${page}&pageSize=${size}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const putProductInStore = (product) => {
  return axios.patch(
    `${BASE_URL_CORAL_TEAM_VERSION}/${PRODUCT}/${product.id}`,
    product,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
