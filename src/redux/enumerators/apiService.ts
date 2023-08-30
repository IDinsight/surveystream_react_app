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

export const fetchEnumerators = async (
  formUID: string,
  enumeratorType?: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    let url = `${API_BASE_URL}/enumerators?form_uid=${formUID}`;

    if (enumeratorType) {
      url = `${url}enumerator_type=${enumeratorType}`;
    }

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

export const getEnumerator = async (enumeratorUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/enumerators?enumerator_uid=${enumeratorUID}`;

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

export const updateEnumerator = async (
  enumeratorUID: string,
  enumeratorData: any
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/enumerators?enumerator_uid=${enumeratorUID}`;

    const res = await axios.put(
      url,
      { ...enumeratorData },
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

export const bulkUpdateEnumerators = async (
  enumeratorUIDs: string[],
  formUID: string,
  patchKeys: any
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/enumerators`;

    const res = await axios.patch(
      url,
      { enumerator_uids: enumeratorUIDs, form_uid: formUID, ...patchKeys },
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

export const bulkUpdateEnumeratorsLocationMapping = async (
  enumeratorType: string,
  enumeratorUIDs: string[],
  formUID: string,
  locationUIDs: string[]
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/enumerators/roles/locations`;

    const res = await axios.put(
      url,
      {
        enumerator_type: enumeratorType,
        enumerator_uids: enumeratorUIDs,
        form_uid: formUID,
        location_uids: locationUIDs,
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

export const fetchEnumeratorsColumnConfig = async (formUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/enumerators/column-config?form_uid=${formUID}`;
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

export const updateEnumeratorsColumnConfig = async (
  formUID: string,
  columnConfig: any
) => {
  try {
    await getCSRFToken();
    const csrfToken = await getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/enumerators/column-config`;

    const res = await axios.put(
      url,
      { form_uid: formUID, column_config: columnConfig },
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
  fetchEnumerators,
  getEnumerator,
  updateEnumerator,
  bulkUpdateEnumerators,
  bulkUpdateEnumeratorsLocationMapping,
  fetchEnumeratorsColumnConfig,
  updateEnumeratorsColumnConfig,
};
