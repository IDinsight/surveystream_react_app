import { Module } from "./types";
import {
  FileSearchOutlined,
  PieChartOutlined,
  SendOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
  MailFilled,
  MailOutlined,
  SwapOutlined,
  AudioOutlined,
  FormOutlined,
} from "@ant-design/icons";
// Assuming the module descriptions are stored in the `moduleDescriptions` array
export const moduleDescriptions: Module[] = [
  // Not needed currently since module will not be supported in the near future
  // {
  //   module_id: 13,
  //   title: "Hire Surveyors",
  //   link: "https://docs.google.com/document/d/1p4KxhkmCBHnvV9nQfgV7qP8UA_lsC4VPRu2aJ3uFAjQ/edit?usp=sharing",
  //   description:
  //     "<ul><li>Track candidates by attributes like geography and gender</li><li>Generate offer letters</li><li>Note: This feature runs on Google sheets</li></ul>",
  //   icon: UsergroupAddOutlined,
  // },
  {
    module_id: 9,
    title: "Assignments",
    link: "https://docs.surveystream.idinsight.io/assignments",
    description:
      "<ul><li>Choose one or more targets to assign to an enumerator.</li><li>Delegate assignment tasks to field supervisors using criteria like location, language or through manual mapping.</li><li>Mark surveyors as dropout to release their targets for reassignment to active surveyors.</li></ul>",
    icon: SwapOutlined,
  },
  {
    module_id: 15,
    title: "Emails",
    link: "https://docs.surveystream.idinsight.io/email_automation",
    description:
      "<ul><li>Manage surveyor communications with scheduled emails containing personalized information like assignments or reimbursement details.</li><li>Add and edit email schedules.</li><li>Multilingual support.</li></ul>",
    icon: MailOutlined,
  },
  {
    module_id: 10,
    title: "Productivity Dashboard",
    link: "https://docs.surveystream.idinsight.io/dashboards",
    description:
      "<ul><li>Standard productivity metrics are provided that can be filtered and/or aggregated by dimensions like location, enumerator or gender.</li><li>Dashboards can be customized by users (requires SQL knowledge) or by the SurveyStream team (staff costs apply)</li></ul>",
    icon: PieChartOutlined,
  },
  {
    module_id: 11,
    title: "Data Quality Dashboard",
    link: "https://docs.surveystream.idinsight.io/dashboards",
    description:
      "<ul><li>Easily configure high frequency checks (HFCs) to validate incoming survey data.</li><li>Standard data quality metrics are provided that can be filtered and/or aggregated by dimensions like location, enumerator or gender.</li><li>Dashboards can be customized by users (requires SQL knowledge) or by the SurveyStream team (staff costs apply).</li></ul>",
    icon: FileSearchOutlined,
  },
  {
    module_id: 12,
    title: "Media Audits",
    link: "https://docs.surveystream.idinsight.io/media_audits",
    description:
      "<ul><li>Make audio and photo files from SurveyCTO and Exotel easily available for auditing purposes.</li></ul>",
    icon: AudioOutlined,
  },
  {
    module_id: 18,
    title: "Admin Forms",
    link: "https://docs.surveystream.idinsight.io/admin_forms",
    description:
      "<ul><li>Integrate SurveyCTO forms that your team uses for administrative purposes like fuel consumption logs or sharing account details.</li><li>Use with the Media Audits feature to easily review photos uploaded by enumerators.</li></ul>",
    icon: FormOutlined,
  },
];
