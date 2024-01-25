import { Table } from "antd";
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

  & tbody tr:nth-child(odd) {
    background-color: transparent;
  }

  & tbody tr:nth-child(even) {
    background-color: #d6e4ff;
  }
`;
