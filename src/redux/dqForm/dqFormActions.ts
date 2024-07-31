import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  getDQFormsRequest,
  getDQFormsSuccess,
  getDQFormsFailure,
  getDQFormRequest,
  getDQFormSuccess,
  getDQFormFailure,
  createDQFormRequest,
  createDQFormSuccess,
  createDQFormFailure,
  updateDQFormRequest,
  updateDQFormSuccess,
  updateDQFormFailure,
  deleteDQFormRequest,
  deleteDQFormSuccess,
  deleteDQFormFailure,
  updateSCTOFormMappingRequest,
  updateSCTOFormMappingSuccess,
  updateSCTOFormMappingFailure,
  createSCTOFormMappingFailure,
  createSCTOFormMappingSuccess,
  createSCTOFormMappingRequest,
  getSCTOFormMappingRequest,
  getSCTOFormMappingSuccess,
  getSCTOFormMappingFailure,
} from "./dqFormSlice";
import {
  createSurveyCTOFormMapping,
  getSurveyCTOFormMapping,
  updateSurveyCTOFormMapping,
} from "../surveyCTOQuestions/apiService";

export const getDQForms = createAsyncThunk(
  "dqForm/getDQForms",
  async (
    { survey_uid }: { survey_uid?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getDQFormsRequest());
      const res: any = await api.fetchAllDQForm(survey_uid);

      if (res.status === 200) {
        dispatch(getDQFormsSuccess(res.data.data));
        return res.data.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(getDQFormsFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get DQ forms";
      dispatch(getDQFormsFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getDQForm = createAsyncThunk(
  "dqForm/getDQForm",
  async ({ form_uid }: { form_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getDQFormRequest());
      const res: any = await api.fetchDQForm(form_uid);

      if (res.status === 200) {
        dispatch(getDQFormSuccess());
        return res.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(getDQFormFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || `Failed to get DQ form ${form_uid}`;
      dispatch(getDQFormFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const createDQForm = createAsyncThunk(
  "dqForm/createDQForm",
  async ({ data }: { data: any }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createDQFormRequest());
      const response: any = await api.createDQForm(data);
      if (response.status == 201) {
        dispatch(createDQFormSuccess());
        return { ...response, success: true };
      }

      if (response?.response?.data?.success === false) {
        const error = {
          message: response?.response?.data?.error?.message
            ? response?.response?.data?.error?.message
            : "Failed to create dq form.",
          success: false,
        };
        dispatch(createDQFormFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to create dq form.",
        success: false,
      };
      dispatch(createDQFormFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to create DQ form.";
      dispatch(createDQFormFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateDQForm = createAsyncThunk(
  "dqForm/updateDQForm",
  async (
    { formUID, data }: { formUID: string; data: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateDQFormRequest());
      const response: any = await api.updateDQForm(formUID, data);
      if (response.status == 200) {
        dispatch(updateDQFormSuccess());
        return { ...response, success: true };
      }

      if (response?.response?.data?.success === false) {
        const error = {
          message: response?.response?.data?.error?.message
            ? response?.response?.data?.error?.message
            : "Failed to update dq form.",
          success: false,
        };
        dispatch(updateDQFormFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update update dq.",
        success: false,
      };
      dispatch(updateDQFormFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update update DQ form.";
      dispatch(updateDQFormFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteDQForm = createAsyncThunk(
  "dqForm/deleteDQForm",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(deleteDQFormRequest());
      const response: any = await api.deleteDQForm(formUID);
      if (response.status === 204) {
        dispatch(deleteDQFormSuccess());
        return { success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to delete the DQ Form.",
        success: false,
      };
      dispatch(deleteDQFormFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to delete the DQ Form.";
      dispatch(deleteDQFormFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSCTOFormMapping = createAsyncThunk(
  "surveyCTOQuestions/getSCTOFormMapping",
  async (formUid: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getSCTOFormMappingRequest());
      const res: any = await getSurveyCTOFormMapping(formUid);

      if (res.status === 200) {
        dispatch(getSCTOFormMappingSuccess(res.data.data));
        return res.data.data;
      }
      const error = { ...res.response.data, code: res.response.status };
      dispatch(getSCTOFormMappingFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get surveyCTO form mapping";
      dispatch(getSCTOFormMappingFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const createSCTOFormMapping = createAsyncThunk(
  "dqForm/createSCTOFormMapping",
  async (
    { formUID, data }: { formUID: string; data: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(createSCTOFormMappingRequest());
      const response: any = await createSurveyCTOFormMapping(data, formUID);
      if (response.status == 201) {
        dispatch(createSCTOFormMappingSuccess());
        return { ...response, success: true };
      }

      if (response?.response?.data?.success === false) {
        const error = {
          message: response?.response?.data?.error?.message
            ? response?.response?.data?.error?.message
            : "Failed to update DQ form SCTO question mapping.",
          success: false,
        };
        dispatch(createSCTOFormMappingFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update DQ form SCTO question mapping.",
        success: false,
      };
      dispatch(createSCTOFormMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage =
        error || "Failed to update DQ form SCTO question mapping.";
      dispatch(createSCTOFormMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateSCTOFormMapping = createAsyncThunk(
  "dqForm/updateSCTOFormMapping",
  async (
    { formUID, data }: { formUID: string; data: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateSCTOFormMappingRequest());
      const response: any = await updateSurveyCTOFormMapping(data, formUID);
      if (response.status == 200) {
        dispatch(updateSCTOFormMappingSuccess());
        return { ...response, success: true };
      }

      if (response?.response?.data?.success === false) {
        const error = {
          message: response?.response?.data?.error?.message
            ? response?.response?.data?.error?.message
            : "Failed to update DQ form SCTO question mapping.",
          success: false,
        };
        dispatch(updateSCTOFormMappingFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update DQ form SCTO question mapping.",
        success: false,
      };
      dispatch(updateSCTOFormMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage =
        error || "Failed to update DQ form SCTO question mapping.";
      dispatch(updateSCTOFormMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const enumeratorsActions = {
  getDQForms,
  getDQForm,
  createDQForm,
  updateDQForm,
  deleteDQForm,
  getSCTOFormMapping,
  createSCTOFormMapping,
  updateSCTOFormMapping,
};
