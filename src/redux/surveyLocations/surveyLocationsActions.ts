import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { GeoLevel, GeoLevelMapping } from "./types";
import {
  getSurveyLocationGeoLevelsFailure,
  getSurveyLocationGeoLevelsRequest,
  getSurveyLocationGeoLevelsSuccess,
  getSurveyLocationRequest,
  getSurveyLocationsFailure,
  getSurveyLocationsSuccess,
  getSurveyLocationsLongRequest,
  getSurveyLocationsLongSuccess,
  getSurveyLocationsLongFailure,
  postSurveyLocationGeoLevelsFailure,
  postSurveyLocationGeoLevelsRequest,
  postSurveyLocationGeoLevelsSuccess,
  postSurveyLocationsFailure,
  postSurveyLocationsRequest,
  postSurveyLocationsSuccess,
  putSurveyPrimeGeoLevelRequest,
  putSurveyPrimeGeoLevelRequestSuccess,
  putSurveyPrimeGeoLevelRequestFailure,
  updateLocationFailure,
  updateLocationRequest,
  updateLocationSuccess,
} from "./surveyLocationsSlice";
import { putSurveyBasicInformationFailure } from "../surveyConfig/surveyConfigSlice";

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
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update survey locations.",
        success: false,
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

export const updateSurveyPrimeGeoLocation = createAsyncThunk(
  "surveyLocations/updateSurveyPrimeGeoLocation",

  async (
    { payload, surveyUid }: { payload: any; surveyUid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(putSurveyPrimeGeoLevelRequest());
      const response: any = await api.updateSurveyPrimeGeoLocation(
        payload,
        surveyUid
      );

      if (response.status == 200) {
        dispatch(putSurveyPrimeGeoLevelRequestSuccess(response.data));
        return { ...response.data, success: true };
      }

      const error = {
        message: response.message
          ? response.message
          : "Failed to update survey, kindly check your inputs and try again.",
        code: response.response?.status
          ? response.response?.status
          : response.code,
        success: false,
      };

      dispatch(putSurveyPrimeGeoLevelRequestFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update survey";
      dispatch(putSurveyBasicInformationFailure(errorMessage));
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

export const getSurveyLocationsLong = createAsyncThunk(
  "surveyLocations/getSurveyLocationsLong",
  async (
    params: {
      survey_uid: string;
      geo_level_uid: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getSurveyLocationsLongRequest());
      const res: any = await api.getSurveyLocationsLong(
        params.survey_uid,
        params.geo_level_uid
      );

      if (res.status === 200) {
        dispatch(getSurveyLocationsLongSuccess(res.data.data));
        return res.data.data;
      }
      const error = {
        ...res.response.data,
        code: res.response.status,
        message: "Failed to get survey locations in long format",
      };
      dispatch(getSurveyLocationsLongFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage =
        error || "Failed to get survey locations in long format";
      dispatch(getSurveyLocationsLongFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateLocation = createAsyncThunk(
  "surveyLocations/updateLocation",
  async (
    { formData, locationUid }: { formData: any; locationUid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateLocationRequest());
      const response: any = await api.updateLocation(formData, locationUid);

      if (response.status == 200) {
        dispatch(updateLocationSuccess(response.data));
        return { ...response.data, success: true };
      }

      const error = {
        message: response.message
          ? response.message
          : "Failed to update location",
        success: false,
      };

      dispatch(updateLocationFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update location";
      dispatch(updateLocationFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const fieldSupervisorRolesActions = {
  getSurveyLocationGeoLevels,
  getSurveyLocations,
  postSurveyLocationGeoLevels,
  postSurveyLocations,
  updateSurveyPrimeGeoLocation,
  updateLocation,
};
