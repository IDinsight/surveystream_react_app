import styled, { createGlobalStyle } from "styled-components";
import { Button } from "antd";
import { geekblue } from "@ant-design/colors";

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Lato', sans-serif;
  }
`;

export const PurplePrimaryButton = styled(Button)`
  background-color: ${geekblue[4]};
  &:hover:enabled {
    background-color: ${geekblue[5]} !important;
  }
`;

export const DescriptionText = styled.p`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
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
