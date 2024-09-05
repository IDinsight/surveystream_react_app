import { Button, Form, Input, Table } from "antd";
import styled, { css } from "styled-components";

export const BodyWrapper = styled.div`
  min-height: calc(100vh - 114px);
  flex: 1;
  background-color: #f5f5f5;
  padding: 30px;
  padding-left: 60px;
  padding-right: 60px;
  font-family: "Lato", sans-serif;
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
`;

export const RolesTable = styled(Table)`
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
`;

export const SearchBox = styled(Input.Search)`
  & button {
    background-color: #2f54eb;
    font-family: "Lato", sans-serif;
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
