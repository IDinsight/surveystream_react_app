import { compose, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { SupervisorRole } from "./types";
import {
  deleteUserHierarchyFailure,
  deleteUserHierarchyRequest,
  deleteUserHierarchySuccess,
  getAllPermissionsFailure,
  getAllPermissionsRequest,
  getAllPermissionsSuccess,
  getSupervisorRolesFailure,
  getSupervisorRolesRequest,
  getSupervisorRolesSuccess,
  getUserHierarchyFailure,
  getUserHierarchyRequest,
  getUserHierarchySuccess,
  postSupervisorRolesFailure,
  postSupervisorRolesRequest,
  postSupervisorRolesSuccess,
  updateUserHierarchyFailure,
  updateUserHierarchyRequest,
  updateUserHierarchySuccess,
} from "./userRolesSlice";

export const postSupervisorRoles = createAsyncThunk(
  "userRoles/postSupervisorRoles",
  async (
    {
      supervisorRolesData,
      surveyUid,
    }: { supervisorRolesData: SupervisorRole[]; surveyUid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postSupervisorRolesRequest());
      const response = await api.postSupervisorRoles(
        supervisorRolesData,
        surveyUid
      );
      if (response.status == 200) {
        dispatch(postSupervisorRolesSuccess(response.data));
        return response;
      }

      const error = {
        message: response.message,
        status: false,
      };
      dispatch(postSupervisorRolesFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to post supervisor roles";
      dispatch(postSupervisorRolesFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSupervisorRoles = createAsyncThunk(
  "userRoles/getSupervisorRoles",
  async (params: { survey_uid?: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getSupervisorRolesRequest());
      const res: any = await api.fetchSupervisorRoles(params.survey_uid);

      if (res.status === 200) {
        dispatch(getSupervisorRolesSuccess(res.data.data));
        return res.data.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(getSupervisorRolesFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get supervisor roles";
      dispatch(getSupervisorRolesFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllPermissions = createAsyncThunk(
  "userRoles/getAllPermissions",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getAllPermissionsRequest());
      const res: any = await api.fetchAllPermissions();

      if (res.status === 200) {
        dispatch(getAllPermissionsSuccess(res.data));
        return res.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(getAllPermissionsFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get permissions";
      dispatch(getAllPermissionsFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const putUserHierarchy = createAsyncThunk(
  "userRoles/putUserHierarchy",
  async (
    { hierarchyData }: { hierarchyData: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateUserHierarchyRequest());
      const response: any = await api.updateUserHierarchy(hierarchyData);
      if (response?.status == 200) {
        dispatch(updateUserHierarchySuccess(response?.data));
        return response;
      }

      const error = {
        message: response.message,
        status: false,
      };
      dispatch(updateUserHierarchyFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update user hierarchy";
      dispatch(updateUserHierarchyFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserHierarchy = createAsyncThunk(
  "userRoles/getUserHierarchy",
  async (
    params: { survey_uid: string; user_uid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getUserHierarchyRequest());
      const res: any = await api.fetchUserHierarchy(
        params.user_uid,
        params.survey_uid
      );

      if (res.status === 200) {
        dispatch(getUserHierarchySuccess(res.data.data));
        return res.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(getUserHierarchyFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get user hierarchy";
      dispatch(getUserHierarchyFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUserHierarchy = createAsyncThunk(
  "userRoles/deleteUserHierarchy",
  async (
    params: { survey_uid: string; user_uid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(deleteUserHierarchyRequest());
      const res: any = await api.deleteUserHierarchy(
        params.user_uid,
        params.survey_uid
      );

      if (res.status === 200) {
        dispatch(deleteUserHierarchySuccess(res.data.data));
        return res.data.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(deleteUserHierarchyFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to delete user hierarchy";
      dispatch(deleteUserHierarchyFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const userRolesActions = {
  postSupervisorRoles,
  getSupervisorRoles,
  getAllPermissions,
  getUserHierarchy,
  putUserHierarchy,
  deleteUserHierarchy,
};
