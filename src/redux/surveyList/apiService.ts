import axios from "axios";
import { API_BASE_URL } from "../../config/url";

export const fetchSurveys = async (user_uid?: number) => {
  try {
    let url = `${API_BASE_URL}/surveys`;

    if (user_uid) {
      url += `?user_uid=${user_uid}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const api = {
  fetchSurveys,
};
