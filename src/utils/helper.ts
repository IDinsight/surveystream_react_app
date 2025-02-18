import { getSurveyCTOForms } from "../redux/surveyCTOInformation/apiService";
import { getSurveyModules } from "../redux/surveyConfig/surveyConfigActions";

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

export const isAdmin = function (userProfile: any, survey_uid: any) {
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
  return false;
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

  // Check if user is a super admin or has admin access to the survey
  if (isAdmin(userProfile, survey_uid)) {
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

export const userHasPermissionAdmin = (
  userProfile: any,
  survey_uid: any,
  permission: any
) => {
  if (!permission) {
    return { hasPermission: false, isAdmin: false };
  }
  let { permission_name } = permission;
  if (!permission_name) {
    permission_name = permission;
  }

  // Check if user is a super admin or has admin access to the survey
  if (isAdmin(userProfile, survey_uid)) {
    return { hasPermission: true, isAdmin: true };
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
          return {
            hasPermission: hasReadPermission || hasWritePermission,
            isAdmin: false,
          };
        } else {
          return {
            hasPermission: role.permission_names.includes(permission_name),
            isAdmin: false,
          };
        }
      }
    }
  }

  return { hasPermission: false, isAdmin: false };
};
export const properCase = function (str: string) {
  return str.replace(/\w\S*/g, function (str) {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
};

export const getSCTOForms = async (survey_uid: string) => {
  return await getSurveyCTOForms(survey_uid);
};

export const getModulePath = (survey_uid: number, module_id: number | null) => {
  const moduleRoutes: { [key: number]: string | null } = {
    1: `/new-survey-config/${survey_uid}`,
    2: `/module-selection/${survey_uid}`,
    3: `/survey-information/survey-cto-information/${survey_uid}`,
    4: `/survey-information/survey-roles/roles/${survey_uid}`,
    5: `/survey-information/location/upload/${survey_uid}`,
    6: `/survey-information/survey-users/users/${survey_uid}`,
    7: `/survey-information/enumerators/${survey_uid}`,
    8: `/survey-information/targets/${survey_uid}`,
    9: `/module-configuration/assignments/${survey_uid}`,
    10: null,
    11: `/module-configuration/dq-forms/${survey_uid}`,
    12: `/module-configuration/media-audits/${survey_uid}`,
    13: null,
    14: `/survey-information/survey/status-mapping/${survey_uid}`,
    15: `/module-configuration/emails/${survey_uid}`,
    16: `/module-configuration/table-config/${survey_uid}`,
    17: `/survey-information/mapping/surveyor/${survey_uid}`,
    18: `/module-configuration/admin-forms/${survey_uid}`,
  };

  const defaultPath = `/survey-configuration/${survey_uid}`;

  if (module_id === null) {
    return defaultPath;
  }

  return moduleRoutes[module_id] || defaultPath;
};

export const getErrorModules = async (survey_uid: string, dispatch: any) => {
  if (survey_uid === "" || survey_uid === null) {
    return [];
  }
  const surveyModules = await dispatch(
    getSurveyModules({ survey_uid })
  ).unwrap();

  if (surveyModules.success) {
    const errorModulesData = [
      ...surveyModules.data
        .filter((module: any) => module.error === true)
        .map((module: any) => module.name),
    ];
    return errorModulesData;
  }
  return [];
};
