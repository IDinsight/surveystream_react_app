import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EmailsState {
  loading: boolean;
  error: any;
  emailConfigList: any;
  emailScheduleList: any;
  manualEmailTriggerList: any;
  emailTemplateList: any;
  currentEmailConfig: any;
  currentEmailSchedule: any;
  currentManualEmailTrigger: any;
  currentEmailTemplate: any;
}

const initialState: EmailsState = {
  loading: false,
  error: null,
  emailConfigList: [],
  emailScheduleList: [],
  manualEmailTriggerList: [],
  emailTemplateList: [],
  currentEmailConfig: null,
  currentEmailSchedule: null,
  currentManualEmailTrigger: null,
  currentEmailTemplate: null,
};

const emailsSlice = createSlice({
  name: "emails",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    createEmailConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEmailConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailConfigList = action.payload;
    },
    createEmailConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getEmailConfigsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEmailConfigsSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailConfigList = action.payload;
    },
    getEmailConfigsFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getEmailConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEmailConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.currentEmailConfig = action.payload;
    },
    getEmailConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateEmailConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEmailConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.currentEmailConfig = action.payload;
    },
    updateEmailConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteEmailConfigRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteEmailConfigSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailConfigList = state.emailConfigList.filter(
        (config: any) => config.email_config_uid !== action.payload
      );
    },
    deleteEmailConfigFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    createEmailScheduleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEmailScheduleSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailScheduleList = action.payload;
    },
    createEmailScheduleFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getEmailSchedulesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEmailSchedulesSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailScheduleList = action.payload;
    },
    getEmailSchedulesFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getEmailScheduleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEmailScheduleSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.currentEmailSchedule = action.payload;
    },
    getEmailScheduleFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateEmailScheduleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEmailScheduleSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.currentEmailSchedule = action.payload;
    },
    updateEmailScheduleFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteEmailScheduleRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteEmailScheduleSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailScheduleList = state.emailScheduleList.filter(
        (schedule: any) => schedule.email_schedule_uid !== action.payload
      );
    },
    deleteEmailScheduleFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    createManualEmailTriggerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createManualEmailTriggerSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.manualEmailTriggerList = action.payload;
    },
    createManualEmailTriggerFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getManualEmailTriggersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getManualEmailTriggersSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.manualEmailTriggerList = action.payload;
    },
    getManualEmailTriggersFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getManualEmailTriggerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getManualEmailTriggerSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.currentManualEmailTrigger = action.payload;
    },
    getManualEmailTriggerFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateManualEmailTriggerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateManualEmailTriggerSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.currentManualEmailTrigger = action.payload;
    },
    updateManualEmailTriggerFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteManualEmailTriggerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteManualEmailTriggerSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.manualEmailTriggerList = state.manualEmailTriggerList.filter(
        (trigger: any) => trigger.manual_email_trigger_uid !== action.payload
      );
    },
    deleteManualEmailTriggerFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    createEmailTemplateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createEmailTemplateSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailTemplateList = action.payload;
    },
    createEmailTemplateFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getEmailTemplatesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEmailTemplatesSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailTemplateList = action.payload;
    },
    getEmailTemplatesFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    getEmailTemplateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getEmailTemplateSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.currentEmailTemplate = action.payload;
    },
    getEmailTemplateFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateEmailTemplateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateEmailTemplateSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.currentEmailTemplate = action.payload;
    },
    updateEmailTemplateFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteEmailTemplateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteEmailTemplateSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      state.emailTemplateList = state.emailTemplateList.filter(
        (template: any) => template.email_template_uid !== action.payload
      );
    },
    deleteEmailTemplateFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
  getEmailTemplateRequest,
  getEmailTemplateSuccess,
  getEmailTemplateFailure,
  updateEmailTemplateRequest,
  updateEmailTemplateSuccess,
  updateEmailTemplateFailure,
  deleteEmailTemplateRequest,
  deleteEmailTemplateSuccess,
  deleteEmailTemplateFailure,
} = emailsSlice.actions;

export default emailsSlice.reducer;
