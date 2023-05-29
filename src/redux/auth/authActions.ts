import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserProfile,
  performLoginRequest,
  performLogoutRequest,
} from "./apiService";
import { LoginFormData } from "./types";
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  profileFailure,
  profileRequest,
  profileSuccess,
} from "./authSlice";

export const performLogin = createAsyncThunk(
  "auth/performLogin",
  async (loginFormData: LoginFormData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginRequest());
      const response = await performLoginRequest(loginFormData);
      const profile = await getUserProfile();
      response.profile = profile;
      dispatch(loginSuccess(response));

      return response;
    } catch (error) {
      const errorMessage = error || "Login failed";
      dispatch(loginFailure(errorMessage as string));
      return rejectWithValue(errorMessage as string);
    }
  }
);

export const performGetUserProfile = createAsyncThunk(
  "auth/performGetUserProfile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(profileRequest());
      const response = await getUserProfile();
      console.log("user profile", response);
      dispatch(profileSuccess(response));

      return response;
    } catch (error) {
      const errorMessage = error || "Login failed";
      dispatch(profileFailure(errorMessage as string));
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
      // Process the logout response if needed
      // For example, clear user data from the state or remove access token
      return null; // Return null as there is no specific payload needed
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const resetLoginStatus = () => {
  return { type: "auth/resetLoginStatus" };
};
