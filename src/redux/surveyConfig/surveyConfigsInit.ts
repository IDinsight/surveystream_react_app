export const surveyConfigs: Record<string, any> = {
  "Background Details": {
    status: "Not Started",
    optional: false,
  },
  "Feature Selection": {
    status: "Not Started",
    optional: false,
  },
  "Survey Information": [
    {
      name: "SurveyCTO Integration",
      status: "Not Started",
      optional: false,
    },
    {
      name: "User and Role Management",
      status: "Not Started",
      optional: false,
    },
    {
      name: "Locations",
      status: "Not Started",
      optional: true,
    },
    {
      name: "Enumerators",
      status: "Not Started",
      optional: true,
    },
    {
      name: "Targets",
      status: "Not Started",
      optional: true,
    },
    {
      name: "Survey Status for Targets",
      status: "Not Started",
      optional: true,
    },
    {
      name: "Supervisor Mapping",
      status: "Not Started",
      optional: true,
    },
  ],
  "Module Configuration": [],
};

export const completionStats = {
  num_modules: 0,
  num_completed: 0,
  num_in_progress: 0,
  num_in_progress_incomplete: 0,
  num_not_started: 0,
  num_error: 0,
  num_optional: 0,
};
