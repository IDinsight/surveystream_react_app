import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { SupervisorRole } from "./types";

export const postSupervisorRoles = async (formData: SupervisorRole[]) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const { data } = await axios.put(
      `${API_BASE_URL}/roles?survey_uid`,
      formData,
      {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return data;
  } catch (err: any) {
    return err;
  }
};
export const api = {
  postSupervisorRoles,
};
