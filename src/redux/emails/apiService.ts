import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";

// Email Config Endpoints
const EMAIL_CONFIG_BASE_URL = `${API_BASE_URL}/email-configs`;

export const getEmailConfig = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(`${EMAIL_CONFIG_BASE_URL}/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const updateEmailConfig = async (id: string, emailConfigData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.put(
      `${EMAIL_CONFIG_BASE_URL}/${id}`,
      emailConfigData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const deleteEmailConfig = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.delete(`${EMAIL_CONFIG_BASE_URL}/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};
export const createEmailConfig = async (emailConfigData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.post(
      EMAIL_CONFIG_BASE_URL,
      emailConfigData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getEmailConfigs = async () => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(EMAIL_CONFIG_BASE_URL, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};

// Email Schedule Endpoints
const EMAIL_SCHEDULE_BASE_URL = `${API_BASE_URL}/email-schedules`;

export const getEmailSchedule = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(`${EMAIL_SCHEDULE_BASE_URL}/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const updateEmailSchedule = async (id: string, emailScheduleData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.put(
      `${EMAIL_SCHEDULE_BASE_URL}/${id}`,
      emailScheduleData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const deleteEmailSchedule = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.delete(`${EMAIL_SCHEDULE_BASE_URL}/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};


export const createEmailSchedule = async (emailScheduleData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.post(
      EMAIL_SCHEDULE_BASE_URL,
      emailScheduleData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getEmailSchedules = async () => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(EMAIL_SCHEDULE_BASE_URL, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};

// Manual Email Trigger Endpoints
const MANUAL_EMAIL_TRIGGER_BASE_URL = `${API_BASE_URL}/manual-email-triggers`;

export const getManualEmailTrigger = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(`${MANUAL_EMAIL_TRIGGER_BASE_URL}/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const updateManualEmailTrigger = async (id: string, manualEmailTriggerData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.put(
      `${MANUAL_EMAIL_TRIGGER_BASE_URL}/${id}`,
      manualEmailTriggerData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const deleteManualEmailTrigger = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.delete(`${MANUAL_EMAIL_TRIGGER_BASE_URL}/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};
export const createManualEmailTrigger = async (manualEmailTriggerData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.post(
      MANUAL_EMAIL_TRIGGER_BASE_URL,
      manualEmailTriggerData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getManualEmailTriggers = async () => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(MANUAL_EMAIL_TRIGGER_BASE_URL, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};

// Email Template Endpoints
const EMAIL_TEMPLATE_BASE_URL = `${API_BASE_URL}/email-templates`;

export const createEmailTemplate = async (emailTemplateData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.post(
      EMAIL_TEMPLATE_BASE_URL,
      emailTemplateData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json"
        },
        withCredentials: true
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getEmailTemplates = async () => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(EMAIL_TEMPLATE_BASE_URL, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json"
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    return error;
  }
};



export const api = {
  createEmailConfig,
  getEmailConfigs,
  getEmailConfig,
  updateEmailConfig,
  deleteEmailConfig,
  createEmailSchedule,
  getEmailSchedules,
  getEmailSchedule,
  updateEmailSchedule,
  deleteEmailSchedule,
  createManualEmailTrigger,
  getManualEmailTriggers,
  getManualEmailTrigger,
  updateManualEmailTrigger,
  deleteManualEmailTrigger,
  createEmailTemplate,
  getEmailTemplates
};
