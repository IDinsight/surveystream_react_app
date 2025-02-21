import { Button, Table } from "antd";
import styled from "styled-components";

export const DQFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  padding-right: 48px;
  font-family: "Lato", sans-serif;
`;

export const BodyContainer = styled.div`
  padding: 48px;
  padding-top: 12px;
`;

export const FormItemLabel = styled.p`
  color: "#434343",
  font-size: 14px,
  line-height: 22px,
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

export const DescriptionText = styled.span`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
`;

export const SCTOLoadErrorArea = styled.div`
  padding-right: 48px;
`;
