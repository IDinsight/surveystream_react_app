import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsFailure,
  createNotificationViaActionRequest,
  createNotificationViaActionSuccess,
  createNotificationViaActionFailure,
  resolveSurveyNotificationFailure,
  resolveSurveyNotificationRequest,
  resolveSurveyNotificationSuccess,
} from "./notificationSlice";

export const getAllNotifications = createAsyncThunk(
  "notifications/getAllNotifications",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getNotificationsRequest());
      const res: any = await api.fetchAllNotifications();

      if (res.status === 200) {
        dispatch(getNotificationsSuccess(res.data.data));
        return res.data.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(getNotificationsFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get notifications";
      dispatch(getNotificationsFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const createNotificationViaAction = createAsyncThunk(
  "notifications/createNotificationViaAction",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createNotificationViaActionRequest());
      const res: any = await api.createNotificationViaAction(data);

      if (res.status === 200) {
        dispatch(createNotificationViaActionSuccess(res.data.data));
        return res.data.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(createNotificationViaActionFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to create notification";
      dispatch(createNotificationViaActionFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const resolveSurveyNotification = createAsyncThunk(
  "notifications/resolveSurveyNotification",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(resolveSurveyNotificationRequest());
      const res: any = await api.resolveSurveyNotification(data);

      if (res.status === 200) {
        dispatch(resolveSurveyNotificationSuccess(res.data.data));
        return res.data.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(resolveSurveyNotificationFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to resolve notification";
      dispatch(resolveSurveyNotificationFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const notificationsActions = {
  getAllNotifications,
  createNotificationViaAction,
};
