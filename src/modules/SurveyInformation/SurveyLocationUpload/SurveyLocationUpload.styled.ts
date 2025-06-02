import { Form } from "antd";
import styled from "styled-components";

export const SurveyLocationUploadFormWrapper = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding-left: 50px;
  padding-right: 50px;
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
  margin-top: 6px;
`;

export const IconText = styled.span`
  margin-left: 6px;
  font-family: "Lato", sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
`;

export const SelectItem = styled(Form.Item)`
  & label {
    width: 140px;
  }
`;
