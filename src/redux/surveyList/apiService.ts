import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCookie } from "../../utils/helper";
import { getCSRFToken } from "../apiService";

export const fetchSurveys = async (user_uid?: number) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    let url = `${API_BASE_URL}/surveys`;

    if (user_uid) {
      url += `?user_uid=${user_uid}`;
    }

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

export const api = {
  fetchSurveys,
};
