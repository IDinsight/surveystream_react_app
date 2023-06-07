import { createAsyncThunk } from "@reduxjs/toolkit";
import { performLoginRequest, performLogoutRequest } from "./apiService";
import { LoginFormData } from "./types";
import { loginFailure, loginRequest, loginSuccess } from "./authSlice";

export const performLogin = createAsyncThunk(
  "auth/performLogin",
  async (loginFormData: LoginFormData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginRequest());
      const response = await performLoginRequest(loginFormData);

      if (response.status === false) {
        dispatch(loginFailure(response.error as string));
        return false;
      }

      dispatch(loginSuccess(response));
      return response;
    } catch (error) {
      const errorMessage = error || "Login failed";
      dispatch(loginFailure(errorMessage as string));

      return rejectWithValue(errorMessage as string);
    }
  }
);

export const performLogout = createAsyncThunk(
  "auth/performLogout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await performLogoutRequest();
      console.log("logout response", response);
      return null;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);
