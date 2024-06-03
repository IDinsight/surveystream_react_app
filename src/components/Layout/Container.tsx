import React, { ReactNode, useEffect } from "react";
import { Title } from "../../shared/Nav.styled";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { Wrapper } from "./Container.styled";
import HandleBackButton from "../HandleBackButton";
import { useParams } from "react-router-dom";
import { fetchSurveys } from "../../redux/surveyList/surveysActions";
import { setActiveSurvey } from "../../redux/surveyList/surveysSlice";

interface IContainer {
  children?: ReactNode;
}

const Container: React.FC<IContainer> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  useEffect(() => {
    if (survey_uid && !activeSurvey) {
      // fetch survey list
      dispatch(fetchSurveys()).then((surveyList) => {
        // find the survey info
        const surveyInfo = surveyList.payload.find(
          (survey: any) => survey.survey_uid === parseInt(survey_uid)
        );

        // set the active survey
        dispatch(
          setActiveSurvey({ survey_uid, survey_name: surveyInfo.survey_name })
        );
      });
    }
  }, [survey_uid]);

  return (
    <>
      <Wrapper>
        <HandleBackButton />
        <Title>{activeSurvey?.survey_name}</Title>
        {children}
      </Wrapper>
    </>
  );
};

export default Container;
