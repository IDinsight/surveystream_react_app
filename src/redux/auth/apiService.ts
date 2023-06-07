import { message } from "antd";
import axios from "axios";
import { LoginFormData, ResetPasswordData } from "./types";

import { getCookie, deleteAllCookies } from "../../utils/helper";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";

export const performLoginRequest = async (formData: LoginFormData) => {
  try {
    await getCSRFToken();

    const csrfToken = getCookie("CSRF-TOKEN");

    const headers = {
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/json",
    };

    const { data } = await axios.post(`${API_BASE_URL}/login`, formData, {
      headers,
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    let errorMessage = "An error occurred";

    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    }

    return { status: false, error: errorMessage };
  }
};

export const performLogoutRequest = async () => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    const { data } = await axios.get(`${API_BASE_URL}/logout`, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return data;
  } catch (err: any) {
    if (err?.response?.status === 401) {
      deleteAllCookies();
      window.location.href = "/login";
    }
    throw err;
  }
};

export const forgotPasswordAction = async (formData: { email: string }) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    await axios.post(
      `${API_BASE_URL}/forgot-password`,
      { email: formData.email },
      {
        headers: { "X-CSRF-Token": csrfToken },
        withCredentials: true,
      }
    );
    message.success(`Success! Please check your email to reset your password`);
  } catch (err: any) {
    if (err?.response) {
      message.error(err.response?.data?.message);
    } else {
      message.error(err?.message);
    }
  }
};

export const resetPasswordAction = async (formData: ResetPasswordData) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");

    await axios.post(`${API_BASE_URL}/reset-password`, formData, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    message.success("Password reset success");
  } catch (err: any) {
    message.error(err?.message);
  }
};
