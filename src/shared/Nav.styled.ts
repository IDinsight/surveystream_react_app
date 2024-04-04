import styled, { css } from "styled-components";
import { ArrowLeftOutlined } from "@ant-design/icons";

export const NavWrapper = styled.nav`
  background-color: #fff;
  color: #ffffff;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #f5f5f5;
  box-shadow: 0px -1px 0px #f5f5f5;
`;

export const Title = styled.h1`
  font-size: 20px;
  margin: 0;

  ${css`
    font-family: "Lato", sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #262626;
  `}
`;

export const BackLink = styled.a`
  color: #434343;
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-right: 10px;
`;

export const BackArrow = styled(ArrowLeftOutlined)`
  margin-right: 5px;
`;

export const MainWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Lato", sans-serif;
`;
