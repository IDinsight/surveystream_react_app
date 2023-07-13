import styled, { css } from "styled-components";
import Group from "antd/es/checkbox/Group";

export const ModuleQuestionnaireWrapper = styled.div`
  display: flex;
  margin-left: 30px;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #fafafa;
  flex-direction: column;
  ${css`
    font-family: "Inter", sans-serif;
  `}
`;

export const CheckboxGroup = styled(Group)`
  && .ant-checkbox-group-item {
    font-family: "Inter", sans-serif;
    font-size: 14px;
    line-height: 22px;
    color: #434343;
  }

  && .ant-checkbox-wrapper {
    margin-right: 24px;
  }

  && span.ant-checkbox {
    align-self: auto !important;
    top: 0.2rem !important;
  }
`;
