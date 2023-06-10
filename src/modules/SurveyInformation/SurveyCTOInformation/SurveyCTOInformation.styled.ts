import { Checkbox, Form, Tooltip } from "antd";
import styled, { css } from "styled-components";

export const SCTOInformationFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Inter", sans-serif;
`;

export const DescriptionText = styled.p`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
`;

export const TwoColumnForm = styled(Form)`
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

export const StyledTooltip = styled(Tooltip)`
  & .ant-tooltip-inner {
    background-color: #061178;
    color: white;
  }
`;

export const CheckboxSCTO = styled(Checkbox)`
  margin-inline-start: 0 !important;
  font-family: "Inter", sans-serif;
  color: #434343;
`;
