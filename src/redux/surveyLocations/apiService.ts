import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { GeoLevel, GeoLevelMapping } from "./types";

export const getSurveyLocationGeoLevels = async (survey_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/locations/geo-levels?survey_uid=${survey_uid}`;

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

export const updateSurveyLocationGeoLevels = async (
  formData: GeoLevel[],
  survey_uid: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/locations/geo-levels?survey_uid=${survey_uid}`;

    const res = await axios.put(
      url,
      { geo_levels: formData, validate_hierarchy: false },
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

export const updateSurveyLocations = async (
  formData: GeoLevelMapping[],
  file: any,
  survey_uid: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/locations?survey_uid=${survey_uid}`;

    const res = await axios.post(
      url,
      { geo_level_mapping: formData, file: file },
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

export const getSurveyLocations = async (survey_uid: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/locations?survey_uid=${survey_uid}`;

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
  getSurveyLocationGeoLevels,
  updateSurveyLocationGeoLevels,
  getSurveyLocations,
  updateSurveyLocations,
};
