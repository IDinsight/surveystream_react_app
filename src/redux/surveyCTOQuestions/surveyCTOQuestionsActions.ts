import { compose, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { SurveyCTOQuestionsForm } from "./types";
import {
  getFormMappingRequest,
  getFormMappingSuccess,
  getFormQuestionsDefinitionFailure,
  getFormQuestionsDefinitionRequest,
  getFormQuestionsDefinitionSuccess,
  postFormMappingFailure,
  postFormMappingRequest,
  postFormMappingSuccess,
  putFormMappingFailure,
  putFormMappingRequest,
  putFormMappingSuccess,
} from "./surveyCTOQuestionsSlice";
import { getSurveyCTOFormFailure } from "../surveyCTOInformation/surveyCTOInformationSlice";

export const postSCTOFormMapping = createAsyncThunk(
  "surveyCTOQuestions/postSCTOFormMapping",
  async (
    {
      ctoFormMappingData,
      formUid,
    }: { ctoFormMappingData: SurveyCTOQuestionsForm; formUid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postFormMappingRequest());
      const response = await api.createSurveyCTOFormMapping(
        ctoFormMappingData,
        formUid
      );

      if (response.status == 201) {
        dispatch(postFormMappingSuccess(response.data));
        return response;
      }

      const error = {
        message: response.message,
        success: false,
      };
      dispatch(postFormMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to create surveyCTO form mapping";
      dispatch(postFormMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const putSCTOFormMapping = createAsyncThunk(
  "surveyCTOQuestions/putSCTOFormMapping",
  async (
    {
      ctoFormMappingData,
      formUid,
    }: { ctoFormMappingData: SurveyCTOQuestionsForm; formUid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(putFormMappingRequest());
      const response = await api.updateSurveyCTOFormMapping(
        ctoFormMappingData,
        formUid
      );
      if (response.status == 200) {
        dispatch(putFormMappingSuccess(response.data));
        return response;
      }

      const error = {
        message: response.message,
        success: false,
      };
      dispatch(putFormMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update surveyCTO form mapping";
      dispatch(putFormMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSCTOFormMapping = createAsyncThunk(
  "surveyCTOQuestions/getSCTOFormMapping",
  async (params: { formUid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getFormMappingRequest());
      const res: any = await api.getSurveyCTOFormMapping(params.formUid);

      if (res.status === 200) {
        dispatch(getFormMappingSuccess(res.data.data));
        return res.data.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(getSurveyCTOFormFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get surveyCTO form mapping";
      dispatch(getSurveyCTOFormFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getCTOFormQuestions = createAsyncThunk(
  "surveyCTOQuestions/getCTOFormQuestions",
  async ({ formUid, refresh = false }: { formUid: string, refresh?: boolean }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getFormQuestionsDefinitionRequest());
      const res: any = await api.getSurveyCTOFormDefinition(formUid, refresh);

      if (res.status === 200) {
        dispatch(getFormQuestionsDefinitionSuccess(res.data.data));
        return res.data.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(getFormQuestionsDefinitionFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get surveyCTO form questions";
      dispatch(getFormQuestionsDefinitionFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const surveyCTOQuestionsActions = {
  getCTOFormQuestions,
  getSCTOFormMapping,
  postSCTOFormMapping,
  putSCTOFormMapping,
};
