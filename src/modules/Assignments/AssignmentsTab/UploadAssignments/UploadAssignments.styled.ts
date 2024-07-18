import { Table } from "antd";
import styled from "styled-components";

export const DescriptionContainer = styled.p`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
  margin-top: 6px;
`;

export const ErrorTable = styled(Table)`
  margin-bottom: 68px;
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
