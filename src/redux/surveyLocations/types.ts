export type GeoLevel = {
  geo_level_uid: string;
  geo_level_name: string;
  parent_geo_level_uid: string;
};

export type GeoLevelMapping = {
  geo_level_uid: string;
  location_name_column: string;
  location_id_column: string;
};
