import React, { ReactNode } from "react";
import { BackArrow, BackLink } from "../../shared/Nav.styled";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { Title, Wrapper } from "./Container.styled";
import { useNavigate, useParams } from "react-router-dom";

interface IContainer {
  children?: ReactNode;
  title?: string;
}

const Container: React.FC<IContainer> = ({ children, title }) => {
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
        <BackLink
          onClick={() => navigate(`/survey-configuration/${survey_uid}`)}
        >
          <BackArrow />
        </BackLink>
        <Title>
          {(() => {
            if (title) {
              return title;
            }

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
