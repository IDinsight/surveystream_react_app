import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsFailure,
} from "./notificationSlice";

export const getAllNotifications = createAsyncThunk(
  "notifications/getAllNotifications",
  async (user_uid: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getNotificationsRequest());
      const res: any = await api.fetchAllNotifications(user_uid);

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

export const notificationsActions = {
  getAllNotifications,
};
