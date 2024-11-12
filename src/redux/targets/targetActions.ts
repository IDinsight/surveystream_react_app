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
  getTargetsSuccess,
  postTargetsMappingFailure,
  postTargetsMappingRequest,
  postTargetsMappingSuccess,
  updateTargetColumnConfigFailure,
  updateTargetColumnConfigRequest,
  updateTargetColumnConfigSuccess,
  updateTargetsFailure,
  updateTargetsRequest,
  updateTargetsSuccess,
  getTargetsConfigRequest,
  getTargetsConfigSuccess,
  getTargetsConfigFailure,
  postTargetConfigRequest,
  postTargetConfigSuccess,
  postTargetConfigFailure,
  putTargetConfigRequest,
  putTargetConfigSuccess,
  putTargetConfigFailure,
  getTargetSCTOColumnsRequest,
  getTargetSCTOColumnsSuccess,
  getTargetSCTOColumnsFailure,
  updateTargetSCTOColumnsRequest,
  updateTargetSCTOColumnsSuccess,
  updateTargetSCTOColumnsFailure,
} from "./targetSlice";

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
        dispatch(getTargetsSuccess(response.data));
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
      targetsUIDs: any[];
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

export const getTargetConfig = createAsyncThunk(
  "targets/getTargetsConfig",
  async (
    {
      form_uid,
    }: {
      form_uid: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getTargetsConfigRequest());
      const response: any = await api.getTargetConfig(form_uid);
      if (response.status == 200) {
        dispatch(getTargetsConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to get targets config.",
        success: false,
      };
      dispatch(getTargetsConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to get targets config.";
      dispatch(getTargetsConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const postTargetConfig = createAsyncThunk(
  "targets/postTargetConfig",
  async (
    {
      form_uid,
      target_source,
      scto_input_type,
      scto_input_id,
      scto_encryption_flag,
    }: {
      form_uid: string;
      target_source: string;
      scto_input_type: string;
      scto_input_id: string;
      scto_encryption_flag: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postTargetConfigRequest());
      const response: any = await api.postTargetConfig(
        form_uid,
        target_source,
        scto_input_type,
        scto_input_id,
        scto_encryption_flag
      );
      if (response.status == 200) {
        dispatch(postTargetConfigSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to post target config.",
        success: false,
      };
      dispatch(postTargetConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to post target config.";
      dispatch(postTargetConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const putTargetConfig = createAsyncThunk(
  "targets/putTargetConfig",
  async (
    {
      form_uid,
      target_source,
      scto_input_type,
      scto_input_id,
      scto_encryption_flag,
    }: {
      form_uid: string;
      target_source: string;
      scto_input_type: string;
      scto_input_id: string;
      scto_encryption_flag: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(putTargetConfigRequest());
      const response: any = await api.putTargetConfig(
        form_uid,
        target_source,
        scto_input_type,
        scto_input_id,
        scto_encryption_flag
      );
      if (response.status == 200) {
        dispatch(putTargetConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to put target config.",
        success: false,
      };
      dispatch(putTargetConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to put target config.";
      dispatch(putTargetConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getTargetSCTOColumns = createAsyncThunk(
  "targets/getTargetSCTOColumns",
  async (
    {
      form_uid,
    }: {
      form_uid: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getTargetSCTOColumnsRequest());
      const response: any = await api.getTargetSCTOColumns(form_uid);
      if (response.status == 200) {
        dispatch(getTargetSCTOColumnsSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to get target SCTO columns.",
        success: false,
      };
      dispatch(getTargetSCTOColumnsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to get target SCTO columns.";
      dispatch(getTargetSCTOColumnsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTargetSCTOColumns = createAsyncThunk(
  "targets/updateTargetSCTOColumns",
  async (
    {
      form_uid,
    }: {
      form_uid: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateTargetSCTOColumnsRequest());
      const response: any = await api.updateTargetSCTOColumns(form_uid);
      if (response.status == 200) {
        dispatch(updateTargetSCTOColumnsSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update target SCTO columns.",
        success: false,
      };
      dispatch(updateTargetSCTOColumnsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update target SCTO columns.";
      dispatch(updateTargetSCTOColumnsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const targetActions = {
  postTargetsMapping,
  updateTargetsColumnConfig,
  getTargetsColumnConfig,
  bulkUpdateTargets,
  updateTarget,
  getTargets,
  getTargetDetails,
  getTargetConfig,
  postTargetConfig,
  putTargetConfig,
  getTargetSCTOColumns,
  updateTargetSCTOColumns,
};
