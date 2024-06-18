import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MediaAuditsState } from "./types";

const initialState: MediaAuditsState = {
  loading: false,
  error: null,
  mediaConfigs: [],
};

const targetsSlice = createSlice({
  name: "mediaAudits",
  initialState,
  reducers: {
    getMediaAuditsConfigsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getMediaAuditsConfigsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.mediaConfigs = action.payload.data;
    },
    getMediaAuditsConfigsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.mediaConfigs = null;
    },
    getMediaAuditConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getMediaAuditConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    getMediaAuditConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createMediaAuditConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createMediaAuditConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    createMediaAuditConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMediaAuditConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateMediaAuditConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    updateMediaAuditConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteMediaAuditConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteMediaAuditConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    deleteMediaAuditConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getMediaAuditsConfigsRequest,
  getMediaAuditsConfigsSuccess,
  getMediaAuditsConfigsFailure,
  getMediaAuditConfigRequest,
  getMediaAuditConfigSuccess,
  getMediaAuditConfigFailure,
  createMediaAuditConfigRequest,
  createMediaAuditConfigSuccess,
  createMediaAuditConfigFailure,
  updateMediaAuditConfigRequest,
  updateMediaAuditConfigSuccess,
  updateMediaAuditConfigFailure,
  deleteMediaAuditConfigRequest,
  deleteMediaAuditConfigSuccess,
  deleteMediaAuditConfigFailure,
} = targetsSlice.actions;

export default targetsSlice.reducer;
