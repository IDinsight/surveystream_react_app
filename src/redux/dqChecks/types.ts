export interface DQChecksState {
  loading: boolean;
  error: any;
  checkTypes: any[];
  dqConfig: any;
}

export type DQConfigPayload = {
  form_uid: string;
  survey_status_filter: string[];
};
