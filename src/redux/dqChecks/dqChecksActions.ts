import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  getDQCheckTypesRequest,
  getDQCheckTypesSuccess,
  getDQCheckTypesFailure,
  getDQConfigRequest,
  getDQConfigSuccess,
  getDQConfigFailure,
  updateDQConfigRequest,
  updateDQConfigSuccess,
  updateDQConfigFailure,
} from "./dqChecksSlice";

export const getDQCheckTypes = createAsyncThunk(
  "dqChecks/getDQCheckTypes",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getDQCheckTypesRequest());
      const res: any = await api.fetchDQCheckTypes();

      if (res.status === 200) {
        dispatch(getDQCheckTypesSuccess(res.data.data));
        return res.data.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(getDQCheckTypesFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get DQ check types";
      dispatch(getDQCheckTypesFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getDQConfig = createAsyncThunk(
  "dqChecks/getDQConfig",
  async ({ form_uid }: { form_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getDQConfigRequest());
      const res: any = await api.fetchDQConfig(form_uid);

      if (res.status === 200) {
        dispatch(getDQConfigSuccess(res.data.data));
        return res.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(getDQConfigFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage =
        error || `Failed to get DQ config for form uid ${form_uid}`;
      dispatch(getDQConfigFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateDQConfig = createAsyncThunk(
  "dqChecks/updateDQConfig",
  async ({ data }: { data: any }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(updateDQConfigRequest());
      const response: any = await api.updateDQConfig(data);
      if (response.status == 200) {
        dispatch(updateDQConfigSuccess());
        return { ...response, success: true };
      }

      if (response?.response?.data?.success === false) {
        const error = {
          message: response?.response?.data?.error?.message
            ? response?.response?.data?.error?.message
            : "Failed to update dq config.",
          success: false,
        };
        dispatch(updateDQConfigFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update update dq config.",
        success: false,
      };
      dispatch(updateDQConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update update DQ config.";
      dispatch(updateDQConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const enumeratorsActions = {
  getDQCheckTypes,
  getDQConfig,
  updateDQConfig,
};
