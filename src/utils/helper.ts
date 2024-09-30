import { message } from "antd";
import { getSurveyCTOForms } from "../redux/surveyCTOInformation/apiService";

/**
 * Return the day with month
 * @param  {String} date Date with ISO format.
 * @return {String}      Properly formatted day with month.
 */
export const getDayMonth = (date: string) => {
  const dataArr = new Date(date).toDateString().split(" ");
  return dataArr[2] + " " + dataArr[1] + " " + dataArr[3];
};
export const getCookie = (cname: string) => {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);

  const ca = decodedCookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};

export const userHasPermission = (
  userProfile: any,
  survey_uid: any,
  permission: any
) => {
  if (!permission) {
    return false;
  }
  let { permission_name } = permission;
  if (!permission_name) {
    permission_name = permission;
  }

  // Check if user is a super admin
  if (userProfile?.is_super_admin) {
    return true;
  }

  // Check if user has admin access to the survey
  if (
    userProfile.admin_surveys &&
    userProfile.admin_surveys.includes(parseInt(survey_uid))
  ) {
    return true;
  }

  // Check under roles
  if (userProfile.roles) {
    for (const role of userProfile.roles) {
      if (role.survey_uid == survey_uid) {
        const permissions = permission_name?.split(" ") ?? [];
        const hasWritePermission =
          permissions.includes("WRITE") &&
          role.permission_names.includes(
            `WRITE ${permissions.slice(1).join(" ")}`
          );
        const hasReadPermission =
          permissions.includes("READ") &&
          role.permission_names.includes(
            `READ ${permissions.slice(1).join(" ")}`
          );

        if (permissions.includes("READ")) {
          return hasReadPermission || hasWritePermission;
        } else {
          return role.permission_names.includes(permission_name);
        }
      }
    }
  }

  return false;
};

export const properCase = function (str: string) {
  return str.replace(/\w\S*/g, function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
};

export const getSCTOForms = async (survey_uid: string) => {
  return await getSurveyCTOForms(survey_uid);
};
