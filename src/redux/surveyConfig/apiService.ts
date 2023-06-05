import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { SurveyBasicInformationData } from "./types";

export const fetchSurveysConfig = async (survey_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const url = `${API_BASE_URL}/surveys/${survey_uid}/configuration`;

    const response = await axios.get(url, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const postSurveyBasicInformation = async (
  formData: SurveyBasicInformationData
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const { data } = await axios.post(`${API_BASE_URL}/surveys`, formData, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    return err;
  }
};
export const api = {
  postSurveyBasicInformation,
};
