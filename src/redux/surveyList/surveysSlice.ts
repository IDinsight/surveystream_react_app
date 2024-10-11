import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Survey } from "./types";

interface SurveyState {
  loading: boolean;
  error: any;
  surveys: Survey[];
  activeSurvey: any;
}

const initialState: SurveyState = {
  loading: true,
  error: null,
  surveys: [],
  activeSurvey: null,
};

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {
    setActiveSurvey: (state, action: PayloadAction<any>) => {
      state.activeSurvey = action.payload;
    },
    fetchSurveysRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSurveysSuccess: (state, action: PayloadAction<Survey[]>) => {
      state.loading = false;
      state.surveys = action.payload;
      state.error = null;
    },
    fetchSurveysFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.surveys = [];
      state.error = action.payload;
    },
  },
});

export const {
  fetchSurveysRequest,
  fetchSurveysSuccess,
  fetchSurveysFailure,
  setActiveSurvey,
} = surveySlice.actions;

export default surveySlice.reducer;
