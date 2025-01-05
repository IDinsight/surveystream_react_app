import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";

export const fetchAllNotifications = async (user_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/notifications?user_uid=${user_uid}`;

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

export const api = {
  fetchAllNotifications,
};
