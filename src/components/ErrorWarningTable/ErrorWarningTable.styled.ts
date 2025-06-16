import { Table } from "antd";
import styled from "styled-components";
export const ErrorTable = styled(Table)`
  margin-bottom: 53px;
  margin-right: 80px;
  & th {
    color: #820014 !important;
    background-color: #ffccc7 !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #ff7875 !important;
  }

  & tr:nth-child(odd) td {
    background-color: #ffffff;
  }
  & tr:nth-child(odd):hover td {
    background-color: #ffffff !important;
  }

  & tr:nth-child(even) td {
    background-color: #fff1f0;
  }
  & tr:nth-child(even):hover td {
    background-color: #fff1f0 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;

export const WarningTable = styled(Table)`
  margin-bottom: 53px;
  margin-right: 80px;
  & th {
    color: #873800 !important;
    background-color: #ffe7ba !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #ffc069 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;
