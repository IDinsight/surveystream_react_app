import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { DQConfigPayload } from "./types";

export const fetchDQCheckTypes = async () => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/dq/check-types`;

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

export const fetchDQConfig = async (form_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/dq/config?form_uid=${form_uid}`;

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

export const updateDQConfig = async (formData: DQConfigPayload) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/dq/config`;

    const res = await axios.put(url, formData, {
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

export const fetchModuleName = async (form_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/dq/checks/module-names?form_uid=${form_uid}`;

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

export const getDQChecks = async (form_uid: string, type_id: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/dq/checks?form_uid=${form_uid}&type_id=${type_id}`;

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

export const postDQChecks = async (
  form_uid: string,
  type_id: string,
  formData: any
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/dq/checks?form_uid=${form_uid}&type_id=${type_id}`;

    const res = await axios.post(
      url,
      { ...formData },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};

export const putDQChecks = async (dq_check_uid: number, formData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/dq/checks/${dq_check_uid}`;

    const res = await axios.put(
      url,
      { ...formData },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteDQChecks = async (formData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/dq/checks`;

    const res = await axios.delete(url, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      data: { ...formData },
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const api = {
  fetchDQCheckTypes,
  fetchDQConfig,
  updateDQConfig,
  fetchModuleName,
  getDQChecks,
  postDQChecks,
  deleteDQChecks,
};
