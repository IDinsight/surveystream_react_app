// moduleActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./apiService";
import {
  createModuleStatusFailure,
  createModuleStatusRequest,
  createModuleStatusSuccess,
  fetchModuleStatusesFailure,
  fetchModuleStatusesRequest,
  fetchModuleStatusesSuccess,
} from "./moduleStatusesSlice";

export const fetchModuleStatuses = createAsyncThunk(
  "moduleStatuses/fetchModuleStatuses",
  async (params: { survey_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchModuleStatusesRequest());

      const moduleStatuses: any = await api.fetchModuleStatuses(
        params.survey_uid
      );

      if (moduleStatuses.status === 200) {
        dispatch(fetchModuleStatusesSuccess(moduleStatuses.data.data));
        return moduleStatuses.data;
      }
      const error = {
        ...moduleStatuses.response.data,
        code: moduleStatuses.response.status,
      };
      dispatch(fetchModuleStatusesFailure(error));

      return moduleStatuses;
    } catch (error) {
      dispatch(fetchModuleStatusesFailure(error));

      return rejectWithValue(error as string);
    }
  }
);

export const createModuleStatus = createAsyncThunk(
  "moduleStatuses/createModuleStatus",
  async (modulesData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createModuleStatusRequest());

      const createdModuleStatus: any = await api.createModuleStatus(
        modulesData
      );

      if (createdModuleStatus.status === 200) {
        dispatch(createModuleStatusSuccess(createdModuleStatus.data));
        return createdModuleStatus.data;
      }
      const error = {
        ...createdModuleStatus.response.data,
        code: createdModuleStatus.response.status,
      };
      dispatch(createModuleStatusFailure(error));

      return createdModuleStatus;
      return createdModuleStatus;
    } catch (error) {
      return rejectWithValue(error as string);
    }
  }
);

export const moduleActions = {
  fetchModuleStatuses,
  createModuleStatus,
};
