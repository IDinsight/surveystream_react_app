import { Tooltip } from "antd";
import { Form } from "antd";
import styled from "styled-components";

export const DescriptionWrap = styled.div`
  font-family: "Inter", sans-serif;
`;

export const DescriptionTitle = styled.h2`
  margin: 0px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: rgb(38, 38, 38);
`;

export const DescriptionText = styled.p`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
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

export const StyledTooltip = styled(Tooltip)`
  & .ant-tooltip-inner {
    background-color: #061178;
    color: white;
  }
`;
