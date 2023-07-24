import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeoLevel } from "./types";

interface SurveyLocationsState {
  loading: boolean;
  error: any;
  surveyLocationGeoLevels: GeoLevel[];
  surveyLocations: any;
}

const initialState: SurveyLocationsState = {
  loading: false,
  error: null,
  surveyLocationGeoLevels: [],
  surveyLocations: [],
};

const surveyLocationsSlice = createSlice({
  name: "surveyLocations",
  initialState,
  reducers: {
    addSurveyLocationGeoLevel: (state, action) => {
      state.surveyLocationGeoLevels.push(action.payload);
    },
    setSurveyLocationGeoLevels: (state, action: PayloadAction<GeoLevel[]>) => {
      state.surveyLocationGeoLevels = action.payload;
    },
    getSurveyLocationGeoLevelsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSurveyLocationGeoLevelsSuccess: (
      state,
      action: PayloadAction<GeoLevel[]>
    ) => {
      if (action.payload.length !== 0) {
        state.surveyLocationGeoLevels = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    getSurveyLocationGeoLevelsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.surveyLocationGeoLevels = [];
    },

    postSurveyLocationGeoLevelsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postSurveyLocationGeoLevelsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    postSurveyLocationGeoLevelsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getSurveyLocationRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSurveyLocationsSuccess: (state, action: PayloadAction<any>) => {
      if (action.payload.length !== 0) {
        state.surveyLocations = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    getSurveyLocationsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.surveyLocations = [];
    },

    postSurveyLocationsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postSurveyLocationsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    postSurveyLocationsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetSurveyLocations: () => {
      return initialState;
    },
  },
});

export const {
  getSurveyLocationGeoLevelsFailure,
  getSurveyLocationGeoLevelsRequest,
  getSurveyLocationGeoLevelsSuccess,
  getSurveyLocationRequest,
  getSurveyLocationsFailure,
  getSurveyLocationsSuccess,
  postSurveyLocationGeoLevelsFailure,
  postSurveyLocationGeoLevelsRequest,
  postSurveyLocationGeoLevelsSuccess,
  postSurveyLocationsFailure,
  postSurveyLocationsRequest,
  postSurveyLocationsSuccess,
  setSurveyLocationGeoLevels,
  addSurveyLocationGeoLevel,
  resetSurveyLocations,
} = surveyLocationsSlice.actions;

export default surveyLocationsSlice.reducer;
