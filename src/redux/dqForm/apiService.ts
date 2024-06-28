import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { DQFormPayload } from "./types";

export const fetchAllDQForm = async (survey_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/forms?survey_uid=${survey_uid}&form_type=dq`;

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

export const fetchDQForm = async (form_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/forms/${form_uid}`;

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

export const createDQForm = async (formData: DQFormPayload) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const res = await axios.post(
      `${API_BASE_URL}/forms?survey_uid=${formData.survey_uid}`,
      formData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res;
  } catch (err: any) {
    return err;
  }
};

export const updateDQForm = async (formUID: string, formData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/forms/${formUID}`;

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

export const deleteDQForm = async (formUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/forms/${formUID}`;

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
  fetchAllDQForm,
  fetchDQForm,
  createDQForm,
  updateDQForm,
  deleteDQForm,
};
