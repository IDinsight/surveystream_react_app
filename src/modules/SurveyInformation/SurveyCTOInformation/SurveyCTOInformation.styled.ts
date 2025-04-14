import { Checkbox, Form, Tooltip } from "antd";
import styled, { css } from "styled-components";

export const SCTOInformationFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  padding-bottom: 23px;
  font-family: "Lato", sans-serif;
`;

export const TwoColumnForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledFormItem = styled(Form.Item)`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 15px;

  label {
    width: 100%;
    display: block;
  }

  .ant-input {
    width: 100%;
    display: block;
    font-family: "Lato", sans-serif;
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
    font-family: "Lato", sans-serif;
  }

  && .ant-form-item-control {
    line-height: 1;
    display: block;
  }
`;

export const StyledTooltip = styled(Tooltip)`
  & .ant-tooltip-inner {
    background-color: #061178;
    color: white;
  }
`;

export const CheckboxSCTO = styled(Checkbox)`
  margin-inline-start: 0 !important;
  font-family: "Lato", sans-serif;
  color: #434343;

  & .ant-checkbox-input {
    float: left;
    width: auto !important;
    display: inline-block;
  }

  & span {
    float: left;
  }
`;
