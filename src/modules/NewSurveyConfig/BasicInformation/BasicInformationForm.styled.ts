import { Form } from "antd";
import styled, { css } from "styled-components";
import { Tooltip } from "antd";

export const BasicInformationFormWrapper = styled.div`
  display: flex;
  align-items: left;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  margin-left: 30px;
  flex-direction: column;
  color: #434343;
  ${css`
    font-family: "Inter", sans-serif;
  `}
`;

export const TwoColumnForm = styled(Form)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledTooltip = styled(Tooltip)`
  & .ant-tooltip-inner {
    background-color: #061178;
    color: white;
  }
`;
