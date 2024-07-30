import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  tableConfigRequest,
  tableConfigSuccess,
  tableConfigFailure,
  updateTableConfigRequest,
  updateTableConfigSuccess,
  updateTableConfigFailure,
} from "./tableConfigSlice";

import { fetchTableConfig, putTableConfig } from "./apiService";

export const getTableConfig = createAsyncThunk(
  "tableConfig/getTableConfig",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(tableConfigRequest());
      const response: any = await fetchTableConfig(formUID);
      if (response.status == 200) {
        dispatch(tableConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch table config.",
        success: false,
      };
      dispatch(tableConfigFailure(error.message));
      return error;
    } catch (error: any) {
      const errorMessage = error || "Failed to fetch table config.";
      dispatch(tableConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTableConfig = createAsyncThunk(
  "tableConfig/updateTableConfig",
  async (
    {
      formUID,
      tableName,
      tableConfig,
    }: { formUID: string; tableName: string; tableConfig: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateTableConfigRequest());
      const response: any = await putTableConfig(
        formUID,
        tableName,
        tableConfig
      );
      if (response.status == 200) {
        dispatch(updateTableConfigSuccess(response.data));
        return { ...response, success: true };
      }

      if (response?.response?.data?.success === false) {
        const error = {
          message: response?.response?.data?.error?.message
            ? response?.response?.data?.error?.message
            : "Failed to update assignment table config.",
          success: false,
        };
        dispatch(updateTableConfigFailure());
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update assignment table config.",
        success: false,
      };
      dispatch(updateTableConfigFailure());
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update assignment table config.";
      dispatch(updateTableConfigFailure());
      return rejectWithValue(errorMessage);
    }
  }
);
