import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import {
  SurveyBasicInformationData,
  SurveyModuleQuestionnaireData,
} from "./types";

export const fetchSurveyBasicInformation = async (survey_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const url = `${API_BASE_URL}/surveys/${survey_uid}/basic-information`;

    const response = await axios.get(url, {
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

export const fetchSurveyModuleQuestionnaire = async (survey_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const url = `${API_BASE_URL}/module-questionnaire/${survey_uid}`;

    const response = await axios.get(url, {
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

export const postSurveyModuleQuestionnaire = async (
  formData: SurveyModuleQuestionnaireData,
  survey_uid?: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const url = `${API_BASE_URL}/module-questionnaire/${survey_uid}`;
    formData.survey_uid = survey_uid
      ? parseInt(survey_uid)
      : formData.survey_uid;
    const response = await axios.put(url, formData, {
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

export const fetchSurveysConfig = async (survey_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const url = `${API_BASE_URL}/surveys/${survey_uid}/config-status`;

    const response = await axios.get(url, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateSurveyBasicInformation = async (
  formData: any,
  survey_uid: string
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const response = await axios.put(
      `${API_BASE_URL}/surveys/${survey_uid}/basic-information`,
      formData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (err: any) {
    return err;
  }
};

export const postSurveyBasicInformation = async (
  formData: SurveyBasicInformationData
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const response = await axios.post(`${API_BASE_URL}/surveys`, formData, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateSurveyState = async (survey_uid: string, state: string) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const response = await axios.put(
      `${API_BASE_URL}/surveys/${survey_uid}/state`,
      {
        survey_uid: survey_uid,
        state: state,
      },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (err: any) {
    return err;
  }
};

export const fetchSurveyErrorModules = async (survey_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const url = `${API_BASE_URL}/surveys/${survey_uid}/error-modules`;

    const response = await axios.get(url, {
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

export const api = {
  fetchSurveyBasicInformation,
  postSurveyBasicInformation,
  updateSurveyBasicInformation,
  fetchSurveysConfig,
  fetchSurveyModuleQuestionnaire,
  postSurveyModuleQuestionnaire,
  updateSurveyState,
  fetchSurveyErrorModules,
};
