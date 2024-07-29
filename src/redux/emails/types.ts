export type EmailConfig = {
  email_config_uid: number;
  config_name: string; // assignments, finance, etc.
  form_uid: number;
};

export type EmailSchedule = {
  email_schedule_uid: number;
  email_config_uid: number;
  dates: Date[];
  time: string; // TIME in HH:MM:SS format
};

export type EmailManualTrigger = {
  manual_email_trigger_uid: number;
  email_config_uid: number;
  date: Date;
  time: string; // TIME in HH:MM:SS format
  recipients?: number[]; // Array of recipient IDs, can be undefined
  status: "queued" | "sent" | "failed" | "running" | "progress";
};

export type EmailTemplate = {
  email_template_uid: number;
  subject: string;
  language: string;
  content: string;
  email_config_uid: number;
};
