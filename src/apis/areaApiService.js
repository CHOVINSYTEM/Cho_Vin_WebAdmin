import axios from "axios";
import {
  BASE_URL_CORAL_TEAM_VERSION,
} from "./constants";

const token = localStorage.getItem("vhgp-token");

//https://deliveryvhgp-webapi.azurewebsites.net/api/v2/hubs?pageIndex=1&pageSize=20
export const getListHub = (page, size) => {
  return axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}${"hubs"}?pageIndex=${page}&pageSize=${size}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/areas
export const postArea = (store) => {
  return axios.post(`${BASE_URL_CORAL_TEAM_VERSION}areas`, store, 
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )
};

//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/buildings/ByArea?AreaId=1&ClusterId=2
export const postBuilding = (AreaId, ClusterId, building) => {
  return axios.post(
    `${BASE_URL_CORAL_TEAM_VERSION}buildings/ByArea?AreaId=${AreaId}&ClusterId=${ClusterId}`,
    building,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

//https://deliveryvhgp-webapi.azurewebsites.net/api/v2/hubs
export const postHub = (hub) => {
  return axios.post(`${BASE_URL_CORAL_TEAM_VERSION}hubs`, hub, 
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/areas/9
export const putArea = (area) => {
  return axios.patch(`${BASE_URL_CORAL_TEAM_VERSION}areas/${area.id}`, area, 
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
//https://deliveryvhgp-webapi.azurewebsites.net/api/v2/hubs/1
export const putHub = (hub) => {
  return axios.patch(`${BASE_URL_CORAL_TEAM_VERSION}hubs/${hub.id}`, hub, 
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/buildings/ByBuildingId?buildingId=1
export const putBuilding = (building, id) => {
  return axios.patch(
    `${BASE_URL_CORAL_TEAM_VERSION}buildings/ByBuildingId?buildingId=${id}`,
    building,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/areas/e2176f96-6e98-4cfa-a528-fa1b7cb073dd
export const deleteArea = (id) => {
  return axios.delete(`${BASE_URL_CORAL_TEAM_VERSION}areas/${id}`, 
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

//https://deliveryvhgp-webapi.azurewebsites.net/api/v2/hubs/1
export const deleteHub = (id) => {
  return axios.delete(`${BASE_URL_CORAL_TEAM_VERSION}hubs/${id}`, 
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

//https://deliveryvhgp-webapi.azurewebsites.net/api/v1/buildings/a
export const deleteBuilding = (id) => {
  return axios.delete(`${BASE_URL_CORAL_TEAM_VERSION}buildings/${id}`, 
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
