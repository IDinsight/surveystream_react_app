import { Table, Tag } from "antd";
import styled from "styled-components";

export const StyledTable = styled(Table)`
  margin-top: 15px;
  margin-bottom: 68px;
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
    height: 40px;
  }
  & th::before {
    background-color: #595959 !important;
  }
`;

export const StyledTag = styled(Tag)`
  font-size: 14px;
  font-family: "Lato";
`;
