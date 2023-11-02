import { Breadcrumb, Table } from "antd";
import styled from "styled-components";

export const TargetReuploadFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Inter", sans-serif;
`;

export const DescriptionContainer = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
  margin-top: 6px;
`;

export const ErrorTable = styled(Table)`
  margin-bottom: 68px;
  & th {
    color: #820014 !important;
    background-color: #ffccc7 !important;
    height: 40px;
  }
  & th::before {
    background-color: #ff7875 !important;
  }

  & tr:nth-child(odd) td {
    background-color: #ffffff;
  }
  & tr:nth-child(odd):hover td {
    background-color: #ffffff !important;
  }

  & tr:nth-child(even) td {
    background-color: #fff1f0;
  }
  & tr:nth-child(even):hover td {
    background-color: #fff1f0 !important;
  }
`;

export const StyledBreadcrumb = styled(Breadcrumb)`
  margin-top: 7px;
  margin-bottom: 18px;
  .ant-breadcrumb-link {
    color: rgba(0, 0, 0, 0.45) !important;
    font-weight: normal;
  }

  .active {
    color: #2f54eb !important;
  }
`;

export const Mandatory = styled.span`
  color: #f5222d !important;
`;
