import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { SurveyCTOForm } from "./types";

export const getSurveyCTOForms = async (survey_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/forms?survey_uid=${survey_uid}`;

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

export const getTimezones = async () => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/timezones`;

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

export const createSurveyCTOForm = async (
  formData: SurveyCTOForm,
  survey_uid: string
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const res = await axios.put(
      `${API_BASE_URL}/forms?survey_uid=${survey_uid}`,
      { roles: formData },
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

export const updateSurveyCTOForm = async (
  formData: SurveyCTOForm,
  form_uid: string
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const res = await axios.put(
      `${API_BASE_URL}/forms/${form_uid}`,
      { roles: formData },
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

export const api = {
  getSurveyCTOForms,
  getTimezones,
  updateSurveyCTOForm,
  createSurveyCTOForm,
};
