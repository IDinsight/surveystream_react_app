import styled from "styled-components";
import { Table } from "antd";

export const TargetsHomeFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Lato", sans-serif;
  position: relative;
  min-height: 950px;
  width: 70%;
`;

export const TargetsTable = styled(Table)`
  overflow: auto;
  width: 90%;
  & th {
    color: #434343 !important;
    background-color: #feffe6 !important;
    height: 40px;
    font-weight: 400 !important;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #595959 !important;
  }
  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #feffe6;
    border-color: #434343;
  }
  & .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: #434343;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;
