import axios from "axios";
import { SHIP, BASE_URL_CORAL_TEAM_VERSION } from "./constants";

const getAuthHeader = () => {
  const token = localStorage.getItem("vhgp-token");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/shipper-management/shippers?pageIndex=1&pageSize=20
export const getListShipper = (page, size) => {
  return axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers?pageIndex=${page}&pageSize=${size}`,
    {
      headers: getAuthHeader(),
    },
  );
};
// https://api.vhgp.net/api/v1/shipper-management/shippers/search-name?shipName=thien&pageIndex=1&pageSize=100'
export const getListShipperbyKey = (key, page, size) => {
  return axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers/search-name?shipName=${key}&pageIndex=${page}&pageSize=${size}`,
    {
      headers: getAuthHeader(),
    },
  );
};
//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/shipper-management/shippers
export const postShipper = (shipper) => {
  return axios.post(`${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers`, shipper, 
    {
      headers: getAuthHeader(),
    },
  );
};
//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/shipper-management/shippers/1
export const putShipper = (shipper) => {
  return axios.patch(
    `${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers/${shipper.id}`,
    shipper,
    {
      headers: getAuthHeader(),
    },
  );
};
//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/shipper-management/shippers/{shipperId}
export const deleteShipper = (shipperId) => {
  return axios.delete(
    `${BASE_URL_CORAL_TEAM_VERSION}${SHIP}/shippers/${shipperId}`,
    {
      headers: getAuthHeader(),
    },
  );
};
//http://vhgp-api.vhgp.net/api/Shipper/GetRedis
export const getShipperRedis = async () => {
  return await axios.get(`${BASE_URL_CORAL_TEAM_VERSION}api/shippers/redis`);
};


//https://vhgp-api.vhgp.net/api/Shipper
export const getAllShipper = async () => {
  return await axios.get(`${BASE_URL_CORAL_TEAM_VERSION}api/shippers`);
};

//https://vhgp-api.vhgp.net/api/Shipper/GetTimeShipperOff/{shipperId}
export const getTimeShipperOffline = async (shipper) => {
  return await axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}api/shippers/${shipper.id}/time-off`
  );
};
