import { Table } from "antd";
import styled from "styled-components";

export const SurveyorsTable = styled(Table)`
  & th {
    color: #434343 !important;
    background-color: #f5f5f5 !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #f0f0f0 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;
