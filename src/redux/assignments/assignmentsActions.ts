import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  tableConfigRequest,
  tableConfigSuccess,
  tableConfigFailure,
  assignmentsRequest,
  assignmentsSuccess,
  assignmentsFailure,
  assignableEnumeratorsRequest,
  assignableEnumeratorsSuccess,
  assignableEnumeratorsFailure,
  targetsRequest,
  targetsFailure,
  targetsSuccess,
} from "./assignmentsSlice";

import {
  fetchAssignableEnumerators,
  fetchAssignments,
  fetchTableConfig,
  makeAssignments,
  updateAssignableEnumerators,
} from "./apiService";
import { fetchTargets } from "../targets/apiService";
import { AssignmentFormPayload } from "./types";
import { getEnumerators } from "../enumerators/enumeratorsActions";

export const getTableConfig = createAsyncThunk(
  "assignments/getTableConfig",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(tableConfigRequest());
      const response: any = await fetchTableConfig(formUID);
      if (response.status == 200) {
        dispatch(tableConfigSuccess(response.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch table config.",
        success: false,
      };
      dispatch(tableConfigFailure(error.message));
      return error;
    } catch (error: any) {
      const errorMessage = error || "Failed to fetch table config.";
      dispatch(tableConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAssignments = createAsyncThunk(
  "assignments/getAssignments",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(assignmentsRequest());
      const response: any = await fetchAssignments(formUID);
      if (response.status == 200) {
        dispatch(assignmentsSuccess(response.data.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch assignments.",
        success: false,
      };
      dispatch(assignmentsFailure(error.message));
      return error;
    } catch (error: any) {
      const errorMessage = error || "Failed to fetch assignments.";
      dispatch(assignmentsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateAssignments = createAsyncThunk(
  "assignments/updateAssignments",
  async ({ formUID, formData, callFn }: AssignmentFormPayload) => {
    try {
      const response: any = await makeAssignments(formUID, formData);
      if (response.status == 200) {
        callFn({ ...response.data, success: true });
        return;
      }

      const errorObj = {
        message: response.message
          ? response.message
          : "Failed to update assignments.",
        success: false,
      };
      callFn(errorObj);
    } catch (error: any) {
      console.log(error);
      const errorMessage = error || "Failed to update assignments.";
      const errorObj = {
        message: errorMessage,
        success: false,
      };
      callFn(errorObj);
    }
  }
);

export const getAssignableEnumerators = createAsyncThunk(
  "assignments/getAssignableEnumerators",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(assignableEnumeratorsRequest());
      const response: any = await fetchAssignableEnumerators(formUID);
      if (response.status == 200) {
        dispatch(assignableEnumeratorsSuccess(response.data.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch enumerators.",
        success: false,
      };
      dispatch(assignableEnumeratorsFailure(error.message));
      return error;
    } catch (error: any) {
      const errorMessage = error || "Failed to fetch enumerators.";
      dispatch(assignableEnumeratorsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEnumeratorStatus = createAsyncThunk(
  "assignments/updateEnumeratorStatus",
  async (
    { enumeratorUID, enumeratorType, formUID, newStatus }: any,
    { dispatch }
  ) => {
    try {
      const response: any = await updateAssignableEnumerators(
        enumeratorUID,
        enumeratorType,
        formUID,
        newStatus
      );
      if (response.status == 200) {
        dispatch(getEnumerators({ formUID }));

        // Update the assignments list if the surveyor is dropout
        if (newStatus === "Dropout") {
          dispatch(getAssignments({ formUID }));
        }
        return { ...response, success: true };
      }

      return { success: false };
    } catch (error: any) {
      return { success: false };
    }
  }
);

export const getTargets = createAsyncThunk(
  "assignments/getTargets",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(targetsRequest());
      const response: any = await fetchTargets(formUID);
      if (response.status == 200) {
        dispatch(targetsSuccess(response.data.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch targets.",
        success: false,
      };
      dispatch(targetsFailure(error.message));
      return error;
    } catch (error: any) {
      const errorMessage = error || "Failed to fetch targets.";
      dispatch(targetsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const enumeratorsActions = { getAssignments };
