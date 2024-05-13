import { Button } from "antd";
import styled from "styled-components";

export const LoginBtn = styled(Button)`
  background-color: #597ef7;
  color: white;
  border-radius: 4px !important;
  min-width: 94px !important;

  &:hover {
    background-color: #2f54eb;
    color: white !important;
  }
`;

export const ContactUsBtn = styled(Button)`
  border-radius: 4px !important;
  margin-left: 25px;

  &:hover {
    color: #2f54eb !important;
    border-color: #2f54eb !important;
  }
`;
