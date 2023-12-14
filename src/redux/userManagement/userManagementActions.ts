import { compose, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  checkUserFailure,
  checkUserRequest,
  checkUserSuccess,
  getAllUsersFailure,
  getAllUsersRequest,
  getAllUsersSuccess,
  postCompleteRegistrationFailure,
  postCompleteRegistrationRequest,
  postCompleteRegistrationSuccess,
  postNewUserFailure,
  postNewUserRequest,
  postNewUserSuccess,
} from "./userManagementSlice";

export const postCheckUser = createAsyncThunk(
  "userManagement/postCheckUser",
  async (email: string, { dispatch, rejectWithValue }) => {
    try {
      console.log("params", email);

      dispatch(checkUserRequest());
      const response: any = await api.postCheckUser(email);
      if (response.status == 200) {
        dispatch(checkUserSuccess(response.data));
        return response;
      }

      const error = {
        message: response.message,
        status: false,
      };
      dispatch(checkUserFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to post check new user";
      dispatch(postNewUserFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const postAddUser = createAsyncThunk(
  "userManagement/postAddUser",
  async (userData: any, { dispatch, rejectWithValue }) => {
    try {
      console.log("userData", userData);

      dispatch(postNewUserRequest());
      const response: any = await api.postNewUser(userData);
      if (response.status == 200) {
        dispatch(postNewUserSuccess(response.data));
        return response;
      }

      const error = {
        message: response.message,
        status: false,
      };
      dispatch(postNewUserFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to post new user";
      dispatch(postNewUserFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const postCompleteRegistration = createAsyncThunk(
  "userManagement/postCompleteRegistration",
  async (userData: any, { dispatch, rejectWithValue }) => {
    try {
      console.log("userData", userData);

      dispatch(postCompleteRegistrationRequest());
      const response: any = await api.postCompleteRegistration(userData);
      if (response.status == 200) {
        dispatch(postCompleteRegistrationSuccess(response.data));
        return response;
      }

      const error = {
        message: response.message,
        status: false,
      };
      dispatch(postCompleteRegistrationFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to post complete registration";
      dispatch(postCompleteRegistrationFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUser = createAsyncThunk(
  "userManagement/getUser",
  async (params: { user_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(checkUserRequest());
      const res: any = await api.fetchUser(params.user_uid);

      if (res.status === 200) {
        dispatch(checkUserSuccess(res.data.data));
        return res.data.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(checkUserFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to check for user";
      dispatch(checkUserFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "userManagement/getAllUsers",
  async (params: { survey_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getAllUsersRequest());
      const res: any = await api.fetchUsers();

      if (res.status === 200) {
        dispatch(getAllUsersSuccess(res.data));
        return res.data;
      }
      const error = { ...res.data, code: res.status };
      dispatch(getAllUsersFailure(error));
      return res.data;
    } catch (error) {
      const errorMessage = error || "Failed to get all users";
      dispatch(getAllUsersFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const userRolesActions = {
  postAddUser,
  getUser,
};
