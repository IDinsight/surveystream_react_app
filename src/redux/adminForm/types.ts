export interface AdminFormState {
  loading: boolean;
  error: any;
  adminForms: any;
}

export type AdminFormPayload = {
  survey_uid: string;
  scto_form_id: string;
  form_name: string;
  tz_name: string;
  scto_server_name: string;
  encryption_key_shared: boolean;
  server_access_role_granted: boolean;
  server_access_allowed: boolean;
  form_type: string;
  admin_form_type: string;
};
