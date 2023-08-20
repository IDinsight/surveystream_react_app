import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { EnumeratorMapping } from "./types";

export const uploadEnumeratorMapping = async (
  formData: EnumeratorMapping,
  form_uid: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/enumerators?form_uid=${form_uid}`;

    const res = await axios.post(
      url,
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
  } catch (error) {
    return error;
  }
};

export const api = {
  uploadEnumeratorMapping,
};
