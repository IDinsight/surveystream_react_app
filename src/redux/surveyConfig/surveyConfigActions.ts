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
  putSurveyStateRequest,
  putSurveyStateSuccess,
  putSurveyStateFailure,
  fetchSurveyModulesRequest,
  fetchSurveyModulesSuccess,
  fetchSurveyModulesFailure,
} from "./surveyConfigSlice";
import {
  SurveyBasicInformationData,
  SurveyModuleQuestionnaireData,
} from "./types";
import { surveyConfigs as surveyConfigsInit } from "./surveyConfigsInit";
import { moduleDescriptions } from "../moduleSelection/moduleDescriptions";

export const getSurveyConfig = createAsyncThunk(
  "surveyConfig/getSupervisorRoles",
  async (params: { survey_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSurveyConfigRequest());
      const surveyConfig = await api.fetchSurveysConfig(params.survey_uid);

      if (surveyConfig.data && surveyConfig.success) {
        delete surveyConfig.data.overall_status;

        const completionStats = surveyConfig.data.completion_stats;
        delete surveyConfig.data.completionStats;

        // Filter and transform config
        const transformedConfigs = Object.entries(surveyConfigsInit).reduce(
          (acc, [key, value]) => {
            if (Array.isArray(value)) {
              const transformedModules = value
                .filter((module) =>
                  surveyConfig.data[key]?.find(
                    (dataModule: { name: any }) =>
                      dataModule.name === module.name
                  )
                )
                .map((module) => {
                  const matchingModule = surveyConfig.data[key]?.find(
                    (dataModule: { name: any }) =>
                      dataModule.name === module.name
                  );

                  if (matchingModule) {
                    return {
                      ...module,
                      status: matchingModule.status,
                      optional: matchingModule.optional,
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
                  [key]: {
                    ...value,
                    status: matchingValue.status,
                    optional: matchingValue.optional,
                  },
                };
              } else {
                return { ...acc, [key]: value };
              }
            }
          },
          {}
        );
        let transformedModules: any = [];
        if (
          surveyConfig?.data["Module Configuration"] &&
          surveyConfig?.data["Module Configuration"].length > 0
        ) {
          // Filter and transform modules
          const moduleIds = surveyConfig?.data["Module Configuration"].map(
            (module: any) => module.module_id
          );
          const moduleNames = surveyConfig?.data["Module Configuration"].map(
            (module: any) => module.name
          );
          const moduleStatus = surveyConfig?.data["Module Configuration"].map(
            (module: any) => module.status
          );
          const moduleOptional = surveyConfig?.data["Module Configuration"].map(
            (module: any) => module.optional
          );

          transformedModules = moduleDescriptions
            .filter((module) => moduleIds.includes(module.module_id))
            .map((module) => {
              const index = moduleIds.indexOf(module.module_id);
              return {
                module_id: moduleIds[index],
                name: moduleNames[index],
                status: moduleStatus[index],
                optional: moduleOptional[index],
              };
            });
        }

        dispatch(
          fetchSurveysConfigSuccess({
            surveyConfigs: {
              ...transformedConfigs,
              "Module Configuration": transformedModules,
            },
            completionStats: completionStats,
          })
        );
        return {
          ...transformedConfigs,
          "Module Configuration": transformedModules,
          success: true,
        };
      }

      const error = {
        success: false,
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
      const moduleQuestionnaireRes: any =
        await api.fetchSurveyModuleQuestionnaire(params.survey_uid);
      if (moduleQuestionnaireRes.status == 200) {
        dispatch(
          fetchSurveyModuleQuestionnaireSuccess(
            moduleQuestionnaireRes.data.data
          )
        );
        return moduleQuestionnaireRes.data;
      }

      const error = {
        message: moduleQuestionnaireRes.message
          ? moduleQuestionnaireRes.message
          : "Failed to fetch survey module questionnaire.",
        code: moduleQuestionnaireRes.response?.status
          ? moduleQuestionnaireRes.response?.status
          : moduleQuestionnaireRes.code,
        success: false,
      };
      dispatch(fetchSurveyModuleQuestionnaireFailure(error));
      return moduleQuestionnaireRes.response.data;
    } catch (error) {
      const errorMessage =
        error || "Failed to fetch survey module questionnaire.";
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
      moduleQuestionnaireData: SurveyModuleQuestionnaireData;
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

      if (response.status == 200) {
        dispatch(putSurveyModuleQuestionnaireSuccess(response.data));
        return { ...response.data, success: true };
      }
      const error = {
        message: response.message
          ? response.message
          : "Failed to update module questionnaire, kindly check your inputs and try again.",
        code: response.response?.status
          ? response.response?.status
          : response.code,
        success: false,
      };

      dispatch(putSurveyModuleQuestionnaireFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update module questionnaire";
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
    }: { basicInformationData: any; surveyUid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(putSurveyBasicInformationRequest());
      const response = await api.updateSurveyBasicInformation(
        basicInformationData,
        surveyUid
      );

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

export const putSurveyState = createAsyncThunk(
  "surveyConfig/updateSurveyState",
  async ({ survey_uid, state }: any, { dispatch }) => {
    try {
      dispatch(putSurveyStateRequest());
      const response = await api.updateSurveyState(survey_uid, state);

      if (response.status == 200) {
        dispatch(putSurveyStateSuccess(response.data));
        return { ...response.data, success: true };
      }

      const error = {
        message: response.response?.data?.error
          ? response.response?.data?.error
          : "Failed to update the survey state.",
        code: response.response?.status
          ? response.response?.status
          : response.code,
        success: false,
      };
      dispatch(putSurveyStateFailure(error));
      return error;
    } catch (error: any) {
      return { success: false };
    }
  }
);

export const getSurveyModules = createAsyncThunk(
  "surveyConfig/getSurveyModules",
  async (params: { survey_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSurveyModulesRequest());
      const surveyModules: any = await api.fetchSurveyModules(
        params.survey_uid
      );
      if (surveyModules.status == 200) {
        dispatch(fetchSurveyModulesSuccess(surveyModules.data));
        return surveyModules.data;
      }

      const error = {
        message: surveyModules.message
          ? surveyModules.message
          : "Failed to fetch survey modules.",
        code: surveyModules.response?.status
          ? surveyModules.response?.status
          : surveyModules.code,
        success: false,
      };
      dispatch(fetchSurveyModulesFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch survey modules.";
      dispatch(fetchSurveyModulesFailure(errorMessage as string));
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
  getSurveyModules,
};
