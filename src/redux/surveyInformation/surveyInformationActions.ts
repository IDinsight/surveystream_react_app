import { compose, createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import { SupervisorRole } from "./types";
import {
  getSupervisorRolesFailure,
  getSupervisorRolesRequest,
  getSupervisorRolesSuccess,
  postSupervisorRolesFailure,
  postSupervisorRolesRequest,
  postSupervisorRolesSuccess,
} from "./surveyInformationSlice";

export const postSupervisorRoles = createAsyncThunk(
  "surveyInformation/postSupervisorRoles",
  async (
    {
      supervisorRolesData,
      surveyUid,
    }: { supervisorRolesData: SupervisorRole; surveyUid: string },
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
        message: response.data.message,
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
  "surveyInformation/getSupervisorRoles",
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

export const surveyInformationActions = {
  postSupervisorRoles,
};
