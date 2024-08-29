import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "./apiService";
import {
  getAdminFormsRequest,
  getAdminFormsSuccess,
  getAdminFormsFailure,
  getAdminFormRequest,
  getAdminFormSuccess,
  getAdminFormFailure,
  createAdminFormRequest,
  createAdminFormSuccess,
  createAdminFormFailure,
  updateAdminFormRequest,
  updateAdminFormSuccess,
  updateAdminFormFailure,
  deleteAdminFormRequest,
  deleteAdminFormSuccess,
  deleteAdminFormFailure,
  updateSCTOFormMappingRequest,
  updateSCTOFormMappingSuccess,
  updateSCTOFormMappingFailure,
  createSCTOFormMappingFailure,
  createSCTOFormMappingSuccess,
  createSCTOFormMappingRequest,
  getSCTOFormMappingRequest,
  getSCTOFormMappingSuccess,
  getSCTOFormMappingFailure,
} from "./adminFormSlice";
import {
  createSurveyCTOFormMapping,
  getSurveyCTOFormMapping,
  updateSurveyCTOFormMapping,
} from "../surveyCTOQuestions/apiService";

export const getAdminForms = createAsyncThunk(
  "dqForm/getAdminForms",
  async (
    { survey_uid }: { survey_uid?: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getAdminFormsRequest());
      const res: any = await api.fetchAllAdminForm(survey_uid);

      if (res.status === 200) {
        dispatch(getAdminFormsSuccess(res.data.data));
        return res.data.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(getAdminFormsFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || "Failed to get Admin Forms";
      dispatch(getAdminFormsFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAdminForm = createAsyncThunk(
  "dqForm/getAdminForm",
  async ({ form_uid }: { form_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getAdminFormRequest());
      const res: any = await api.fetchAdminForm(form_uid);

      if (res.status === 200) {
        dispatch(getAdminFormSuccess());
        return res.data;
      }

      const error = { ...res.response.data, code: res.response.status };
      dispatch(getAdminFormFailure(error));
      return res.response.data;
    } catch (error) {
      const errorMessage = error || `Failed to get the Admin Form ${form_uid}`;
      dispatch(getAdminFormFailure(errorMessage as string));
      return rejectWithValue(errorMessage);
    }
  }
);

export const createAdminForm = createAsyncThunk(
  "adminForm/createAdminForm",
  async ({ data }: { data: any }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createAdminFormRequest());
      const response: any = await api.createAdminForm(data);
      if (response.status == 201) {
        dispatch(createAdminFormSuccess());
        return { ...response, success: true };
      }

      if (response?.response?.data?.success === false) {
        const error = {
          message: response?.response?.data?.error?.message
            ? response?.response?.data?.error?.message
            : "Failed to create the Admin Form.",
          success: false,
        };
        dispatch(createAdminFormFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to create admin form.",
        success: false,
      };
      dispatch(createAdminFormFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to create the Admin Form.";
      dispatch(createAdminFormFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateAdminForm = createAsyncThunk(
  "adminForm/updateAdminForm",
  async (
    { formUID, data }: { formUID: string; data: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateAdminFormRequest());
      const response: any = await api.updateAdminForm(formUID, data);
      if (response.status == 200) {
        dispatch(updateAdminFormSuccess());
        return { ...response, success: true };
      }

      if (response?.response?.data?.success === false) {
        const error = {
          message: response?.response?.data?.error?.message
            ? response?.response?.data?.error?.message
            : "Failed to update the Admin Form.",
          success: false,
        };
        dispatch(updateAdminFormFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update the Admin Form.",
        success: false,
      };
      dispatch(updateAdminFormFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update the Admin Form.";
      dispatch(updateAdminFormFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAdminForm = createAsyncThunk(
  "adminForm/deleteAdminForm",
  async ({ formUID }: { formUID: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(deleteAdminFormRequest());
      const response: any = await api.deleteAdminForm(formUID);
      if (response.status === 204) {
        dispatch(deleteAdminFormSuccess());
        return { success: true };
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to delete the Admin Form.",
        success: false,
      };
      dispatch(deleteAdminFormFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to delete the Admin Form.";
      dispatch(deleteAdminFormFailure(errorMessage));
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
      const errorMessage =
        error || "Failed to get the Admin form SurveyCTO question mapping.";
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
            : "Failed to update the Admin form SurveyCTO question mapping.",
          success: false,
        };
        dispatch(createSCTOFormMappingFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update the Admin form SurveyCTO question mapping.",
        success: false,
      };
      dispatch(createSCTOFormMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage =
        error || "Failed to update the Admin form SurveyCTO question mapping.";
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
            : "Failed to update the Admin form SurveyCTO question mapping.",
          success: false,
        };
        dispatch(updateSCTOFormMappingFailure(error));
        return error;
      }

      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update the Admin form SurveyCTO question mapping.",
        success: false,
      };
      dispatch(updateSCTOFormMappingFailure(error));
      return error;
    } catch (error) {
      const errorMessage =
        error || "Failed to update the Admin form SurveyCTO question mapping.";
      dispatch(updateSCTOFormMappingFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const enumeratorsActions = {
  getAdminForms,
  getAdminForm,
  createAdminForm,
  updateAdminForm,
  deleteAdminForm,
  getSCTOFormMapping,
  createSCTOFormMapping,
  updateSCTOFormMapping,
};
