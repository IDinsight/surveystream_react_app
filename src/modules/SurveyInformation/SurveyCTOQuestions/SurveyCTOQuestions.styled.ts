import { Button, Form } from "antd";
import styled from "styled-components";

export const SCTOQuestionsButton = styled(Button)`
  margin-top: 20px;
  background-color: #2f54eb;
  color: #fff;
  font-family: "Lato", sans-serif;
  &:hover {
    border: 1px solid #2f54eb;
    background-color: #fff;
    color: #2f54eb;
  }
`;

export const QuestionsForm = styled(Form)`
  width: 50%;
  margin-top: 20px;
  font-family: "Lato", sans-serif;
  margin-bottom: 40px;
`;

export const QuestionsFormTitle = styled.div`
  margin: 10px;
  margin-bottom: 50px;
`;

export const SCTOLoadErrorArea = styled.div`
  padding-right: 48px;
`;
