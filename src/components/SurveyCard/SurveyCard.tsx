import React from "react";
import { setActiveSurvey } from "../../redux/surveyList/surveysSlice";
import { useAppDispatch } from "../../redux/hooks";
import {
  StyledCardLink,
  CardContainer,
  Title,
  InfoContainer,
  InfoText,
} from "./SurveyCard.styled";

function SurveyCard({
  title,
  link,
  start,
  end,
  survey_uid,
  state,
  lastUpdatedAt,
}: {
  title: string;
  link: string;
  start?: string;
  end?: string;
  survey_uid: string;
  state: string; // Active, Draft , Past
  lastUpdatedAt?: string;
}) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setActiveSurvey({ survey_uid: survey_uid, survey_name: title }));
  };

  return (
    <StyledCardLink onClick={handleClick} to={link}>
      <CardContainer>
        <Title>{title}</Title>
        {state === "Active" || state === "Past" ? (
          <InfoContainer>
            <div>
              <p>Started on</p>
              <p>{start}</p>
            </div>
            <div>
              <p>Ending on</p>
              <p>{end}</p>
            </div>
          </InfoContainer>
        ) : (
          <InfoText>Last edited on {lastUpdatedAt}</InfoText>
        )}
      </CardContainer>
    </StyledCardLink>
  );
}

export default SurveyCard;
