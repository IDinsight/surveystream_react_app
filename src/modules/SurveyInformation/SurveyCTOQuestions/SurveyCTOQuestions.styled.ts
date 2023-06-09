import { Button } from "antd";
import styled from "styled-components";

export const DescriptionWrap = styled.div`
  font-family: "Inter", sans-serif;
`;

export const DescriptionTitle = styled.h2`
  font-size: 16px;
  color: #262626;
`;

export const DescriptionText = styled.p`
  font-size: 14px;
  color: #8c8c8c;
`;

export const SCTOQuestionsButton = styled(Button)`
  margin-top: 20px;
  background-color: #597ef7;
  color: #fff;
  font-family: Inter;

  &:hover {
    border: 1px solid #597ef7;
    background-color: #fff;
    color: #597ef7;
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
