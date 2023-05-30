import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SurveyConfigState {
  loading: boolean;
  error: any;
  basicInfo: any;
}

const initialState: SurveyConfigState = {
  loading: false,
  error: null,
  basicInfo: null,
};

const surveyConfigSlice = createSlice({
  name: "surveyConfig",
  initialState,
  reducers: {
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
  postSurveyBasicInformationRequest,
  postSurveyBasicInformationSuccess,
  postSurveyBasicInformationFailure,
} = surveyConfigSlice.actions;

export default surveyConfigSlice.reducer;
