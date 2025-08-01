import { Button } from "antd";
import styled from "styled-components";

export const DeleteBtn = styled(Button)`
  margin-top: 24px;
  margin-left: 12px;
  &:hover {
    background-color: white !important;
    color: red !important;
  }
`;

export const OutputsBtn = styled(Button)`
  margin-top: 24px;
  margin-left: 12px;
  &:hover {
    background-color: white !important;
    color: green !important;
  }
`;

export const IconText = styled.span`
  margin-left: 6px;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`;
