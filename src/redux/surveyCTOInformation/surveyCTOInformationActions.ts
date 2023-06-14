import { compose, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  getSurveyCTOFormFailure,
  getSurveyCTOFormRequest,
  getSurveyCTOFormSuccess,
  getTimezonesFailure,
  getTimezonesRequest,
  getTimezonesSuccess,
  postSurveyCTOFormFailure,
  postSurveyCTOFormRequest,
  postSurveyCTOFormSuccess,
  putSurveyCTOFormFailure,
  putSurveyCTOFormRequest,
  putSurveyCTOFormSuccess,
} from "./surveyCTOInformationSlice";
import { SurveyCTOForm } from "./types";

export const postSurveyCTOForm = createAsyncThunk(
  "surveyCTOInformation/postSurveyCTOForm",
  async (
    {
      surveyCTOData,
      surveyUid,
    }: { surveyCTOData: SurveyCTOForm; surveyUid?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postSurveyCTOFormRequest());
      const response = await api.createSurveyCTOForm(surveyCTOData, surveyUid);

      if (response.status == 201) {
        dispatch(postSurveyCTOFormSuccess(response.data));
        return { ...response.data, success: true };
      }

      const error = {
        message: response.message
          ? response.message
          : "Failed to create surveyCTO form",
        success: false,
      };
      dispatch(postSurveyCTOFormFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to create surveyCTO form";
      dispatch(postSurveyCTOFormFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const putSurveyCTOForm = createAsyncThunk(
  "surveyCTOInformation/putSurveyCTOForm",
  async (
    {
      surveyCTOData,
      formUid,
    }: { surveyCTOData: SurveyCTOForm; formUid?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(putSurveyCTOFormRequest());
      const response = await api.updateSurveyCTOForm(surveyCTOData, formUid);
      if (response.status == 200) {
        dispatch(putSurveyCTOFormSuccess(response.data));
        return { ...response.data, success: true };
      }

      const error = {
        message: response.message
          ? response.message
          : "Failed to update surveyCTO form",
        success: false,
      };
      dispatch(putSurveyCTOFormFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update surveyCTO form";
      dispatch(putSurveyCTOFormFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSurveyCTOForm = createAsyncThunk(
  "surveyInformation/getSurveyCTOForm",
  async (params: { survey_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getSurveyCTOFormRequest());
      const res: any = await api.getSurveyCTOForms(params.survey_uid);

      if (res.status === 200) {
        dispatch(getSurveyCTOFormSuccess(res.data.data));
        return res.data.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(getSurveyCTOFormFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get surveyCTO form";
      dispatch(getSurveyCTOFormFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getTimezones = createAsyncThunk(
  "surveyInformation/getTimezones",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getTimezonesRequest());
      const res: any = await api.getTimezones();

      if (res.status === 200) {
        dispatch(getTimezonesSuccess(res.data.data));
        return res.data.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(getTimezonesFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get timezones";
      dispatch(getTimezonesFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const surveyCTOInformationActions = {
  getTimezones,
  getSurveyCTOForm,
  postSurveyCTOForm,
  putSurveyCTOForm,
};
