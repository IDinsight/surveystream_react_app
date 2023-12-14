import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";

export const postCheckUser = async (email?: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/check-user`;

    const payload = { email: email };

    console.log("payload", payload);

    const res = await axios.post(url, payload, {
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

export const postCompleteRegistration = async (userPayload: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/complete-registration`;

    const payload = { ...userPayload };

    console.log("payload", payload);

    const res = await axios.post(url, payload, {
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

export const postNewUser = async (userData?: any) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/add-user`;

    const res = await axios.post(
      url,
      {
        ...userData,
      },
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

export const fetchUser = async (user_uid: any) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const res = await axios.get(
      `${API_BASE_URL}/get-user?user_uid=${user_uid}`,
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

export const fetchUsers = async (survey_uid?: any) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    let url: string;

    if (survey_uid) {
      url = `${API_BASE_URL}/get-all-users?survey_uid=${survey_uid}`;
    } else {
      url = `${API_BASE_URL}/get-all-users`;
    }
    console.log("url", url);

    const res = await axios.get(`${API_BASE_URL}/get-all-users`, {
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
  postCheckUser,
  fetchUser,
  postNewUser,
  fetchUsers,
};
