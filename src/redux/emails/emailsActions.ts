import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./apiService"; // Placeholder for your actual API service
import {
  setLoading,
  createEmailConfigRequest,
  createEmailConfigSuccess,
  createEmailConfigFailure,
  getEmailConfigsRequest,
  getEmailConfigsSuccess,
  getEmailConfigsFailure,
  getEmailConfigRequest,
  getEmailConfigSuccess,
  getEmailConfigFailure,
  updateEmailConfigRequest,
  updateEmailConfigSuccess,
  updateEmailConfigFailure,
  deleteEmailConfigRequest,
  deleteEmailConfigSuccess,
  deleteEmailConfigFailure,
  createEmailScheduleRequest,
  createEmailScheduleSuccess,
  createEmailScheduleFailure,
  getEmailSchedulesRequest,
  getEmailSchedulesSuccess,
  getEmailSchedulesFailure,
  getEmailScheduleRequest,
  getEmailScheduleSuccess,
  getEmailScheduleFailure,
  updateEmailScheduleRequest,
  updateEmailScheduleSuccess,
  updateEmailScheduleFailure,
  deleteEmailScheduleRequest,
  deleteEmailScheduleSuccess,
  deleteEmailScheduleFailure,
  createManualEmailTriggerRequest,
  createManualEmailTriggerSuccess,
  createManualEmailTriggerFailure,
  getManualEmailTriggersRequest,
  getManualEmailTriggersSuccess,
  getManualEmailTriggersFailure,
  getManualEmailTriggerRequest,
  getManualEmailTriggerSuccess,
  getManualEmailTriggerFailure,
  updateManualEmailTriggerRequest,
  updateManualEmailTriggerSuccess,
  updateManualEmailTriggerFailure,
  deleteManualEmailTriggerRequest,
  deleteManualEmailTriggerSuccess,
  deleteManualEmailTriggerFailure,
  createEmailTemplateRequest,
  createEmailTemplateSuccess,
  createEmailTemplateFailure,
  getEmailTemplatesRequest,
  getEmailTemplatesSuccess,
  getEmailTemplatesFailure,
  getEmailDetailsRequest,
  getEmailDetailsSuccess,
  getEmailDetailsFailure,
  deleteEmailTemplateRequest,
  deleteEmailTemplateSuccess,
  deleteEmailTemplateFailure,
} from "./emailsSlice";

