import { Spin } from "antd";
import { createGlobalStyle } from "styled-components";
import { Loader, LoaderText, LoaderWrap } from "./FullScreenLoader.styled";
import PropTypes from "prop-types";

const GlobalStyle = createGlobalStyle`
  :where(.css-dev-only-do-not-override-1e3x2xa).ant-spin-lg .ant-spin-dot i {
    width: 35px;
    height: 35px;
  }
  :where(.css-dev-only-do-not-override-1e3x2xa).ant-spin-lg .ant-spin-dot {
    font-size: 70px;
  }
  :where(.css-dev-only-do-not-override-1e3x2xa).ant-spin-spinning .ant-spin-dot-item {
    background-color: rgba(47, 84, 235, 0.5);
  }
  
  :where(.css-dev-only-do-not-override-1e3x2xa).ant-spin-spinning .ant-spin-dot-item:nth-child(1) {
    background-color: rgba(47, 84, 235, 0.3);
  }
  
  :where(.css-dev-only-do-not-override-1e3x2xa).ant-spin-spinning .ant-spin-dot-item:nth-child(2) {
    background-color: rgba(47, 84, 235, 0.6);
  }
  
  :where(.css-dev-only-do-not-override-1e3x2xa).ant-spin-spinning .ant-spin-dot-item:nth-child(3) {
    background-color: rgba(47, 84, 235, 1.0);
  }
`;

const FullScreenLoader = ({ loadScreenText = "Loading" }) => {
  return (
    <LoaderWrap>
      <Loader>
        <GlobalStyle />
        <Spin size="large" />
      </Loader>
      <LoaderText>{loadScreenText}</LoaderText>
    </LoaderWrap>
  );
};
FullScreenLoader.propTypes = {
  loadScreenText: PropTypes.string,
};

export default FullScreenLoader;
