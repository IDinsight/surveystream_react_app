import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationsState } from "./types";

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
  },
});

export const {
  getNotificationsRequest,
  getNotificationsSuccess,
  getNotificationsFailure,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
