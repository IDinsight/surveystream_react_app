import axios from "axios";
import { API_BASE_URL } from "../../config/url";
import { getCSRFToken } from "../apiService";
import { getCookie } from "../../utils/helper";
import { AssignmentPayload } from "./types";

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

export const fetchAssignments = async (formUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/assignments?form_uid=${formUID}`;

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

export const fetchAssignableEnumerators = async (formUID: string) => {
  try {
    await getCSRFToken();
    const csrfToken = getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/assignments/enumerators?form_uid=${formUID}`;

    const res = await axios.get(url, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return res;
  } catch (err) {
    return err;
  }
};

export const updateAssignableEnumerators = async (
  enumeratorUID: string,
  enumeratorType: string,
  formUID: string,
  newStatus: string
) => {
  try {
    await getCSRFToken();
    const csrfToken = getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/enumerators/${enumeratorUID}/roles/status`;

    const res = await axios.patch(
      url,
      {
        enumerator_type: enumeratorType,
        form_uid: formUID,
        status: newStatus,
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
  } catch (err) {
    return err;
  }
};

export const makeAssignments = async (
  formUID: string,
  formData: AssignmentPayload[]
) => {
  try {
    await getCSRFToken();
    const csrfToken = getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/assignments?form_uid=${formUID}`;

    const res = await axios.put(
      url,
      {
        form_uid: formUID,
        assignments: formData,
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

export const uploadAssignments = async (formUID: string, fileData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/assignments?form_uid=${formUID}`;

    const res = await axios.post(
      url,
      {
        column_mapping: {
          target_id: "target_id",
          enumerator_id: "enumerator_id",
        },
        file: fileData,
        mode: "merge",
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

export const scheduleAssignmentsEmail = async (formData: any) => {
  try {
    await getCSRFToken();
    const csrfToken = getCookie("CSRF-TOKEN");
    const url = `${API_BASE_URL}/assignments/schedule-email`;

    const res = await axios.post(
      url,
      {
        ...formData,
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

export const api = {
  fetchAssignments,
  fetchAssignableEnumerators,
  makeAssignments,
  scheduleAssignmentsEmail,
};
