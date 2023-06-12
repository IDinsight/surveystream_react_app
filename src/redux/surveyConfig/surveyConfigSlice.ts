import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  surveyConfigs: {
    "Basic Information": {
      status: "Not Started",
    },
    "Module Selection": {
      status: "Not Started",
    },
    "Survey Information": [
      {
        name: "SurveyCTO information",
        status: "Not Started",
      },
      { name: "Field supervisor roles", status: "Not Started" },
      {
        name: "Survey locations",
        status: "Not Started",
      },
      {
        name: "SurveyStream users",
        status: "Not Started",
      },
      {
        name: "Enumerators",
        status: "Not Started",
      },
      {
        name: "Targets",
        status: "Not Started",
      },
    ],
    "Module Configuration": [
      {
        module_id: 1,
        name: "Assignments",
        status: "Not Started",
      },
      {
        module_id: 2,
        name: "Productivity tracker",
        status: "Not Started",
      },
      {
        module_id: 3,
        name: "Data quality",
        status: "Not Started",
      },
    ],
  },
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
