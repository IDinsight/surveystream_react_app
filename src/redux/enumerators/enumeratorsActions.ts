import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { EnumeratorMapping } from "./types";
import {
  postEnumeratorsMappingFailure,
  postEnumeratorsMappingRequest,
  postEnumeratorsMappingSuccess,
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

export const enumeratorsActions = {
  postEnumeratorsMapping,
};
