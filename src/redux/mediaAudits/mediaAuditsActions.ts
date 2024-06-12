import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  getMediaAuditsConfigsRequest,
  getMediaAuditsConfigsSuccess,
  getMediaAuditsConfigsFailure,
  getMediaAuditConfigRequest,
  getMediaAuditConfigSuccess,
  getMediaAuditConfigFailure,
  createMediaAuditConfigRequest,
  createMediaAuditConfigSuccess,
  createMediaAuditConfigFailure,
  updateMediaAuditConfigRequest,
  updateMediaAuditConfigSuccess,
  updateMediaAuditConfigFailure,
  deleteMediaAuditConfigRequest,
  deleteMediaAuditConfigSuccess,
  deleteMediaAuditConfigFailure,
} from "./mediaAuditsSlice";

export const getMediaAuditsConfigs = createAsyncThunk(
  "mediaAudits/getMediaAuditsConfigs",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getMediaAuditsConfigsRequest());
      const response: any = await api.fetchAllMediaAuditsConfigs(formUID);
      if (response.status == 200) {
        dispatch(getMediaAuditsConfigsSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch target status mapping.",
        success: false,
      };
      dispatch(getMediaAuditsConfigsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch target status mapping.";
      dispatch(getMediaAuditsConfigsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getMediaAuditConfig = createAsyncThunk(
  "mediaAudits/getMediaAuditConfig",
  async (
    { mediaConfigUID }: { mediaConfigUID: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getMediaAuditConfigRequest());
      const response: any = await api.fetchMediaAuditConfig(mediaConfigUID);
      if (response.status == 200) {
        dispatch(getMediaAuditConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch target status mapping.",
        success: false,
      };
      dispatch(getMediaAuditConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch target status mapping.";
      dispatch(getMediaAuditConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const createMediaAuditConfig = createAsyncThunk(
  "mediaAudits/createMediaAuditConfig",
  async (
    { formUID, data }: { formUID: string; data: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(createMediaAuditConfigRequest());
      const response: any = await api.createMediaAuditConfig(formUID, data);
      if (response.status == 200) {
        dispatch(createMediaAuditConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update target status mapping.",
        success: false,
      };
      dispatch(createMediaAuditConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update target status mapping.";
      dispatch(createMediaAuditConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateMediaAuditConfig = createAsyncThunk(
  "mediaAudits/updateMediaAuditConfig",
  async (
    { mediaConfigUID, data }: { mediaConfigUID: string; data: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateMediaAuditConfigRequest());
      const response: any = await api.updateMediaAuditConfig(
        mediaConfigUID,
        data
      );
      if (response.status == 200) {
        dispatch(updateMediaAuditConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update target status mapping.",
        success: false,
      };
      dispatch(updateMediaAuditConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update target status mapping.";
      dispatch(updateMediaAuditConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMediaAuditConfig = createAsyncThunk(
  "mediaAudits/deleteMediaAuditConfig",
  async (
    { mediaConfigUID }: { mediaConfigUID: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(deleteMediaAuditConfigRequest());
      const response: any = await api.deleteMediaAuditConfig(mediaConfigUID);
      if (response.status == 200) {
        dispatch(deleteMediaAuditConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update target status mapping.",
        success: false,
      };
      dispatch(deleteMediaAuditConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update target status mapping.";
      dispatch(deleteMediaAuditConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const enumeratorsActions = {
  getMediaAuditsConfigs,
  getMediaAuditConfig,
  createMediaAuditConfig,
  updateMediaAuditConfig,
  deleteMediaAuditConfig,
};
