import styled from "styled-components";
import { Table } from "antd";

export const TargetsHomeFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Inter", sans-serif;
  position: relative;
  height: 850px;
`;

export const TargetsTable = styled(Table)`
  overflow: auto;
  width: 90%;
  & th {
    color: #434343 !important;
    background-color: #feffe6 !important;
    height: 40px;
    font-weight: 400 !important;
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
`;
