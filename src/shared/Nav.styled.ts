import styled, { css } from "styled-components";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Input } from "antd";

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
  padding-bottom: 20px;
  font-family: "Lato", sans-serif;
  min-height: calc(100vh - 114px);
`;
export const SearchBox = styled(Input.Search)`
  & button {
    background-color: #2f54eb;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  height: 55px;
  padding-left: 24px;
  padding-right: 24px;
  border-top: 1px solid #00000026;
  border-bottom: 1px solid #00000026;
`;

export const TextHeading = styled.h1`
  color: #262626;
  font-family: "Lato", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`;
