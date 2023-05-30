import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { SurveyBasicInformationData } from "./types";

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
