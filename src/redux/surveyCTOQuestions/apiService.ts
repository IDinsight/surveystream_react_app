import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { SurveyCTOQuestionsForm } from "./types";

export const getSurveyCTOFormDefinition = async (form_uid: string, refresh: boolean = false) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/forms/${form_uid}/scto-form-definition${refresh?'/refresh':''}`;

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

export const getSurveyCTOFormMapping = async (form_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/forms/${form_uid}/scto-question-mapping`;

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

export const createSurveyCTOFormMapping = async (
  formData: SurveyCTOQuestionsForm,
  form_uid: string
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const res = await axios.post(
      `${API_BASE_URL}/forms/${form_uid}/scto-question-mapping`,
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
  } catch (err: any) {
    return err;
  }
};

export const updateSurveyCTOFormMapping = async (
  formData: SurveyCTOQuestionsForm,
  form_uid: string
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const res = await axios.put(
      `${API_BASE_URL}/forms/${form_uid}/scto-question-mapping`,
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
  } catch (err: any) {
    return err;
  }
};

export const api = {
  getSurveyCTOFormDefinition,
  getSurveyCTOFormMapping,
  updateSurveyCTOFormMapping,
  createSurveyCTOFormMapping,
};
