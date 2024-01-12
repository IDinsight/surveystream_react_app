import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { SupervisorRole } from "./types";

export const fetchSupervisorRoles = async (survey_uid?: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/roles?survey_uid=${survey_uid}`;

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

export const fetchAllPermissions = async () => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/permissions`;

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

export const postSupervisorRoles = async (
  formData: SupervisorRole[],
  survey_uid: string
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const res = await axios.put(
      `${API_BASE_URL}/roles?survey_uid=${survey_uid}`,
      { roles: formData },
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

export const fetchUserHierarchy = async (
  user_uid: string,
  survey_uid: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/user-hierarchy?user_uid=${user_uid}&survey_uid=${survey_uid}`;

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

export const updateUserHierarchy = async (formData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/user-hierarchy`;

    const res = await axios.put(
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

export const deleteUserHierarchy = async (
  user_uid: string,
  survey_uid: string
) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const url = `${API_BASE_URL}/user-hierarchy?user_uid=${user_uid}&survey_uid=${survey_uid}`;

    const res = await axios.delete(url, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res;
  } catch (err: any) {
    return err;
  }
};

export const api = {
  postSupervisorRoles,
  fetchSupervisorRoles,
  fetchAllPermissions,
  fetchUserHierarchy,
  updateUserHierarchy,
  deleteUserHierarchy,
};
