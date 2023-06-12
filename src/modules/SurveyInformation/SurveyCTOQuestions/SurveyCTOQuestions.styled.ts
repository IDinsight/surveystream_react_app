import { Button } from "antd";
import styled from "styled-components";

export const SCTOQuestionsButton = styled(Button)`
  margin-top: 20px;
  background-color: #2f54eb;
  color: #fff;
  font-family: Inter;
  &:hover {
    border: 1px solid #2f54eb;
    background-color: #fff;
    color: #2f54eb;
  }
`;

export const QuestionsForm = styled.form`
  width: 50%;
  margin-top: 40px;
  font-family: Inter;
`;

export const QuestionsFormTitle = styled.div`
  margin: 10px;
  margin-bottom: 50px;
`;
