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
