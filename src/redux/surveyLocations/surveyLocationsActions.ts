import { compose, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { GeoLevel, GeoLevelMapping } from "./types";
import {
  getSurveyLocationGeoLevelsFailure,
  getSurveyLocationGeoLevelsRequest,
  getSurveyLocationGeoLevelsSuccess,
  getSurveyLocationRequest,
  getSurveyLocationsFailure,
  getSurveyLocationsSuccess,
  postSurveyLocationGeoLevelsFailure,
  postSurveyLocationGeoLevelsRequest,
  postSurveyLocationGeoLevelsSuccess,
  postSurveyLocationsFailure,
  postSurveyLocationsRequest,
  postSurveyLocationsSuccess,
} from "./surveyLocationsSlice";

export const postSurveyLocationGeoLevels = createAsyncThunk(
  "surveyLocations/postSurveyLocationGeoLevels",
  async (
    {
      geoLevelsData,
      surveyUid,
    }: { geoLevelsData: GeoLevel[]; surveyUid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postSurveyLocationGeoLevelsRequest());
      const response: any = await api.updateSurveyLocationGeoLevels(
        geoLevelsData,
        surveyUid
      );
      if (response.status == 200) {
        dispatch(postSurveyLocationGeoLevelsSuccess(response.data));
        return response;
      }

      const error = {
        message: response.message
          ? response.message
          : "Failed to update survey location geo levels.",
        status: false,
      };
      dispatch(postSurveyLocationGeoLevelsFailure(error));
      return error;
    } catch (error) {
      const errorMessage =
        error || "Failed to update survey location geo levels.";
      dispatch(postSurveyLocationGeoLevelsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSurveyLocationGeoLevels = createAsyncThunk(
  "surveyLocations/getSurveyLocationGeoLevels",
  async (params: { survey_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getSurveyLocationGeoLevelsRequest());
      const res: any = await api.getSurveyLocationGeoLevels(params.survey_uid);

      if (res.status === 200) {
        dispatch(getSurveyLocationGeoLevelsSuccess(res.data.data));
        return res.data.data;
      }
      const error = {
        ...res.response.data,
        code: res.response.status,
        message: "Failed to get survey location geo levels",
      };
      dispatch(getSurveyLocationGeoLevelsFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get survey location geo levels";
      dispatch(getSurveyLocationGeoLevelsFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const postSurveyLocations = createAsyncThunk(
  "surveyLocations/postSurveyLocations",
  async (
    {
      getLevelMappingData,
      csvFile,
      surveyUid,
    }: {
      getLevelMappingData: GeoLevelMapping[];
      csvFile: any;
      surveyUid: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postSurveyLocationsRequest());
      const response: any = await api.updateSurveyLocations(
        getLevelMappingData,
        csvFile,
        surveyUid
      );
      if (response.status == 200) {
        dispatch(postSurveyLocationsSuccess(response.data));
        return response;
      }

      const error = {
        message: response.message
          ? response.message
          : "Failed to update survey locations.",
        status: false,
      };
      dispatch(postSurveyLocationsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update survey locations.";
      dispatch(postSurveyLocationsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSurveyLocations = createAsyncThunk(
  "surveyLocations/getSurveyLocations",
  async (params: { survey_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getSurveyLocationRequest());
      const res: any = await api.getSurveyLocations(params.survey_uid);

      if (res.status === 200) {
        dispatch(getSurveyLocationsSuccess(res.data.data));
        return res.data.data;
      }
      const error = {
        ...res.response.data,
        code: res.response.status,
        message: "Failed to get survey locations",
      };
      dispatch(getSurveyLocationsFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get survey locations";
      dispatch(getSurveyLocationsFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fieldSupervisorRolesActions = {
  getSurveyLocationGeoLevels,
  getSurveyLocations,
  postSurveyLocationGeoLevels,
  postSurveyLocations,
};
