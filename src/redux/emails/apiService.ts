import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";

// Email Config Endpoints

export const getEmailConfig = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(`${API_BASE_URL}/emails/config/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
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
      `${API_BASE_URL}/emails/config/${id}`,
      emailConfigData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
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

    const response = await axios.delete(`${API_BASE_URL}/emails/config/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
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
      `${API_BASE_URL}/emails/config`,
      emailConfigData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getEmailConfigs = async (form_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(
      `${API_BASE_URL}/emails/config?form_uid=${form_uid}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getAllEmailDetails = async (form_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(
      `${API_BASE_URL}/emails?form_uid=${form_uid}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

// Email Schedule Endpoints

export const getEmailSchedule = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(`${API_BASE_URL}/emails/schedule/${id}`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response;
  } catch (error) {
    return error;
  }
};

export const updateEmailSchedule = async (
  id: string,
  emailScheduleData: any
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.put(
      `${API_BASE_URL}/emails/schedule/${id}`,
      emailScheduleData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const deleteEmailSchedule = async (
  id: string,
  email_config_uid: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.delete(
      `${API_BASE_URL}/emails/schedule/${id}?email_config_uid=${email_config_uid}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

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
      `${API_BASE_URL}/emails/schedule`,
      emailScheduleData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getEmailSchedules = async (email_config_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(
      `${API_BASE_URL}/emails/schedules?email_config_uid=${email_config_uid}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

// Manual Email Trigger Endpoints

export const getManualEmailTrigger = async (id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(
      `${API_BASE_URL}/emails/manual-trigger/${id}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const updateManualEmailTrigger = async (
  id: string,
  manualEmailTriggerData: any
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.put(
      `${API_BASE_URL}/emails/manual-trigger/${id}`,
      { ...manualEmailTriggerData },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const deleteManualEmailTrigger = async (
  id: string,
  email_config_uid: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.delete(
      `${API_BASE_URL}/emails/manual-trigger/${id}?email_config_uid=${email_config_uid}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

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
      `${API_BASE_URL}/emails/manual-trigger`,
      manualEmailTriggerData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getManualEmailTriggers = async (email_config_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(
      `${API_BASE_URL}/emails/manual-trigger?email_config_uid=${email_config_uid}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

// Email Template Endpoints

export const createEmailTemplate = async (emailTemplateData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.post(
      `${API_BASE_URL}/emails/template`,
      emailTemplateData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getEmailTemplates = async (email_config_uid: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const response = await axios.get(
      `${API_BASE_URL}/emails/template?email_config_uid=${email_config_uid}`,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const api = {
  createEmailConfig,
  getEmailConfigs,
  getAllEmailDetails,
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
  getEmailTemplates,
};
