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

export const StyledFormItem = styled(Form.Item)`
  flex-direction: column;
  display: flex;
  width: 100%;
  margin-bottom: 15px;

  label {
    width: 100%;
    display: block;
  }

  .ant-input {
    width: 100%;
    display: block;
    font-family: "Inter", sans-serif;
  }

  && {
    line-height: 1;
    flex-basis: 50%;
  }

  && .ant-form-item-label {
    line-height: 3;
    display: block;
  }

  && .ant-form-item-label > label {
    color: #4a4a4a;
    display: block;
    font-family: "Inter", sans-serif;
  }

  && .ant-form-item-control {
    line-height: 1;
    display: block;
  }
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
