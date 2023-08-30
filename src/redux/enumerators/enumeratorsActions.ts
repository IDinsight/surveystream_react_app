import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { EnumeratorMapping } from "./types";
import {
  bulkUpdateEnumeratorsFailure,
  bulkUpdateEnumeratorsLocationMappingFailure,
  bulkUpdateEnumeratorsLocationMappingRequest,
  bulkUpdateEnumeratorsLocationMappingSuccess,
  bulkUpdateEnumeratorsRequest,
  bulkUpdateEnumeratorsSuccess,
  getEnumeratorsColumnConfigFailure,
  getEnumeratorsColumnConfigRequest,
  getEnumeratorsColumnConfigSuccess,
  getEnumeratorsFailure,
  getEnumeratorsRequest,
  getEnumeratorsSuccess,
  postEnumeratorsMappingFailure,
  postEnumeratorsMappingRequest,
  postEnumeratorsMappingSuccess,
  updateEnumeratorColumnConfigFailure,
  updateEnumeratorColumnConfigRequest,
  updateEnumeratorColumnConfigSuccess,
  updateEnumeratorFailure,
  updateEnumeratorRequest,
  updateEnumeratorSuccess,
} from "./enumeratorsSlice";

export const postEnumeratorsMapping = createAsyncThunk(
  "enumerators/postEnumeratorsMapping",
  async (
    {
      enumeratorMappingData,
      formUID,
    }: {
      enumeratorMappingData: EnumeratorMapping;
      formUID: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postEnumeratorsMappingRequest());
      const response: any = await api.uploadEnumeratorMapping(
        enumeratorMappingData,
        formUID
      );
      if (response.status == 200) {
        dispatch(postEnumeratorsMappingSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to upload enumerators mapping.",
        success: false,
      };
      dispatch(postEnumeratorsMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to upload enumerators mapping.";
      dispatch(postEnumeratorsMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEnumerators = createAsyncThunk(
  "enumerators/getEnumerators",
  async (
    {
      formUID,
      enumeratorType,
    }: {
      formUID: string;
      enumeratorType?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getEnumeratorsRequest());
      const response: any = await api.fetchEnumerators(formUID, enumeratorType);
      if (response.status == 200) {
        dispatch(getEnumeratorsSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch enumerators.",
        success: false,
      };
      dispatch(getEnumeratorsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch enumerators list.";
      dispatch(getEnumeratorsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEnumerator = createAsyncThunk(
  "enumerators/updateEnumerator",
  async (
    {
      enumeratorUID,
      enumeratorData,
    }: {
      enumeratorUID: string;
      enumeratorData: any;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateEnumeratorRequest());
      const response: any = await api.updateEnumerator(
        enumeratorUID,
        enumeratorData
      );
      if (response.status == 200) {
        dispatch(updateEnumeratorSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update enumerator.",
        success: false,
      };
      dispatch(updateEnumeratorFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update enumerator.";
      dispatch(updateEnumeratorFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const bulkUpdateEnumerators = createAsyncThunk(
  "enumerators/bulkUpdateEnumerators",
  async (
    {
      enumeratorUIDs,
      formUID,
      patchKeys,
    }: {
      enumeratorUIDs: string[];
      formUID: string;
      patchKeys: any;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(bulkUpdateEnumeratorsRequest());
      const response: any = await api.bulkUpdateEnumerators(
        enumeratorUIDs,
        formUID,
        patchKeys
      );
      if (response.status == 200) {
        dispatch(bulkUpdateEnumeratorsSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to bulk update enumerators.",
        success: false,
      };
      dispatch(bulkUpdateEnumeratorsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to bulk update enumerators.";
      dispatch(bulkUpdateEnumeratorsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const bulkUpdateEnumeratorsLocationMapping = createAsyncThunk(
  "enumerators/bulkUpdateEnumeratorsLocationMapping",
  async (
    {
      enumeratorType,
      enumeratorUIDs,
      formUID,
      locationUIDs,
    }: {
      enumeratorType: string;
      enumeratorUIDs: string[];
      formUID: string;
      locationUIDs: string[];
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(bulkUpdateEnumeratorsLocationMappingRequest());
      const response: any = await api.bulkUpdateEnumeratorsLocationMapping(
        enumeratorType,
        enumeratorUIDs,
        formUID,
        locationUIDs
      );
      if (response.status == 200) {
        dispatch(bulkUpdateEnumeratorsLocationMappingSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to bulk update enumerators location mapping.",
        success: false,
      };
      dispatch(bulkUpdateEnumeratorsLocationMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage =
        error || "Failed to bulk update enumerators location mapping.";
      dispatch(bulkUpdateEnumeratorsLocationMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEnumeratorsColumnConfig = createAsyncThunk(
  "enumerators/getEnumeratorsColumnConfig",
  async (
    {
      formUID,
    }: {
      formUID: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getEnumeratorsColumnConfigRequest());
      const response: any = await api.fetchEnumeratorsColumnConfig(formUID);
      if (response.status == 200) {
        dispatch(getEnumeratorsColumnConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to get enumerators column config.",
        success: false,
      };
      dispatch(getEnumeratorsColumnConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to get enumerators column config.";
      dispatch(getEnumeratorsColumnConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEnumeratorColumnConfig = createAsyncThunk(
  "enumerators/updateEnumeratorColumnConfig",
  async (
    {
      formUID,
      columnConfig,
    }: {
      formUID: string;
      columnConfig: any;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateEnumeratorColumnConfigRequest());
      const response: any = await api.updateEnumeratorsColumnConfig(
        formUID,
        columnConfig
      );
      if (response.status == 200) {
        dispatch(updateEnumeratorColumnConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update enumerators column config.",
        success: false,
      };
      dispatch(updateEnumeratorColumnConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage =
        error || "Failed to update enumerators column config.";
      dispatch(updateEnumeratorColumnConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const enumeratorsActions = {
  postEnumeratorsMapping,
  updateEnumerator,
  getEnumerators,
  bulkUpdateEnumerators,
  bulkUpdateEnumeratorsLocationMapping,
  getEnumeratorsColumnConfig,
  updateEnumeratorColumnConfig,
};
