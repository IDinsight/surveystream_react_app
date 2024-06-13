import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  getTargetStatusMappingRequest,
  getTargetStatusMappingSuccess,
  getTargetStatusMappingFailure,
  updateTargetStatusMappingRequest,
  updateTargetStatusMappingSuccess,
  updateTargetStatusMappingFailure,
} from "./targetStatusMappingSlice";

export const getTargetStatusMapping = createAsyncThunk(
  "targetStatusMapping/getStatusMapping",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getTargetStatusMappingRequest());
      const response: any = await api.fetchTargetStatusMapping(formUID);
      if (response.status == 200) {
        dispatch(getTargetStatusMappingSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch target status mapping.",
        success: false,
      };
      dispatch(getTargetStatusMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch target status mapping.";
      dispatch(getTargetStatusMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTargetStatusMapping = createAsyncThunk(
  "targetStatusMapping/updateStatusMapping",
  async (
    { formUID, data }: { formUID: string; data: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateTargetStatusMappingRequest());
      const response: any = await api.updateTargetStatusMapping(formUID, data);
      if (response.status == 200) {
        dispatch(updateTargetStatusMappingSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update target status mapping.",
        success: false,
      };
      dispatch(updateTargetStatusMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update target status mapping.";
      dispatch(updateTargetStatusMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const enumeratorsActions = {
  getTargetStatusMapping,
  updateTargetStatusMapping,
};
