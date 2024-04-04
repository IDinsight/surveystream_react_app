import { Input, Table } from "antd";
import styled, { css } from "styled-components";

export const BodyWrapper = styled.div`
  background: #fafafa;
  min-height: calc(100vh - 114px);
  font-family: "Lato", sans-serif;
`;

export const MainContainer = styled.div`
  padding-top: 50px;
  padding-left: 96px;
  padding-right: 96px;
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

export const SearchBox = styled(Input.Search)`
  & button {
    background-color: #2f54eb;
    font-family: "Lato", sans-serif;
  }
`;
