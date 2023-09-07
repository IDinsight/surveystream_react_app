import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { surveyConfigs } from "./surveyConfigsInit";

interface SurveyConfigState {
  loading: boolean;
  error: any;
  basicInfo: any;
  moduleQuestionnaire: any;
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
  moduleQuestionnaire: null,
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
    fetchSurveysConfigSuccess: (state, action: PayloadAction<any>) => {
      if (Object.keys(action.payload).length > 0) {
        state.surveyConfigs = action.payload;
      }
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
} = surveyConfigSlice.actions;

export default surveyConfigSlice.reducer;
