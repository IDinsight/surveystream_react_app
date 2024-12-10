import { Form, Button } from "antd";
import styled, { css } from "styled-components";

export const StyledFormItem = styled(Form.Item)`
  flex-direction: column;
  display: flex;
  width: 100%;
  margin-bottom: 15px;

  label {
    width: 100%;
    display: block;
  }

  & .ant-input {
    width: 100%;
    display: block;
    font-family: "Lato", sans-serif;
  }
  & .ant-checkbox-group {
    width: 50vw;
    display: flex;
    flex-wrap: wrap;
  }
  & .ant-checkbox-wrapper {
    width: 10vw;
    display: flex;
    margin-bottom: 20px;
  }

  & .ant-checkbox-wrapper .ant-checkbox-input {
    width: 100%;
    float: left;
    display: inline-block;
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
