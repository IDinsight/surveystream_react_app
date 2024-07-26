import styled from "styled-components";
import { Button } from "antd";

export const FooterWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  background-color: #fff;
  padding-bottom: 10px;
  border-top: 1px solid rgb(242, 242, 242);
  z-index: 9;
`;

export const SaveButton = styled(Button)`
  margin-top: 20px;
  margin-left: 315px;
  float: left;
  font-family: "Lato", sans-serif;
`;

export const ContinueButton = styled(Button)`
  margin: 20px;
  margin-left: 65%;
  background-color: #597ef7;
  color: #fff;
  font-family: "Lato", sans-serif;

  &:hover {
    border: 1px solid #597ef7;
    background-color: #fff;
    color: #597ef7;
  }
`;
