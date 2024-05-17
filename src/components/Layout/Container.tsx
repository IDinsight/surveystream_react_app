import React, { ReactNode } from "react";
import { NavWrapper, Title } from "../../shared/Nav.styled";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { Wrapper } from "./Container.styled";
import { useNavigate, useParams } from "react-router-dom";
import HandleBackButton from "../HandleBackButton";

interface IContainer {
  children?: ReactNode;
}

const Container: React.FC<IContainer> = ({ children }) => {
  const navigate = useNavigate();
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  return (
    <>
      <Wrapper>
        <HandleBackButton></HandleBackButton>

        <Title>
          {(() => {
            const activeSurveyData = localStorage.getItem("activeSurvey");
            return (
              activeSurvey?.survey_name ||
              (activeSurveyData && JSON.parse(activeSurveyData).survey_name) ||
              ""
            );
          })()}
        </Title>
      </Wrapper>
    </>
  );
};

export default Container;
