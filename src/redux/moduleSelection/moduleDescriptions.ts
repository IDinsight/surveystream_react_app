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
    title: "Assign targets to surveyors",
    link: "https://docs.google.com/document/d/19tgToMhODhYouO5hzWdDqUZKugrXXlrQnADVUU-IIBM/edit",
    description:
      "<ul><li>Assign targets to enumerators</li><li>Rebalance targets, handle surveyor drop-outs and perform reassignments</li><li>Communicate assignments to enumerators via emails with multi-language support</li></ul>",
    icon: SendOutlined,
  },
  {
    module_id: 15,
    title: "Assignments column configuration",
    link: "",
    description: "<ul><li>Configure assignments columns/li></ul>",
    icon: FileSearchOutlined,
  },
  {
    module_id: 14,
    title: "Emails",
    link: "",
    description: "<ul><li>Configure emails to enumerators</li></ul>",
    icon: FileSearchOutlined,
  },

  {
    module_id: 12,
    title: "Media (Audio/Photo) audits",
    link: "https://docs.google.com/document/d/1yf8hV-eC1mOgAAzwBFMIv3B_V_6RHuZFvrt0NpoZUNE/edit#heading=h.p9bv54vbzw1p",
    description:
      "<ul><li>Assign audio recordings for audits</li><li>Note: This feature runs on Google sheets</li></ul>",
    icon: FileSearchOutlined,
  },
  {
    module_id: 10,
    title: "Track productivity",
    link: "https://docs.google.com/document/d/1vG09sa1rdntl1XZgfKmXcWBzcEhqJcsj_KAtn4kfABw/edit?usp=sharing",
    description:
      "<ul><li>Define productivity metrics to track</li><li>Choose your platform for productivity tracking: Superset or Google Sheets</li></ul>",
    icon: PieChartOutlined,
  },
  {
    module_id: 11,
    title: "Track data quality",
    link: "https://docs.google.com/document/d/1tfLmq66S9Xkkfvztd2AvlKQp6FLbDZswxtZQrpU97qI/edit?usp=sharing",
    description:
      "<ul><li>Set up data quality tracking based on rule-based checks</li><li>Choose your platform for data quality tracking: Superset or Google Sheets</li></ul>",
    icon: UnorderedListOutlined,
  },
  {
    module_id: 12,
    title: "Media (Audio/Photo) audits",
    link: "https://docs.google.com/document/d/1yf8hV-eC1mOgAAzwBFMIv3B_V_6RHuZFvrt0NpoZUNE/edit#heading=h.p9bv54vbzw1p",
    description:
      "<ul><li>Assign audio recordings or photos for audits</li><li>Note: This feature runs on Google sheets</li></ul>",
    icon: FileSearchOutlined,
  },
];
