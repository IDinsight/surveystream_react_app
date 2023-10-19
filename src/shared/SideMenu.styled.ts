import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import {
  QuestionCircleOutlined,
  InfoCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

export const SideMenuWrapper = styled.div`
  background-color: #fff;
  min-width: 270px;
  height: 75vh;
  position: relative;
  left: 0;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

export const MenuAItem = styled.a`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #4f46e5;
  ${css`
    font-family: "Inter", sans-serif;
    font-weight: 200px;
    font-size: 14px;
    line-height: 22px;
    color: #262626;
  `}

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    color: #262626;
  }

  &.active {
    background-color: #f0f5ff;
    color: #2f54eb;
  }
`;
export const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #4f46e5;
  ${css`
    font-family: "Inter", sans-serif;
    font-weight: 200px;
    font-size: 14px;
    line-height: 22px;
    color: #262626;
  `}

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    color: #262626;
  }

  &.active {
    background-color: #f0f5ff;
    color: #2f54eb;
  }
`;
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
  border-radius: 50%;
  background-color: transparent;
`;

export const InfoIcon = styled(InfoCircleOutlined)`
  width: 1.5rem;
  height: 1.5rem;
`;

export const QuestionIcon = styled(QuestionCircleOutlined)`
  width: 1.5rem;
  height: 1.5rem;
`;

export const ListIcon = styled(UnorderedListOutlined)`
  width: 1.5rem;
  height: 1.5rem;
`;
