import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchSurveysRequest,
  fetchSurveysSuccess,
  fetchSurveysFailure,
} from "./surveysSlice";
import * as api from "./apiService";

export const fetchSurveys = createAsyncThunk(
  "survey/fetchSurveys",
  async (params: { user_uid?: number }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSurveysRequest());
      const surveys = await api.fetchSurveys(params.user_uid);
      if (surveys.data && surveys.success) {
        dispatch(fetchSurveysSuccess(surveys.data));
        return surveys.data;
      }
      const error = { ...surveys.response.data, code: surveys.response.status };
      dispatch(fetchSurveysFailure(error));
      return surveys.response.data;
    } catch (error) {
      console.log("rrror", error);

      const errorMessage = error || "Failed to fetch surveys";
      dispatch(fetchSurveysFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const surveyActions = {
  fetchSurveys,
};
