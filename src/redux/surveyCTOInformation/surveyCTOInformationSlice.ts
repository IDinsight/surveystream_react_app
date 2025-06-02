import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SurveyCTOForm } from "./types";

interface SurveyCTOInformationState {
  loading: boolean;
  error: any;
  surveyCTOForm: SurveyCTOForm;
  timezones: any;
}

const initialState: SurveyCTOInformationState = {
  loading: false,
  error: null,
  surveyCTOForm: {
    last_ingested_at: null,
    form_uid: "",
    survey_uid: "",
    scto_form_id: "",
    form_name: "",
    tz_name: "",
    scto_server_name: "",
    encryption_key_shared: false,
    server_access_role_granted: false,
    server_access_allowed: false,
    number_of_attempts: 0,
  },
  timezones: [{ name: "Asia/Kolkatta" }, { name: "Asia/Manila" }],
};

const surveyCTOInformationSlice = createSlice({
  name: "surveyCTOInformation",
  initialState,
  reducers: {
    getTimezonesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getTimezonesFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getTimezonesSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.timezones = action.payload;
    },
    getSurveyCTOFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSurveyCTOFormSuccess: (
      state,
      action: PayloadAction<SurveyCTOForm[]>
    ) => {
      state.loading = false;
      state.error = null;
      state.surveyCTOForm = action.payload[0]; // Extract the object at index 0
    },
    getSurveyCTOFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    postSurveyCTOFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    postSurveyCTOFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    postSurveyCTOFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    putSurveyCTOFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    putSurveyCTOFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    putSurveyCTOFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getSurveyCTOFormDataRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSurveyCTOFormDataSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    getSurveyCTOFormDataFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getTimezonesRequest,
  getTimezonesFailure,
  getTimezonesSuccess,
  getSurveyCTOFormSuccess,
  getSurveyCTOFormFailure,
  getSurveyCTOFormRequest,
  postSurveyCTOFormFailure,
  postSurveyCTOFormRequest,
  postSurveyCTOFormSuccess,
  putSurveyCTOFormFailure,
  putSurveyCTOFormRequest,
  putSurveyCTOFormSuccess,
  getSurveyCTOFormDataRequest,
  getSurveyCTOFormDataSuccess,
  getSurveyCTOFormDataFailure,
} = surveyCTOInformationSlice.actions;

export default surveyCTOInformationSlice.reducer;
