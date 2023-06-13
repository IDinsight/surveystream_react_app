import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  fetchSurveyConfigRequest,
  fetchSurveysConfigSuccess,
  fetchSurveysConfigFailure,
  postSurveyBasicInformationRequest,
  postSurveyBasicInformationSuccess,
  postSurveyBasicInformationFailure,
  fetchSurveyBasicInformationRequest,
  fetchSurveyBasicInformationSuccess,
  fetchSurveyBasicInformationFailure,
  putSurveyBasicInformationRequest,
  fetchSurveyModuleQuestionnaireRequest,
  fetchSurveyModuleQuestionnaireSuccess,
  fetchSurveyModuleQuestionnaireFailure,
  putSurveyModuleQuestionnaireRequest,
  putSurveyModuleQuestionnaireSuccess,
  putSurveyModuleQuestionnaireFailure,
  putSurveyBasicInformationSuccess,
  putSurveyBasicInformationFailure,
} from "./surveyConfigSlice";
import { SurveyBasicInformationData, SurveyModuleQuestionnaire } from "./types";
import { surveyConfigs } from "./surveyConfigsInit";

export const getSurveyConfig = createAsyncThunk(
  "surveyConfig/getSupervisorRoles",
  async (params: { survey_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSurveyConfigRequest());
      const surveyConfig = await api.fetchSurveysConfig(params.survey_uid);

      if (surveyConfig.data && surveyConfig.success) {
        delete surveyConfig.data.overall_status;

        // Filter and transform config
        const transformedConfigs = Object.entries(surveyConfigs).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value)) {
              const transformedModules = value.map((module) => {
                const matchingModule = surveyConfig.data[key]?.find(
                  (dataModule: { name: any }) => dataModule.name === module.name
                );

                if (matchingModule) {
                  return {
                    ...module,
                    status: matchingModule.status,
                  };
                } else {
                  return module;
                }
              });
              return { ...acc, [key]: transformedModules };
            } else {
              const matchingValue = surveyConfig.data[key];

              if (matchingValue) {
                return {
                  ...acc,
                  [key]: { ...value, status: matchingValue.status },
                };
              } else {
                return { ...acc, [key]: value };
              }
            }
          },
          {}
        );

        dispatch(fetchSurveysConfigSuccess(transformedConfigs));
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

export const getSurveyModuleQuestionnaire = createAsyncThunk(
  "surveyConfig/getSurveyModuleQuestionnaire",
  async (params: { survey_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSurveyModuleQuestionnaireRequest());
      const moduleQuestionnaireRes = await api.fetchSurveysConfig(
        params.survey_uid
      );

      if (moduleQuestionnaireRes.data && moduleQuestionnaireRes.success) {
        dispatch(
          fetchSurveyModuleQuestionnaireSuccess(
            moduleQuestionnaireRes.data.data
          )
        );
        return moduleQuestionnaireRes.data;
      }

      const error = {
        ...moduleQuestionnaireRes.response.data,
        code: moduleQuestionnaireRes.response.status,
        status: false,
      };
      dispatch(fetchSurveyModuleQuestionnaireFailure(error));
      return moduleQuestionnaireRes.response.data;
    } catch (error) {
      const errorMessage =
        error || "Failed to fetch survey module questionnaire";
      dispatch(fetchSurveysConfigFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSurveyBasicInformation = createAsyncThunk(
  "surveyConfig/getSurveyBasicInformation",
  async (params: { survey_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSurveyBasicInformationRequest());
      const basicRes: any = await api.fetchSurveyBasicInformation(
        params.survey_uid
      );
      if (basicRes.status == 200) {
        dispatch(fetchSurveyBasicInformationSuccess(basicRes.data));
        return basicRes.data;
      }

      const error = {
        message: basicRes.message
          ? basicRes.message
          : "Failed to fetch survey basic information.",
        code: basicRes.response?.status
          ? basicRes.response?.status
          : basicRes.code,
        success: false,
      };
      dispatch(fetchSurveyBasicInformationFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch survey basic information.";
      dispatch(fetchSurveyBasicInformationFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateSurveyModuleQuestionnaire = createAsyncThunk(
  "surveyConfig/updateSurveyModuleQuestionnaire",
  async (
    {
      moduleQuestionnaireData,
      surveyUid,
    }: {
      moduleQuestionnaireData: SurveyModuleQuestionnaire;
      surveyUid?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(putSurveyModuleQuestionnaireRequest());
      const response: any = await api.postSurveyModuleQuestionnaire(
        moduleQuestionnaireData,
        surveyUid
      );
      if (response.data && response.success) {
        dispatch(putSurveyModuleQuestionnaireSuccess(response.data));
        return response;
      }
      const error = {
        ...response.response.data,
        code: response.response.status,
      };
      dispatch(putSurveyModuleQuestionnaireFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update survey";
      dispatch(putSurveyModuleQuestionnaireFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBasicInformation = createAsyncThunk(
  "surveyConfig/updateBasicInformation",

  async (
    {
      basicInformationData,
      surveyUid,
    }: { basicInformationData: SurveyBasicInformationData; surveyUid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(putSurveyBasicInformationRequest());
      const response = await api.updateSurveyBasicInformation(
        basicInformationData,
        surveyUid
      );

      console.log("updateBasicInformation", response);

      if (response.status == 200) {
        dispatch(putSurveyBasicInformationSuccess(response.data));
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

      dispatch(putSurveyBasicInformationFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update survey";
      dispatch(putSurveyBasicInformationFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const postBasicInformation = createAsyncThunk(
  "surveyConfig/postBasicInformation",
  async (
    basicInformationData: SurveyBasicInformationData,
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postSurveyBasicInformationRequest());
      const response = await api.postSurveyBasicInformation(
        basicInformationData
      );

      if (response?.status == 201) {
        dispatch(postSurveyBasicInformationSuccess(response.data.data.survey));
        return { ...response.data.data, success: true };
      }
      const error = {
        message: response.message
          ? response.message
          : "Failed to create new survey, kindly check your inputs and try again.",

        code: response.response?.status
          ? response.response?.status
          : response.code,
        success: false,
      };

      dispatch(postSurveyBasicInformationFailure(error));
      return error;
    } catch (error) {
      const errorMessage =
        error ||
        "Failed to create new survey, kindly check your inputs and try again.";
      dispatch(postSurveyBasicInformationFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const surveyConfigActions = {
  getSurveyConfig,
  postBasicInformation,
  updateBasicInformation,
  getSurveyBasicInformation,
  getSurveyModuleQuestionnaire,
  updateSurveyModuleQuestionnaire,
};
