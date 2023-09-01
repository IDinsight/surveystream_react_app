import { Table } from "antd";
import styled from "styled-components";

export const EnumeratorsMapFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-right: 30px;
  padding-top: 23px;
  padding-bottom: 30px;
  font-family: "Inter", sans-serif;
`;

export const DescriptionContainer = styled.p`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
  margin-top: 38px;
  margin-right: 80px;
`;

export const DescriptionText = styled.p`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
`;

export const HeadingText = styled.p`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #434343;
`;

export const OptionText = styled.span`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #434343;
`;

export const ErrorTable = styled(Table)`
  margin-bottom: 53px;
  margin-right: 80px;
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
