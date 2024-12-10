import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  tableConfigRequest,
  tableConfigSuccess,
  tableConfigFailure,
  assignmentsRequest,
  assignmentsSuccess,
  assignmentsFailure,
  assignmentTargetsRequest,
  assignmentTargetsSuccess,
  assignmentTargetsFailure,
  assignmentEnumeratorsRequest,
  assignmentEnumeratorsSuccess,
  assignmentEnumeratorsFailure,
} from "./assignmentsSlice";

import {
  fetchAssignmentTargets,
  fetchAssignmentEnumerators,
  fetchAssignments,
  fetchTableConfig,
  makeAssignments,
  scheduleAssignmentsEmail,
  updateAssignableEnumerators,
  uploadAssignments,
} from "./apiService";
import { AssignmentFormPayload } from "./types";
import { getEnumerators } from "../enumerators/enumeratorsActions";

export const getTableConfig = createAsyncThunk(
  "assignments/getTableConfig",
  async (
    {
      formUID,
      filter_supervisors,
    }: {
      formUID: string;
      filter_supervisors?: boolean;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(tableConfigRequest());
      const response: any = await fetchTableConfig(formUID, filter_supervisors);
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
        errors: response.response.data.errors?.message
          ? response.response.data.errors?.message
          : response.response.data.errors?.mapping_errors
          ? response.response.data.errors?.mapping_errors
          : "Failed to fetch assignments.",
        message: response.message
          ? response.message
          : "Failed to fetch assignments.",
        success: false,
      };
      dispatch(assignmentsFailure(error.errors));
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
        message: response.response.data.errors.message
          ? response.response.data.errors.message
          : "Failed to update assignments.",
        success: false,
      };
      callFn(errorObj);
    } catch (error: any) {
      const errorMessage = error || "Failed to update assignments.";
      const errorObj = {
        message: errorMessage,
        success: false,
      };
      callFn(errorObj);
    }
  }
);

export const uploadCSVAssignments = createAsyncThunk(
  "assignments/uploadCSVAssignments",
  async (
    {
      formUID,
      fileData,
      validate_mapping,
    }: { formUID: string; fileData: any; validate_mapping: boolean },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(assignmentsRequest());
      const response: any = await uploadAssignments(
        formUID,
        fileData,
        validate_mapping
      );
      if (response.status == 200) {
        dispatch(assignmentsSuccess(response.data.data));
        return { ...response.data, success: true };
      }

      if (response?.response?.status == 422) {
        dispatch(assignmentsFailure(response.response.data));
        return { ...response?.response?.data, success: false };
      }

      const errorObj = {
        message: response.message
          ? response.message
          : "Failed to update assignments.",
        success: false,
      };
      dispatch(assignmentsFailure(errorObj));

      return errorObj;
    } catch (error: any) {
      const errorMessage = error || "Failed to update assignments.";
      const errorObj = {
        message: errorMessage,
        success: false,
      };
      dispatch(assignmentsFailure(errorObj));

      return errorObj;
    }
  }
);

export const getAssignmentTargets = createAsyncThunk(
  "assignments/getAssignmentTargets",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(assignmentTargetsRequest());
      const response: any = await fetchAssignmentTargets(formUID);
      if (response.status == 200) {
        dispatch(assignmentTargetsSuccess(response.data.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch targets.",
        success: false,
      };
      dispatch(assignmentTargetsFailure(error.message));
      return error;
    } catch (error: any) {
      const errorMessage = error || "Failed to fetch targets.";
      dispatch(assignmentTargetsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAssignmentEnumerators = createAsyncThunk(
  "assignments/getAssignmentEnumerators",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(assignmentEnumeratorsRequest());
      const response: any = await fetchAssignmentEnumerators(formUID);
      if (response.status == 200) {
        dispatch(assignmentEnumeratorsSuccess(response.data.data));
        return { ...response, success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch enumerators.",
        success: false,
      };
      dispatch(assignmentEnumeratorsFailure(error.message));
      return error;
    } catch (error: any) {
      const errorMessage = error || "Failed to fetch enumerators.";
      dispatch(assignmentEnumeratorsFailure(errorMessage));
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
        dispatch(getAssignmentEnumerators({ formUID }));

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

export const postAssignmentEmail = createAsyncThunk(
  "assignments/postAssignmentEmail",
  async ({ formData, callFn }: any) => {
    try {
      const response: any = await scheduleAssignmentsEmail(formData);
      if (response.status == 201) {
        callFn({ ...response.data, success: true });
        return;
      }

      const errorObj = {
        message: response.message
          ? response.message
          : "Failed to schedule assignments email.",
        success: false,
      };
      callFn(errorObj);
    } catch (error: any) {
      const errorMessage = error || "Failed to schedule assignments email.";
      const errorObj = {
        message: errorMessage,
        success: false,
      };
      callFn(errorObj);
    }
  }
);

export const enumeratorsActions = { getAssignments };
