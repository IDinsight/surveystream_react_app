import { Button, Form, Input, Table, Tooltip } from "antd";
import styled, { css } from "styled-components";

export const BodyWrapper = styled.div`
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

export const MainContainer = styled.div`
  margin-top: 50px;
  margin-left: 96px;
  margin-right: 96px;
`;

export const DescriptionText = styled.p`
  color: #262626;
  font-family: "Lato", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  margin-top: 0;
`;

export const UsersTable = styled(Table)`
  margin-bottom: 68px;
  width: 100%;
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
`;

export const RolesTable = styled(Table)`
  margin-bottom: 68px;
  width: 100%;
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
`;

export const SearchBox = styled(Input.Search)`
  & button {
    background-color: #2f54eb;
    font-family: "Lato", sans-serif;
  }
`;

export const StyledTooltip = styled(Tooltip)`
  & .ant-tooltip-inner {
    background-color: #061178;
    color: white;
  }
`;

export const SurveyRoleHierarchyFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Lato", sans-serif;
`;

export const SurveyRoleHierarchyDescriptionText = styled.p`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
`;

export const SelectItem = styled(Form.Item)`
  & label {
    width: 140px;
  }
`;

export const CustomBtn = styled(Button)`
  background-color: #2f54eb;
  color: white;
  border-radius: 8px !important;
  min-width: 94px !important;

  &:hover {
    background-color: #2f54eb !important;
    color: white !important;
  }
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
