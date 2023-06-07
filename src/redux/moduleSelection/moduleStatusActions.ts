// moduleActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ModuleStatus } from "./types";
import * as api from "./apiService";

export const fetchModuleStatuses = createAsyncThunk(
  "moduleStatuses/fetchModuleStatuses",
  async (_, { rejectWithValue }) => {
    try {
      const moduleStatuses = await api.fetchModuleStatuses(); // Replace with your API call
      return moduleStatuses;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const createModuleStatus = createAsyncThunk(
  "moduleStatuses/createModuleStatus",
  async (moduleStatus: ModuleStatus, { rejectWithValue }) => {
    try {
      const createdModuleStatus = await api.createModuleStatus(moduleStatus); // Replace with your API call
      return createdModuleStatus;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const moduleActions = {
  fetchModuleStatuses,
  createModuleStatus,
};
