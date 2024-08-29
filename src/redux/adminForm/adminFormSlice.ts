import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminFormState } from "./types";

const initialState: AdminFormState = {
  loading: false,
  error: null,
  adminForms: [],
};

const adminFormSlice = createSlice({
  name: "adminForm",
  initialState,
  reducers: {
    getAdminFormsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAdminFormsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.adminForms = action.payload;
    },
    getAdminFormsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.adminForms = null;
    },
    getAdminFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getAdminFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    getAdminFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createAdminFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createAdminFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    createAdminFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateAdminFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateAdminFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    updateAdminFormFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteAdminFormRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteAdminFormSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    deleteAdminFormFailure: (state, action: PayloadAction<any>) => {
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
  getAdminFormsRequest,
  getAdminFormsSuccess,
  getAdminFormsFailure,
  getAdminFormRequest,
  getAdminFormSuccess,
  getAdminFormFailure,
  createAdminFormRequest,
  createAdminFormSuccess,
  createAdminFormFailure,
  updateAdminFormRequest,
  updateAdminFormSuccess,
  updateAdminFormFailure,
  deleteAdminFormRequest,
  deleteAdminFormSuccess,
  deleteAdminFormFailure,
  getSCTOFormMappingRequest,
  getSCTOFormMappingSuccess,
  getSCTOFormMappingFailure,
  createSCTOFormMappingRequest,
  createSCTOFormMappingSuccess,
  createSCTOFormMappingFailure,
  updateSCTOFormMappingRequest,
  updateSCTOFormMappingSuccess,
  updateSCTOFormMappingFailure,
} = adminFormSlice.actions;

export default adminFormSlice.reducer;
