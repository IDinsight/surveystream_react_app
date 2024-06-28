import { Table } from "antd";
import styled from "styled-components";

export const ManualTriggersTable = styled(Table)`
  margin-bottom: 68px;
  .ant-table-thead > tr > th {
    position: sticky;
    top: 0;
    z-index: 1;
    color: #434343 !important;
    background-color: #d6e4ff !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }

  .ant-table-tbody > tr:hover > td {
    background: #d6e4ff;
  }
  & th::before {
    background-color: #595959 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }

  .custom-card {
    padding: 8px;
    border: 1px solid #d6e4ff;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .section-content {
    margin-bottom: 12px;
  }

  .section-separator {
    border-top: 1px solid #e8e8e8;
    margin: 12px 0;
  }
`;
