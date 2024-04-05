import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  forgotPasswordAction,
  getUserProfile,
  performLoginRequest,
  performLogoutRequest,
  resetPasswordAction,
} from "./apiService";
import { LoginFormData, ResetPasswordData } from "./types";
import {
  forgotPasswordFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutFailure,
  logoutRequest,
  logoutSuccess,
  profileFailure,
  profileRequest,
  profileSuccess,
  resetPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
} from "./authSlice";
import { deleteAllCookies } from "../../utils/helper";

export const performLogin = createAsyncThunk(
  "auth/performLogin",
  async (loginFormData: LoginFormData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginRequest());
      const response = await performLoginRequest(loginFormData);

      if (response.status === false) {
        dispatch(loginFailure(response.error as string));
        return response;
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
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(logoutRequest());
      const response = await performLogoutRequest();
      response.status = true;
      dispatch(logoutSuccess(response));
      deleteAllCookies();
      return response;
    } catch (error) {
      const errorMessage = error || "logout failed";
      dispatch(logoutFailure(errorMessage as string));
      return rejectWithValue(error as string);
    }
  }
);

export const performGetUserProfile = createAsyncThunk(
  "auth/performGetUserProfile",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(profileRequest());
      const response = await getUserProfile();
      dispatch(profileSuccess(response));

      return response;
    } catch (error) {
      const errorMessage = error || "fetching profile failed";
      dispatch(profileFailure(errorMessage as string));
      return rejectWithValue(errorMessage as string);
    }
  }
);

export const performForgotPassword = createAsyncThunk(
  "auth/performForgotPassword",
  async (userData: { email: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(forgotPasswordRequest());
      const response = await forgotPasswordAction(userData);
      dispatch(forgotPasswordSuccess(response));
      return response;
    } catch (error) {
      const errorMessage = error || "Action forgot password failed";
      dispatch(forgotPasswordFailure(errorMessage as string));
      return rejectWithValue(errorMessage as string);
    }
  }
);

export const performResetPassword = createAsyncThunk(
  "auth/performResetPassword",
  async (reqData: ResetPasswordData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(resetPasswordRequest());
      const response = await resetPasswordAction(reqData);
      dispatch(resetPasswordSuccess(response));
      return response;
    } catch (error) {
      const errorMessage = error || "Action reset password failed";
      dispatch(resetPasswordFailure(errorMessage as string));
      return rejectWithValue(errorMessage as string);
    }
  }
);
