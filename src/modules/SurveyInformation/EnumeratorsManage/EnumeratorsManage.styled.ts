import styled from "styled-components";
import { Table } from "antd";

export const EnumeratorsManageFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Inter", sans-serif;
  position: relative;
  height: 850px;
`;

export const EnumeratorsTable = styled(Table)`
  & th {
    color: #434343 !important;
    background-color: #fff0f6 !important;
    height: 40px;
  }
  & th::before {
    background-color: #595959 !important;
  }
  & .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #fff0f6;
    border-color: #f759ab;
  }
  & .ant-checkbox-checked .ant-checkbox-inner::after {
    border-color: #9e1068;
  }
`;
