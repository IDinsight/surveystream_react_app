import Header from "../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  MainWrapper,
} from "../../shared/Nav.styled";

import SideMenu from "./SideMenu";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { fetchSurveyConfig } from "../../redux/surveyConfig/surveyConfigActions";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";

function SurveyConfiguration() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { survey_uid } = useParams<{ survey_uid: string }>();
  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };
  const surveyConfigs = useAppSelector(
    (state: RootState) => state.reducer.surveyConfig.surveyConfigs
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.surveyConfig.loading
  );
  const fetchData = async () => {
    if (survey_uid) {
      await dispatch(fetchSurveyConfig({ survey_uid: survey_uid }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);
  if (isLoading) {
    return <FullScreenLoader></FullScreenLoader>;
  }

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title>Survey configuration</Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <MainWrapper>{surveyConfigs}</MainWrapper>
      </div>
    </>
  );
}

export default SurveyConfiguration;
