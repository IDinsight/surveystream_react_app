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
    link: "https://docs.google.com/document/d/1p4KxhkmCBHnvV9nQfgV7qP8UA_lsC4VPRu2aJ3uFAjQ/edit?usp=sharing",
    description:
      "<ul><li>This feature runs on Google sheets</li><li>Track candidates [by geography, gender etc]</li><li>Generate offer letters</li></ul>",
    icon: UsergroupAddOutlined,
  },
  {
    module_id: 9,
    title: "Assign targets to enumerators",
    link: "https://docs.google.com/document/d/19tgToMhODhYouO5hzWdDqUZKugrXXlrQnADVUU-IIBM/edit",
    description:
      "<ul><li>Assign targets to enumerators on SurveyStream web app</li><li> Rebalance targets, handle surveyor drop-outs and perform reassignments </li><li> Communicate assignments to enumerators via emails</li><li> Configure templates, option available to use local languages</li><li> Schedule the emails to be sent as per the requirements of your data collection activity</li></ul>",
    icon: SendOutlined,
  },
  {
    module_id: 10,
    title: "Track productivity",
    link: "https://docs.google.com/document/d/1vG09sa1rdntl1XZgfKmXcWBzcEhqJcsj_KAtn4kfABw/edit?usp=sharing",
    description:
      "<ul><li>Define productivity metrics and aggregation levels to track</li><li>Choose the platform for productivity tracking - Superset or Google Sheets</li></ul>",
    icon: PieChartOutlined,
  },
  {
    module_id: 11,
    title: "Track data quality",
    link: "https://docs.google.com/document/d/1tfLmq66S9Xkkfvztd2AvlKQp6FLbDZswxtZQrpU97qI/edit?usp=sharing",
    description:
      "<ul><li>Setup data quality checks based on logic, missing value, constraint, outliers etc</li><li>Choose the platform for data quality tracking - Superset or Google Sheets</li></ul>",
    icon: UnorderedListOutlined,
  },
  {
    module_id: 12,
    title: "Audit audio",
    link: "https://docs.google.com/document/d/1yf8hV-eC1mOgAAzwBFMIv3B_V_6RHuZFvrt0NpoZUNE/edit#heading=h.p9bv54vbzw1p",
    description:
      "<ul><li>Assign audios for audits </li><li>Google sheets based feature</li></ul>",
    icon: FileSearchOutlined,
  },
  {
    module_id: 14,
    title: "Audit photo",
    link: "https://docs.google.com/document/d/1D1mohkcPn4RfZ8swaQXno6jnxyW1H4Fv_aboy6f19SY/edit",
    description:
      "<ul><li>Assign photos for audits </li><li>Google sheets based feature</li></ul>",
    icon: FileSearchOutlined,
  },
];
