import styled, { css } from "styled-components";
import { FaInfoCircle, FaQuestionCircle } from "react-icons/fa";

export const SideMenuWrapper = styled.div`
  background-color: #fff;
  width: 250px;
  height: 75vh;
  position: relative;
  left: 0;
  z-index: 1;
  overflow-x: hidden;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

export const MenuItem = styled.a`
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
    background-color: #f0f5ff;
    color: #2f54eb;
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

export const InfoIcon = styled(FaInfoCircle)`
  width: 1.25rem;
  height: 1.25rem;
`;

export const QuestionIcon = styled(FaQuestionCircle)`
  width: 1.25rem;
  height: 1.25rem;
`;
