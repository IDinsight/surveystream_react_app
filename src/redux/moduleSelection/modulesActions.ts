// moduleActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Module } from "./types";
import * as api from "./apiService";
import {
  fetchModulesFailure,
  fetchModulesRequest,
  fetchModulesSuccess,
} from "./modulesSlice";
import { moduleDescriptions } from "./moduleDescriptions";

export const fetchModules = createAsyncThunk(
  "modules/fetchModules",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchModulesRequest());
      const modules = await api.fetchModules();

      const moduleData = modules.data;
      const moduleIds = moduleData.map((module: any) => module.module_id);
      const moduleNames = moduleData.map((module: any) => module.name);
      const moduleOptionals = moduleData.map((module: any) => module.optional);

      // Filter and transform modules
      const transformedModules = moduleDescriptions
        .filter((module) => moduleIds.includes(module.module_id))
        .map((module) => {
          const index = moduleIds.indexOf(module.module_id);
          return {
            ...module,
            name: moduleNames[index],
            optional: moduleOptionals[index],
          };
        });

      dispatch(fetchModulesSuccess(transformedModules));
      return transformedModules as Module[];
    } catch (error) {
      const errorMessage = error || "Failed to fetch modules";
      dispatch(fetchModulesFailure(errorMessage as string));
      return rejectWithValue(errorMessage as string);
    }
  }
);

export const moduleActions = {
  fetchModules,
};
