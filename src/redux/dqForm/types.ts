export interface DQFormState {
  loading: boolean;
  error: any;
  dqForms: any;
}

export type DQFormPayload = {
  survey_uid: string;
  scto_form_id: string;
  form_name: string;
  tz_name: string;
  scto_server_name: string;
  encryption_key_shared: boolean;
  server_access_role_granted: boolean;
  server_access_allowed: boolean;
  form_type: string;
  dq_form_type: string;
  parent_form_uid: string;
};
