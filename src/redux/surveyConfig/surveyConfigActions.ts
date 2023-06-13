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

                console.log("ArraymatchingValue", matchingModule);

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

              console.log("matchingValue", matchingValue);

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
  getSurveyConfig,
  postBasicInformation,
};
