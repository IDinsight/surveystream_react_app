export type EnumeratorMapping = {
  column_mapping: {
    custom_fields?: Array<{
      column_name: string;
      field_label: string;
    }>;
    email: string;
    enumerator_id: string;
    enumerator_type?: string;
    gender: string;
    home_address?: string;
    language?: string;
    location_id_column?: string;
    mobile_primary: string;
    name: string;
  };
  file: string;
  mode: "overwrite" | "append";
};
