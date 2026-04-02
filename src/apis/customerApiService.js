import axios from "axios";
import { BASE_URL_CORAL_TEAM_VERSION } from "./constants";

const getAuthHeader = () => {
  const token = localStorage.getItem("vhgp-token");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createCustomer = (customerInfo) => {
  return axios.post(
    `${BASE_URL_CORAL_TEAM_VERSION}customer-management`,
    customerInfo,
    {
      headers: getAuthHeader(),
    }
  );
};
