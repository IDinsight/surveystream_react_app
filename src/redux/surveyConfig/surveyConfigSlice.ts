import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { surveyConfigs } from "./surveyConfigsInit";

interface SurveyConfigState {
  loading: boolean;
  error: any;
  basicInfo: any;
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
};

const surveyConfigSlice = createSlice({
  name: "surveyConfig",
  initialState,
  reducers: {
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
      state.basicInfo = null;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSurveyConfigRequest,
  fetchSurveysConfigSuccess,
  fetchSurveysConfigFailure,
  postSurveyBasicInformationRequest,
  postSurveyBasicInformationSuccess,
  postSurveyBasicInformationFailure,
} = surveyConfigSlice.actions;

export default surveyConfigSlice.reducer;
