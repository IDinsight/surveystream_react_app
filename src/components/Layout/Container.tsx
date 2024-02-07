import React, { ReactNode } from "react";
import { BackArrow, BackLink } from "../../shared/Nav.styled";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { Title, Wrapper } from "./Container.styled";

interface IContainer {
  children?: ReactNode;
}

const Container: React.FC<IContainer> = ({ children }) => {
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  return (
    <>
      <Wrapper>
        <BackLink onClick={() => console.log("Back")}>
          <BackArrow />
        </BackLink>
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