// Email Config Actions
export const createEmailConfig = createAsyncThunk(
  "emails/createEmailConfig",
  async (emailConfigData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createEmailConfigRequest());
      const response: any = await api.createEmailConfig(emailConfigData);
      if (response.status === 201) {
        dispatch(createEmailConfigSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to create email config.",
        success: false,
      };
      dispatch(createEmailConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to create email config.";
      dispatch(createEmailConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEmailConfigs = createAsyncThunk(
  "emails/getEmailConfigs",
  async ({ form_uid }: { form_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getEmailConfigsRequest());
      const response: any = await api.getEmailConfigs(form_uid);
      if (response.status === 200) {
        dispatch(getEmailConfigsSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch email configs.",
        success: false,
      };
      dispatch(getEmailConfigsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch email configs.";
      dispatch(getEmailConfigsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEmailDetails = createAsyncThunk(
  "emails/getEmailDetails",
  async ({ form_uid }: { form_uid: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getEmailDetailsRequest());
      const response: any = await api.getAllEmailDetails(form_uid);
      if (response.status === 200) {
        dispatch(getEmailDetailsSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch email details.",
        success: false,
      };
      dispatch(getEmailDetailsFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch email details.";
      dispatch(getEmailDetailsFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEmailConfig = createAsyncThunk(
  "emails/getEmailConfig",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getEmailConfigRequest());
      const response: any = await api.getEmailConfig(id);
      if (response.status === 200) {
        dispatch(getEmailConfigSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch email config.",
        success: false,
      };
      dispatch(getEmailConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch email config.";
      dispatch(getEmailConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEmailConfig = createAsyncThunk(
  "emails/updateEmailConfig",
  async (
    { id, emailConfigData }: { id: string; emailConfigData: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateEmailConfigRequest());
      const response: any = await api.updateEmailConfig(id, emailConfigData);
      if (response.status === 200) {
        dispatch(updateEmailConfigSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update email config.",
        success: false,
      };
      dispatch(updateEmailConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update email config.";
      dispatch(updateEmailConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteEmailConfig = createAsyncThunk(
  "emails/deleteEmailConfig",
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(deleteEmailConfigRequest());
      const response: any = await api.deleteEmailConfig(id);
      if (response.status === 200) {
        dispatch(deleteEmailConfigSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to delete email config.",
        success: false,
      };
      dispatch(deleteEmailConfigFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to delete email config.";
      dispatch(deleteEmailConfigFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Email Schedule Actions
export const createEmailSchedule = createAsyncThunk(
  "emails/createEmailSchedule",
  async (emailScheduleData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createEmailScheduleRequest());
      const response: any = await api.createEmailSchedule(emailScheduleData);
      if (response.status === 201) {
        dispatch(createEmailScheduleSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to create email schedule.",
        success: false,
      };
      dispatch(createEmailScheduleFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to create email schedule.";
      dispatch(createEmailScheduleFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEmailSchedules = createAsyncThunk(
  "emails/getEmailSchedules",
  async (
    { email_config_uid }: { email_config_uid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getEmailSchedulesRequest());
      const response: any = await api.getEmailSchedules(email_config_uid);
      if (response.status === 200) {
        dispatch(getEmailSchedulesSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch email schedules.",
        success: false,
      };
      dispatch(getEmailSchedulesFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch email schedules.";
      dispatch(getEmailSchedulesFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEmailSchedule = createAsyncThunk(
  "emails/getEmailSchedule",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getEmailScheduleRequest());
      const response: any = await api.getEmailSchedule(id);
      if (response.status === 200) {
        dispatch(getEmailScheduleSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch email schedule.",
        success: false,
      };
      dispatch(getEmailScheduleFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch email schedule.";
      dispatch(getEmailScheduleFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateEmailSchedule = createAsyncThunk(
  "emails/updateEmailSchedule",
  async (
    { id, emailScheduleData }: { id: string; emailScheduleData: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateEmailScheduleRequest());
      const response: any = await api.updateEmailSchedule(
        id,
        emailScheduleData
      );
      if (response.status === 200) {
        dispatch(updateEmailScheduleSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update email schedule.",
        success: false,
      };
      dispatch(updateEmailScheduleFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update email schedule.";
      dispatch(updateEmailScheduleFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteEmailSchedule = createAsyncThunk(
  "emails/deleteEmailSchedule",
  async (
    { id, email_config_uid }: { id: string; email_config_uid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(deleteEmailScheduleRequest());
      const response: any = await api.deleteEmailSchedule(id, email_config_uid);
      if (response.status === 200) {
        dispatch(deleteEmailScheduleSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to delete email schedule.",
        success: false,
      };
      dispatch(deleteEmailScheduleFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to delete email schedule.";
      dispatch(deleteEmailScheduleFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Manual Email Trigger Actions
export const createManualEmailTrigger = createAsyncThunk(
  "emails/createManualEmailTrigger",
  async (manualEmailTriggerData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createManualEmailTriggerRequest());
      const response: any = await api.createManualEmailTrigger(
        manualEmailTriggerData
      );
      if (response.status === 201) {
        dispatch(createManualEmailTriggerSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to create manual email trigger.",
        success: false,
      };
      dispatch(createManualEmailTriggerFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to create manual email trigger.";
      dispatch(createManualEmailTriggerFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getManualEmailTriggers = createAsyncThunk(
  "emails/getManualEmailTriggers",
  async (
    { email_config_uid }: { email_config_uid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getManualEmailTriggersRequest());
      const response: any = await api.getManualEmailTriggers(email_config_uid);
      if (response.status === 200) {
        dispatch(getManualEmailTriggersSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch manual email triggers.",
        success: false,
      };
      dispatch(getManualEmailTriggersFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch manual email triggers.";
      dispatch(getManualEmailTriggersFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getManualEmailTrigger = createAsyncThunk(
  "emails/getManualEmailTrigger",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(getManualEmailTriggerRequest());
      const response: any = await api.getManualEmailTrigger(id);
      if (response.status === 200) {
        dispatch(getManualEmailTriggerSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch manual email trigger.",
        success: false,
      };
      dispatch(getManualEmailTriggerFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch manual email trigger.";
      dispatch(getManualEmailTriggerFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateManualEmailTrigger = createAsyncThunk(
  "emails/updateManualEmailTrigger",
  async (
    { id, manualEmailTriggerData }: { id: string; manualEmailTriggerData: any },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(updateManualEmailTriggerRequest());

      const response: any = await api.updateManualEmailTrigger(
        id,
        manualEmailTriggerData
      );
      if (response.status === 200) {
        dispatch(updateManualEmailTriggerSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to update manual email trigger.",
        success: false,
      };
      dispatch(updateManualEmailTriggerFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to update manual email trigger.";
      dispatch(updateManualEmailTriggerFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteManualEmailTrigger = createAsyncThunk(
  "emails/deleteManualEmailTrigger",
  async (
    { id, email_config_uid }: { id: string; email_config_uid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(deleteManualEmailTriggerRequest());
      const response: any = await api.deleteManualEmailTrigger(
        id,
        email_config_uid
      );
      if (response.status === 200) {
        dispatch(deleteManualEmailTriggerSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to delete manual email trigger.",
        success: false,
      };
      dispatch(deleteManualEmailTriggerFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to delete manual email trigger.";
      dispatch(deleteManualEmailTriggerFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Email Template Actions
export const createEmailTemplate = createAsyncThunk(
  "emails/createEmailTemplate",
  async (emailTemplateData: any, { dispatch, rejectWithValue }) => {
    try {
      dispatch(createEmailTemplateRequest());
      const response: any = await api.createEmailTemplate(emailTemplateData);
      if (response.status === 201) {
        dispatch(createEmailTemplateSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to create email template.",
        success: false,
      };
      dispatch(createEmailTemplateFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to create email template.";
      dispatch(createEmailTemplateFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const getEmailTemplates = createAsyncThunk(
  "emails/getEmailTemplates",
  async (
    { email_config_uid }: { email_config_uid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(getEmailTemplatesRequest());
      const response: any = await api.getEmailTemplates(email_config_uid);
      if (response.status === 200) {
        dispatch(getEmailTemplatesSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to fetch email templates.",
        success: false,
      };
      dispatch(getEmailTemplatesFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to fetch email templates.";
      dispatch(getEmailTemplatesFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteEmailTemplate = createAsyncThunk(
  "emails/deleteEmailTemplate",
  async (
    { id, email_config_uid }: { id: string; email_config_uid: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(deleteEmailTemplateRequest());
      const response: any = await api.deleteEmailTemplate(id, email_config_uid);
      if (response.status === 200) {
        dispatch(deleteEmailTemplateSuccess(response.data));
        return { ...response, success: true };
      }
      const error = {
        errors: response.response.data.errors,
        message: response.message
          ? response.message
          : "Failed to delete email template.",
        success: false,
      };
      dispatch(deleteEmailTemplateFailure(error));
      return error;
    } catch (error) {
      const errorMessage = error || "Failed to delete email template.";
      dispatch(deleteManualEmailTriggerFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const emailActions = {
  getEmailConfigs,
  getEmailSchedule,
  getEmailSchedules,
  createEmailConfig,
  updateEmailConfig,
  deleteEmailConfig,
  createEmailSchedule,
  updateEmailSchedule,
  deleteEmailSchedule,
  createManualEmailTrigger,
  updateManualEmailTrigger,
  deleteManualEmailTrigger,
  getManualEmailTrigger,
  getManualEmailTriggers,
  getEmailTemplates,
  createEmailTemplate,
  deleteEmailTemplate,
};
