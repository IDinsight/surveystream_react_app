
// types.ts
export interface ModuleStatus {
  survey_uid: number;
  module_id: number;
  config_status: string;
}

export interface ModuleStatusesState {
  loading: boolean;
  moduleStatuses: ModuleStatus[];
  error: string | null;
}

export interface Module {
  module_id: number;
  name?: string;
  title: string;
  description?: string;
  icon?: any;
  optional?: boolean;
}
