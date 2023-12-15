import { compose, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { SupervisorRole } from "./types";
import {
  getAllPermissionsFailure,
  getAllPermissionsRequest,
  getSupervisorRolesFailure,
  getSupervisorRolesRequest,
  getSupervisorRolesSuccess,
  postSupervisorRolesFailure,
  postSupervisorRolesRequest,
  postSupervisorRolesSuccess,
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
        dispatch(getSupervisorRolesSuccess(res.data));
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

export const userRolesActions = {
  postSupervisorRoles,
  getSupervisorRoles,
  getAllPermissions,
};
