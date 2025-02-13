import { Button, Table } from "antd";
import styled from "styled-components";

export const BodyContainer = styled.div`
  padding: 48px;
  padding-top: 18px;
`;

export const MappingWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  padding-right: 70px;
  font-family: "Lato", sans-serif;
  width: 65%;
`;

export const FormItemLabel = styled.p`
  color: "#434343",
  font-size: 14px,
  line-height: 22px,
`;

export const CustomBtn = styled(Button)<{ disabled?: boolean }>`
  background-color: ${({ disabled }) => (disabled ? "#d9d9d9" : "#2f54eb")};
  color: ${({ disabled }) => (disabled ? "#bfbfbf" : "white")};
  border-radius: 8px !important;
  min-width: 94px !important;

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? "#d9d9d9" : "#2f54eb"} !important;
    color: ${({ disabled }) => (disabled ? "#bfbfbf" : "white")} !important;
  }
`;

export const ResetButton = styled(Button)`
  &:hover {
    color: red !important;
    border-color: red !important;
  }
`;

export const DeleteButton = styled(Button)`
  &:hover {
    color: red !important;
  }
`;

export const MappingTable = styled(Table)`
  overflow: auto;
  width: 99%;
  margin-top: 0px;
  margin-bottom: 68px;
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
  }
  & th::before {
    background-color: #595959 !important;
  }
  & td {
  }
`;
