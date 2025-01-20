import { Button, Table } from "antd";
import styled from "styled-components";

export const TargetStatusFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Lato", sans-serif;
`;

export const TextHeading = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #000;
`;

export const BodyContainer = styled.div`
  display: flex;
  align-items: "center";
  margin-left: auto;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const EditingModel = styled.div`
  height: 100%;
  background: white;
  position: absolute;
  right: 0;
  width: 520px;
  top: 70px;
  padding: 40px 60px;
  border: 1px solid #f0f0f0;
  font-family: "Lato", sans-serif;
`;

export const FormItemLabel = styled.p`
  color: "#434343",
  font-size: 14px,
  line-height: 22px,
    font-family: "Lato", sans-serif;

`;

export const CustomBtn = styled(Button)`
  background-color: #2f54eb;
  color: white;
  border-radius: 8px !important;
  min-width: 94px !important;
  font-family: "Lato", sans-serif;

  &:hover {
    background-color: #2f54eb !important;
    color: white !important;
  }
`;

export const TargetMappingTable = styled(Table)`
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
    font-family: "Lato", sans-serif;
  }
  margin-right: 80px;
`;
