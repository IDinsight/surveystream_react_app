import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { SupervisorRole } from "./types";
import {
  postSupervisorRolesFailure,
  postSupervisorRolesRequest,
  postSupervisorRolesSuccess,
} from "./surveyInformationSlice";

export const postSupervisorRoles = createAsyncThunk(
  "survey/postSupervisorRoles",
  async (
    supervisorRolesData: SupervisorRole[],
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(postSupervisorRolesRequest());
      const response = await api.postSupervisorRoles(supervisorRolesData);
      if (response.data && response.success) {
        dispatch(postSupervisorRolesSuccess(response.data));
        return response;
      }
      const error = {
        ...response.response.data,
        code: response.response.status,
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

export const surveyInformationActions = {
  postSupervisorRoles,
};
