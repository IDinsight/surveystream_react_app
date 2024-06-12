import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";

export const fetchAllMediaAuditsConfigs = async (formUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/media-files?form_uid=${formUID}`;

    const res = await axios.get(url, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const fetchMediaAuditConfig = async (mediaConfigUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/media-files/${mediaConfigUID}`;

    const res = await axios.get(url, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const createMediaAuditConfig = async (formUID: string, data: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/media-files?form_uid=${formUID}`;

    const res = await axios.post(url, data, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const updateMediaAuditConfig = async (
  mediaConfigUID: string,
  data: any
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/media-files/${mediaConfigUID}`;

    const res = await axios.put(url, data, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteMediaAuditConfig = async (mediaConfigUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/media-files/${mediaConfigUID}`;

    const res = await axios.delete(url, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const api = {
  fetchAllMediaAuditsConfigs,
  fetchMediaAuditConfig,
  createMediaAuditConfig,
  updateMediaAuditConfig,
  deleteMediaAuditConfig,
};
