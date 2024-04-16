import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  tableConfigRequest,
  tableConfigSuccess,
  tableConfigFailure,
} from "./tableConfigSlice";

import { fetchTableConfig } from "./apiService";

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
