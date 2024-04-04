import { Button } from "antd";
import styled from "styled-components";
export const LoginBtn = styled(Button)`
  background-color: #597ef7;
  color: white;
  border-radius: 4px !important;
  min-width: 94px !important;
  font-family: "Lato", sans-serif;

  &:hover {
    background-color: #2f54eb;
    color: white !important;
  }
`;

export const ContactUsBtn = styled(Button)`
  border-radius: 4px !important;
  margin-left: 25px;
  font-family: "Lato", sans-serif;

  &:hover {
    color: #2f54eb !important;
    border-color: #2f54eb !important;
  }
`;

const NavMenu = styled.div`
  display: flex;
`;

const NavMenuItem = styled.div`
  min-width: 32px;
`;

const StyledButton = styled(Button)`
  && {
    background-color: #2f54eb;
    border-radius: 4px;
    min-width: 94px;
  }
`;

const LandingPageContainer = styled.div`
  display: flex;
  height: 568px;
  padding: 100px 180px 0 88px;
`;

const TextContainer = styled.div`
  width: 50%;
  padding-right: 30px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export {
  NavMenu,
  NavMenuItem,
  StyledButton,
  LandingPageContainer,
  TextContainer,
  ImageContainer,
};
