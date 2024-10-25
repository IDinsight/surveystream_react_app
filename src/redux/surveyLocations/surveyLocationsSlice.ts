import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GeoLevel, SurveyLocationLong } from "./types";

interface SurveyLocationsState {
  loading: boolean;
  error: any;
  surveyLocationGeoLevels: GeoLevel[];
  surveyLocations: any;
  surveyLocationsLong: SurveyLocationLong[];
}

const initialState: SurveyLocationsState = {
  loading: false,
  error: null,
  surveyLocationGeoLevels: [],
  surveyLocations: [],
  surveyLocationsLong: [],
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

    putSurveyPrimeGeoLevelRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    putSurveyPrimeGeoLevelRequestSuccess: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = null;
    },
    putSurveyPrimeGeoLevelRequestFailure: (
      state,
      action: PayloadAction<any>
    ) => {
      state.loading = false;
      state.error = action.payload;
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

    getSurveyLocationsLongRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSurveyLocationsLongSuccess: (state, action: PayloadAction<any>) => {
      if (action.payload.length !== 0) {
        state.surveyLocationsLong = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    getSurveyLocationsLongFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.surveyLocationsLong = [];
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
  getSurveyLocationsLongRequest,
  getSurveyLocationsLongSuccess,
  getSurveyLocationsLongFailure,
  postSurveyLocationGeoLevelsFailure,
  postSurveyLocationGeoLevelsRequest,
  postSurveyLocationGeoLevelsSuccess,
  postSurveyLocationsFailure,
  postSurveyLocationsRequest,
  postSurveyLocationsSuccess,
  setSurveyLocationGeoLevels,
  addSurveyLocationGeoLevel,
  resetSurveyLocations,
  putSurveyPrimeGeoLevelRequest,
  putSurveyPrimeGeoLevelRequestFailure,
  putSurveyPrimeGeoLevelRequestSuccess,
} = surveyLocationsSlice.actions;

export default surveyLocationsSlice.reducer;
