import { Table } from "antd";
import styled from "styled-components";

export const SchedulesTable = styled(Table)`
  margin-bottom: 68px;
  table-layout: auto;
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #595959 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
  & td:last-child {
    width: 80%;
  }
  & td:first-child {
    width: 10%;
  }
  .custom-card {
    padding: 8px;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .section-content {
    margin-bottom: 12px;
  }

  .section-separator {
    border-top: 1px solid #e8e8e8;
    margin: 12px 0;
  }
`;
