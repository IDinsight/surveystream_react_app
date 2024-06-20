import { Button, Table } from "antd";
import styled from "styled-components";

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
