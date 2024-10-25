import { Table, Layout } from "antd";
import styled, { css } from "styled-components";
const { Sider } = Layout;

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

export const StyledSlider = styled(Sider)`
  .my-sider-button-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  }
  & .ant-menu-item {
    border-radius: 0;
    margin: 0;
    width: 100%;
    height: 48px;
    line-height: 48px;
  }
  & .ant-menu-item.ant-menu-item-selected {
    background-color: rgba(47, 84, 235, 0.1);
  }
  }
`;
