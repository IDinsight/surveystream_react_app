import { Input, Steps, Table, Tabs } from "antd";
import styled from "styled-components";

export const CustomTab = styled(Tabs)`
  .ant-tabs-nav::before {
    border: none;
  }
`;

export const SearchBox = styled(Input.Search)`
  & button {
    background-color: #2f54eb;
    font-family: "Lato", sans-serif;
  }
`;

export const AssignmentsSteps = styled(Steps)`
  & .ant-steps-item-active .ant-steps-item-icon {
    background-color: #2f54eb;
    border-color: #2f54eb;
  }
  & .ant-steps-item-finish .ant-steps-item-icon {
    background-color: #434343;
  }

  & .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
    color: #ffffff;
  }
`;

export const FormItemLabel = styled.p`
  color: "#434343",
  font-size: 14px,
  line-height: 22px,
`;
