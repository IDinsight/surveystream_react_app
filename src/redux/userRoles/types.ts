export type SupervisorRole = {
  role_uid: string;
  role_name: string;
  reporting_role_uid: string;
  permissions: number[];
};

export type RolePermissions = {
  role_uid: string | null;
  survey_uid: string | null;
  permissions: number[];
  duplicate?: boolean;
};
