import { Module } from "./types";
import {
  FileSearchOutlined,
  PieChartOutlined,
  SendOutlined,
  UnorderedListOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
// Assuming the module descriptions are stored in the `moduleDescriptions` array
export const moduleDescriptions: Module[] = [
  {
    module_id: 13,
    title: "Hire Enumerators",
    description:
      "<ul><li>This feature runs on Google sheets</li><li>Track candidates [by geography, gender etc]</li><li>Generate offer letters</li></ul>",
    icon: UsergroupAddOutlined,
  },
  {
    module_id: 9,
    title: "Assign targets to enumerators",
    description:
      "<ul><li>Assign targets to enumerators on SurveyStream web app</li><li> Rebalance targets, handle surveyor drop-outs and perform reassignments </li><li> Communicate assignments to enumerators via emails</li><li> Configure templates, option available to use local languages</li><li> Schedule the emails to be sent as per the requirements of your data collection activity</li></ul>",
    icon: SendOutlined,
  },
  {
    module_id: 10,
    title: "Track productivity",
    description:
      "<ul><li>Define productivity metrics and aggregation levels to track</li><li>Choose the platform for productivity tracking - Superset or Google Sheets</li></ul>",
    icon: PieChartOutlined,
  },
  {
    module_id: 11,
    title: "Track data quality",
    description:
      "<ul><li>Setup data quality checks based on logic, missing value, constraint, outliers etc</li><li>Choose the platform for data quality tracking - Superset or Google Sheets</li></ul>",
    icon: UnorderedListOutlined,
  },
  {
    module_id: 12,
    title: "Audit audio",
    description:
      "<ul><li>Assign audios for audits </li><li>Google sheets based feature</li></ul>",
    icon: FileSearchOutlined,
  },
  {
    module_id: 14,
    title: "Audit photo",
    description:
      "<ul><li>Assign photos for audits </li><li>Google sheets based feature</li></ul>",
    icon: FileSearchOutlined,
  },
];
