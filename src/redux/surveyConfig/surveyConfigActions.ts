import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  fetchSurveyConfigRequest,
  fetchSurveysConfigSuccess,
  fetchSurveysConfigFailure,
  postSurveyBasicInformationRequest,
  postSurveyBasicInformationSuccess,
  postSurveyBasicInformationFailure,
} from "./surveyConfigSlice";
import { SurveyBasicInformationData } from "./types";

export const fetchSurveyConfig = createAsyncThunk(
  "survey/fetchSurveyConfig",
  async (params: { survey_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSurveyConfigRequest(params.survey_uid));
      const surveyConfig = await api.fetchSurveysConfig(params.survey_uid);
      if (surveyConfig.data && surveyConfig.success) {
        dispatch(fetchSurveysConfigSuccess(surveyConfig.data));
        return surveyConfig.data;
      }
      const error = {
        ...surveyConfig.response.data,
        code: surveyConfig.response.status,
      };
      dispatch(fetchSurveysConfigFailure(error));
      return surveyConfig.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to fetch survey configuration";
      dispatch(fetchSurveysConfigFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

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
  fetchSurveyConfig,
  postBasicInformation,
};
