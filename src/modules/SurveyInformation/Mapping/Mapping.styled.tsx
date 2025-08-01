import { Table, Button } from "antd";
import styled from "styled-components";
import { CustomBtn } from "../../../shared/Global.styled";

export const BodyContainer = styled.div`
  padding: 48px;
  padding-top: 18px;
`;

export const MappingWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-top: 10px;
  padding-left: 50px;
  padding-right: 50px;
  font-family: "Lato", sans-serif;
  position: relative;
  min-height: 550px;
  width: 70%;
`;

export const FormItemLabel = styled.p`
  color: "#434343",
  font-size: 14px,
  line-height: 22px,
`;

export const ResetButton = styled(CustomBtn)``;

export const DeleteButton = styled(Button)`
  &:hover {
    color: red !important;
  }
`;

export const MappingTable = styled(Table)`
  margin-bottom: 30px;
  margin-top: 0px;
  width: 100%;
  & th {
    color: #434343 !important;
    background-color: #d6e4ff !important;
    height: 40px;
    font-family: "Lato", sans-serif;
  }
  & th::before {
    background-color: #595959 !important;
  }
  & td {
    font-family: "Lato", sans-serif;
  }
`;
