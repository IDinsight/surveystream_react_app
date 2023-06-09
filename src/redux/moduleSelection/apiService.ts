// apiService.ts
import axios from "axios";
import { ModuleStatus } from "./types";
import { API_BASE_URL } from "../../config/url";

// Define functions for making API requests
export const fetchModuleStatuses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/module-statuses`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch module statuses");
  }
};

export const createModuleStatus = async (moduleStatusData: ModuleStatus) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/module-statuses`,
      moduleStatusData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create module status");
  }
};

export const fetchModules = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modules`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch modules");
  }
};

export const api = {
  fetchModuleStatuses,
  createModuleStatus,
  fetchModules,
};
