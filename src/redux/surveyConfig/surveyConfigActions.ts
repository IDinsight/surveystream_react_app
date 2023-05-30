import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  postSurveyBasicInformationRequest,
  postSurveyBasicInformationSuccess,
  postSurveyBasicInformationFailure,
} from "./surveyConfigSlice";
import { SurveyBasicInformationData } from "./types";

export const postBasicInformation = createAsyncThunk(
  "survey/postBasicInformation",
  async (
    basicInformationData: SurveyBasicInformationData,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postSurveyBasicInformationRequest());
      const response = await api.postSurveyBasicInformation(
        basicInformationData
      );
      if (response.data && response.success) {
        dispatch(postSurveyBasicInformationSuccess(response.data));
        return response;
      }
      const error = {
        ...response.response.data,
        code: response.response.status,
      };
      dispatch(postSurveyBasicInformationFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to post new survey";
      dispatch(postSurveyBasicInformationFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const surveyConfigActions = {
  postBasicInformation,
};
