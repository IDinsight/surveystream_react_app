import { Button } from "antd";
import styled from "styled-components";

const NavMenu = styled.div`
  display: flex;
`;

const NavMenuItem = styled.div`
  min-width: 32px;
`;

const StyledButton = styled(Button)`
  && {
    background-color: #2b6cb0; // Replace with your desired color
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
