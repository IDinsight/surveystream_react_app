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

export type SurveyModuleQuestionnaire = {
  assignment_process: string;
  language_lacation_mapping: true;
  reassignment_required: true;
  supervisor_assignment_criteria: string[];
  supervisor_enumerator_relation: string;
  supervisor_hierarchy_exists: true;
  survey_uid: 0;
  target_assignment_criteria: string[];
};
