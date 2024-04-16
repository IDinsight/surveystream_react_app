import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";

export const fetchTableConfig = async (formUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/assignments/table-config?form_uid=${formUID}`;

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

export const api = { fetchTableConfig };
