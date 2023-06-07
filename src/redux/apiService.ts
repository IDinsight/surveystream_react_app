import axios from "axios";
import { API_BASE_URL } from "../config/url";

export const getCSRFToken = async () => {
  try {
    const data = await axios
      .get(`${API_BASE_URL}/get-csrf`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("getCSRFToken", response);
        return response;
      });

    return data;
  } catch (err: any) {
    if (err?.response) {
      throw new Error(err.response?.data?.message);
    }
    throw new Error(err.message);
  }
};
