import { Input, Table, Tabs } from "antd";
import styled from "styled-components";

export const CustomTab = styled(Tabs)`
  .ant-tabs-nav::before {
    border: none;
  }
`;

export const SearchBox = styled(Input.Search)`
  & button {
    background-color: #2f54eb;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  height: 55px;
  padding-left: 48px;
  padding-right: 48px;
  border-top: 1px solid #00000026;
  border-bottom: 1px solid #00000026;
`;

export const TextHeading = styled.h1`
  color: #262626;
  font-family: "Lato", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`;
