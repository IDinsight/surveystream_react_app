import { Table } from "antd";
import styled from "styled-components";

export const SurveyorsTable = styled(Table)`
  & th {
    color: #434343 !important;
    background-color: #f5f5f5 !important;
    height: 40px;
  }
  & th::before {
    background-color: #f0f0f0 !important;
  }
`;
