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

// GET /api/v1/buildings?pageIndex=1&pageSize=100
export const getListBuildings = (page, size) => {
  return axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}buildings?pageIndex=${page}&pageSize=${size}`,
    {
      headers: getAuthHeader(),
    }
  );
};

// GET /api/v1/buildings/{id}
export const getBuildingById = (id) => {
  return axios.get(
    `${BASE_URL_CORAL_TEAM_VERSION}buildings/${id}`,
    {
      headers: getAuthHeader(),
    }
  );
};

// POST /api/v1/buildings
export const createBuilding = (building) => {
  return axios.post(
    `${BASE_URL_CORAL_TEAM_VERSION}buildings`,
    building,
    {
      headers: getAuthHeader(),
    }
  );
};

// POST /api/v1/buildings/ByArea?AreaId=1&ClusterId=2
export const createBuildingByArea = (areaId, clusterId, building) => {
  return axios.post(
    `${BASE_URL_CORAL_TEAM_VERSION}buildings/ByArea?AreaId=${areaId}&ClusterId=${clusterId}`,
    building,
    {
      headers: getAuthHeader(),
    }
  );
};

// PATCH /api/v1/buildings/ByBuildingId?buildingId=1
export const updateBuilding = (building, buildingId) => {
  return axios.patch(
    `${BASE_URL_CORAL_TEAM_VERSION}buildings/ByBuildingId?buildingId=${buildingId}`,
    building,
    {
      headers: getAuthHeader(),
    }
  );
};

// DELETE /api/v1/buildings/{buildingId}
export const deleteBuildingById = (buildingId) => {
  return axios.delete(
    `${BASE_URL_CORAL_TEAM_VERSION}buildings/${buildingId}`,
    {
      headers: getAuthHeader(),
    }
  );
};
