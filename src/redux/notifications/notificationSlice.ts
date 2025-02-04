import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationsState } from "./types";
import { create } from "lodash";
import {
  createNotificationViaAction,
  resolveSurveyNotification,
} from "./apiService";

const initialState: NotificationsState = {
  loading: false,
  error: null,
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    getNotificationsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getNotificationsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.notifications = action.payload;
    },
    getNotificationsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.notifications = null;
    },
    createNotificationViaActionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createNotificationViaActionSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    createNotificationViaActionFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resolveSurveyNotificationRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    resolveSurveyNotificationSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
    },
    resolveSurveyNotificationFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsFailure,
  createNotificationViaActionRequest,
  createNotificationViaActionSuccess,
  createNotificationViaActionFailure,
  resolveSurveyNotificationRequest,
  resolveSurveyNotificationFailure,
  resolveSurveyNotificationSuccess,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
