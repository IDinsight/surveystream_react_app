export type TargetMapping = {
  column_mapping: {
    custom_fields?: Array<{
      column_name: string;
      field_label: string;
    }>;
    gender: string;
    language: string;
    location_id_column: string;
    target_id: string;
  };
  file: string;
  mode: "overwrite" | "merge";
  load_from_scto: boolean;
  load_successful: boolean;
};
