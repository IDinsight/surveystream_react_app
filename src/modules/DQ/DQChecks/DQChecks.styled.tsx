import { Button, Checkbox, Switch, Table } from "antd";
import styled from "styled-components";

export const DQFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 23px;
  font-family: "Lato", sans-serif;
`;

export const BodyContainer = styled.div`
  padding: 48px;
  padding-top: 18px;
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

export const DQChecksTable = styled(Table)`
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
    font-family: "Lato", sans-serif;
  }

  width: 80% !important;
`;

export const CustomLinkBtn = styled(Button)`
  color: #2f54eb;

  &:hover {
    color: #597ef7 !important;
  }

  &:disabled {
    color: rgba(0, 0, 0, 0.25) !important;
  }
`;

export const ChecksTable = styled(Table)`
  margin-top: 15px;
  margin-bottom: 68px;
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

  & .greyed-out-row,
  & .greyed-out-row .ant-table-cell-row-hover {
    background-color: #fff1f0 !important;
    color: red !important;
  }

  & .ant-table-row-selected.greyed-out-row > .ant-table-cell {
    background-color: #ffccc7 !important;
    color: red !important;
  }
`;

export const ChecksSwitch = styled(Switch)`
  &&.ant-switch-checked {
    background-color: #237804 !important;
  }
`;

export const CheckboxDQ = styled(Checkbox)`
  margin-inline-start: 0 !important;
  font-family: "Lato", sans-serif;
  color: #434343;

  & .ant-checkbox-input {
    float: left;
    width: auto !important;
    display: inline-block;
  }

  & span {
    float: left;
  }
`;
