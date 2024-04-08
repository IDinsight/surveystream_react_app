import { Form } from "antd";
import styled from "styled-components";

export const SurveyLocationHierarchyFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 80px;
  padding-top: 23px;
  font-family: "Lato", sans-serif;
`;

export const DescriptionText = styled.p`
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #8c8c8c;
`;

export const SelectItem = styled(Form.Item)`
  & label {
    width: 140px;
  }
`;
