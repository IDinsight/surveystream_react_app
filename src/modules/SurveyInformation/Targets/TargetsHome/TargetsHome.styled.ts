import styled from "styled-components";
import { Table } from "antd";

export const TargetsHomeFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-top: 10px;
  padding-left: 50px;
  padding-right: 50px;
  font-family: "Lato", sans-serif;
  position: relative;
  min-height: 550px;
  width: 70%;
`;

export const TargetsTable = styled(Table)`
  margin-bottom: 30px;
  margin-top: -60px;
  width: 100%;
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
    height: 40px;
    font-family: "Lato", sans-serif;
    width: 30px;
    white-space: nowrap;
  }
  & th::before {
    background-color: #595959 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
    white-space: nowrap;
  }

  .antd-table-custom-class thead th,
  .antd-table-custom-class tbody td {
    white-space: nowrap;
  }
`;
