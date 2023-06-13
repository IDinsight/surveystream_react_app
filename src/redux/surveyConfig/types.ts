export type SurveyBasicInformationData = {
  survey_id: string;
  survey_name: string;
  project_name: string;
  survey_description: string;
  surveying_method: string;
  irb_approval: string;
  planned_start_date: string;
  planned_end_date: string;
  config_status: string;
  state: string;
  created_by_user_uid: number;
  [key: string]: any; // Index signature allowing any string key
};

export type SurveyModuleQuestionnaireData = {
  survey_uid?: number;
  target_assignment_criteria: string[];
  supervisor_assignment_criteria: string[];
  supervisor_hierarchy_exists: boolean;
  reassignment_required: boolean;
  assignment_process: string;
  supervisor_surveyor_relation: string;
  language_location_mapping: boolean;
};
