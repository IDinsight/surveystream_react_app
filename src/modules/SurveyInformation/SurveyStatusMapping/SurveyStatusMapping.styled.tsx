import { Button } from "antd";
import styled from "styled-components";

export const TextHeading = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #000;
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
