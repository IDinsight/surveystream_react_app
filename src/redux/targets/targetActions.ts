import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { TargetMapping } from "./types";
import {
  bulkUpdateTargetsFailure,
  bulkUpdateTargetsRequest,
  bulkUpdateTargetsSuccess,
  getTargetDetailsFailure,
  getTargetDetailsRequest,
  getTargetDetailsSuccess,
  getTargetsColumnConfigFailure,
  getTargetsColumnConfigRequest,
  getTargetsColumnConfigSuccess,
  getTargetsFailure,
  getTargetsRequest,
  postTargetsMappingFailure,
  postTargetsMappingRequest,
  postTargetsMappingSuccess,
  updateTargetColumnConfigFailure,
  updateTargetColumnConfigRequest,
  updateTargetColumnConfigSuccess,
  updateTargetsFailure,
  updateTargetsRequest,
  updateTargetsSuccess,
} from "./targetSlice";
import { update } from "cypress/types/lodash";

export const postTargetsMapping = createAsyncThunk(
  "targets/postTargetsMapping",
  async (
    {
      targetMappingData,
      formUID,
    }: {
      targetMappingData: TargetMapping;
      formUID: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postTargetsMappingRequest());
      const response: any = await api.uploadTargetsMapping(
        targetMappingData,
        formUID
      );
      if (response.status == 200) {
        dispatch(postTargetsMappingSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to upload target mapping.",
        success: false,
      };
      dispatch(postTargetsMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to upload target mapping.";
      dispatch(postTargetsMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getTargets = createAsyncThunk(
  "targets/getTargets",
  async (
    {
      formUID,
    }: {
      formUID: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getTargetsRequest());
      const response: any = await api.fetchTargets(formUID);
      if (response.status == 200) {
        dispatch(getTargetsRequest(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch targets.",
        success: false,
      };
      dispatch(getTargetsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch targets list.";
      dispatch(getTargetsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getTargetDetails = createAsyncThunk(
  "targets/getTargetDetails",
  async (
    {
      targetUID,
    }: {
      targetUID: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getTargetDetailsRequest());
      const response: any = await api.getTarget(targetUID);
      if (response.status == 200) {
        dispatch(getTargetDetailsSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch targets details.",
        success: false,
      };
      dispatch(getTargetDetailsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch target details.";
      dispatch(getTargetDetailsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTarget = createAsyncThunk(
  "targets/updateTarget",
  async (
    {
      targetUID,
      targetData,
    }: {
      targetUID: string;
      targetData: any;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateTargetsRequest());
      const response: any = await api.updateTarget(targetUID, targetData);
      if (response.status == 200) {
        dispatch(updateTargetsSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update target.",
        success: false,
      };
      dispatch(updateTargetsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update target.";
      dispatch(updateTargetsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const bulkUpdateTargets = createAsyncThunk(
  "targets/bulkUpdateTargets",
  async (
    {
      targetsUIDs,
      formUID,
      patchKeys,
    }: {
      targetsUIDs: string[];
      formUID: string;
      patchKeys: any;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(bulkUpdateTargetsRequest());
      const response: any = await api.bulkUpdateTargets(
        targetsUIDs,
        formUID,
        patchKeys
      );
      if (response.status == 200) {
        dispatch(bulkUpdateTargetsSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to bulk update targets.",
        success: false,
      };
      dispatch(bulkUpdateTargetsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to bulk update targets.";
      dispatch(bulkUpdateTargetsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getTargetsColumnConfig = createAsyncThunk(
  "targets/getTargetsColumnConfig",
  async (
    {
      formUID,
    }: {
      formUID: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getTargetsColumnConfigRequest());
      const response: any = await api.fetchTargetsColumnConfig(formUID);
      if (response.status == 200) {
        dispatch(getTargetsColumnConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to get targets column config.",
        success: false,
      };
      dispatch(getTargetsColumnConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to get targets column config.";
      dispatch(getTargetsColumnConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTargetsColumnConfig = createAsyncThunk(
  "targets/updateTargetsColumnConfig",
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
      dispatch(updateTargetColumnConfigRequest());
      const response: any = await api.updateTargetsColumnConfig(
        formUID,
        columnConfig
      );
      if (response.status == 200) {
        dispatch(updateTargetColumnConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update targets column config.",
        success: false,
      };
      dispatch(updateTargetColumnConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update targets column config.";
      dispatch(updateTargetColumnConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const enumeratorsActions = {
  postTargetsMapping,
  updateTargetsColumnConfig,
  getTargetsColumnConfig,
  bulkUpdateTargets,
  updateTarget,
  getTargets,
};
