import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DQFormState } from "./types";

const initialState: DQFormState = {
  loading: false,
  error: null,
  dqForms: [],
};

const dqFormSlice = createSlice({
  name: "dqForm",
  initialState,
  reducers: {
    getDQFormsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDQFormsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.dqForms = action.payload;
    },
    getDQFormsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.dqForms = null;
    },
    getDQFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getDQFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    getDQFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createDQFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createDQFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    createDQFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateDQFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDQFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateDQFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteDQFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDQFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    deleteDQFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getSCTOFormMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSCTOFormMappingSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    getSCTOFormMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createSCTOFormMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSCTOFormMappingSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    createSCTOFormMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateSCTOFormMappingRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSCTOFormMappingSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateSCTOFormMappingFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getDQFormsRequest,
  getDQFormsSuccess,
  getDQFormsFailure,
  getDQFormRequest,
  getDQFormSuccess,
  getDQFormFailure,
  createDQFormRequest,
  createDQFormSuccess,
  createDQFormFailure,
  updateDQFormRequest,
  updateDQFormSuccess,
  updateDQFormFailure,
  deleteDQFormRequest,
  deleteDQFormSuccess,
  deleteDQFormFailure,
  getSCTOFormMappingRequest,
  getSCTOFormMappingSuccess,
  getSCTOFormMappingFailure,
  createSCTOFormMappingRequest,
  createSCTOFormMappingSuccess,
  createSCTOFormMappingFailure,
  updateSCTOFormMappingRequest,
  updateSCTOFormMappingSuccess,
  updateSCTOFormMappingFailure,
} = dqFormSlice.actions;

export default dqFormSlice.reducer;
