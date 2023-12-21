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
