import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SurveyConfigState {
  loading: boolean;
  error: any;
  basicInfo: any;
  surveyUId: string;
  surveyConfigs: any;
}

const initialState: SurveyConfigState = {
  loading: false,
  error: null,
  basicInfo: null,
  surveyUId: "",
  surveyConfigs: null,
};

const surveyConfigSlice = createSlice({
  name: "surveyConfig",
  initialState,
  reducers: {
    fetchSurveyConfigRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
      state.surveyUId = action.payload;
    },
    fetchSurveysConfigSuccess: (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.surveyConfigs = action.payload;
      state.error = null;
    },
    fetchSurveysConfigFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.surveyConfigs = action.payload;
      state.surveyUId = "";
      state.error = null;
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
