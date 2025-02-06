import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { surveyConfigs, completionStats } from "./surveyConfigsInit";

interface SurveyConfigState {
  loading: boolean;
  error: any;
  basicInfo: any;
  moduleQuestionnaire: any;
  completionStats: any;
  errorModules: any;
  surveyConfigs:
    | {
        [key: string]: any;
      }
    | Record<string, unknown[]>;
}

const initialState: SurveyConfigState = {
  loading: false,
  error: null,
  basicInfo: null,
  surveyConfigs: surveyConfigs,
  completionStats: completionStats,
  moduleQuestionnaire: null,
  errorModules: null,
};

const surveyConfigSlice = createSlice({
  name: "surveyConfig",
  initialState,
  reducers: {
    clearModuleQuestionnaire: (state) => {
      state.moduleQuestionnaire = null;
    },
    clearBasicInfo: (state) => {
      state.basicInfo = null;
    },
    fetchSurveyConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSurveysConfigSuccess: (
      state: SurveyConfigState,
      action: PayloadAction<{
        surveyConfigs: any;
        completionStats: any;
      }>
    ) => {
      if (Object.keys(action.payload.surveyConfigs).length > 0) {
        state.surveyConfigs = action.payload.surveyConfigs;
      }
      state.completionStats = action.payload.completionStats;
      state.loading = false;
      state.error = null;
    },
    fetchSurveysConfigFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchSurveyBasicInformationRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSurveyBasicInformationSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.basicInfo = action.payload;
      state.error = null;
    },
    fetchSurveyBasicInformationFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.basicInfo = null;
      state.error = action.payload;
    },
    fetchSurveyModuleQuestionnaireRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSurveyModuleQuestionnaireSuccess: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.moduleQuestionnaire = action.payload;
      state.error = null;
    },
    fetchSurveyModuleQuestionnaireFailure: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.moduleQuestionnaire = null;
      state.error = action.payload;
    },
    putSurveyModuleQuestionnaireRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    putSurveyModuleQuestionnaireSuccess: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = null;
    },
    putSurveyModuleQuestionnaireFailure: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = action.payload;
    },
    putSurveyBasicInformationRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    putSurveyBasicInformationSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.basicInfo = action.payload;
      state.error = null;
    },
    putSurveyBasicInformationFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    postSurveyBasicInformationRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postSurveyBasicInformationSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.basicInfo = action.payload;
      state.error = null;
    },
    postSurveyBasicInformationFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    putSurveyStateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    putSurveyStateSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    putSurveyStateFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchSurveyErrorModulesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSurveyErrorModulesSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.errorModules = action.payload;
      state.error = null;
    },
    fetchSurveyErrorModulesFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.errorModules = null;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSurveyBasicInformationFailure,
  fetchSurveyBasicInformationRequest,
  fetchSurveyBasicInformationSuccess,
  fetchSurveyModuleQuestionnaireFailure,
  fetchSurveyModuleQuestionnaireRequest,
  fetchSurveyModuleQuestionnaireSuccess,
  putSurveyBasicInformationFailure,
  putSurveyBasicInformationRequest,
  putSurveyBasicInformationSuccess,
  putSurveyModuleQuestionnaireFailure,
  putSurveyModuleQuestionnaireRequest,
  putSurveyModuleQuestionnaireSuccess,
  fetchSurveyConfigRequest,
  fetchSurveysConfigSuccess,
  fetchSurveysConfigFailure,
  postSurveyBasicInformationRequest,
  postSurveyBasicInformationSuccess,
  postSurveyBasicInformationFailure,
  clearBasicInfo,
  clearModuleQuestionnaire,
  putSurveyStateRequest,
  putSurveyStateSuccess,
  putSurveyStateFailure,
  fetchSurveyErrorModulesRequest,
  fetchSurveyErrorModulesSuccess,
  fetchSurveyErrorModulesFailure,
} = surveyConfigSlice.actions;

export default surveyConfigSlice.reducer;
