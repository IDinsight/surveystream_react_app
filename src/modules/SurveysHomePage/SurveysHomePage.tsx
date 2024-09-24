import { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { getDayMonth } from "../../utils/helper";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchSurveys } from "../../redux/surveyList/surveysActions";
import { RootState } from "../../redux/store";

import Header from "../../components/Header.OLD";
import Footer from "../../components/Footer";
import SurveyCard from "../../components/SurveyCard";

import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { Button, Result } from "antd";
import { performGetUserProfile } from "../../redux/auth/authActions";
import { setActiveSurvey } from "../../redux/surveyList/surveysSlice";
import NavItems from "../../components/NavItems.OLD";
import { GlobalStyle } from "../../shared/Global.styled";
import { StyledLink, NewSurveyCard, Text } from "./SurveysHome.styled";
import { Collapse } from "antd/lib";

function SurveysHomePage() {
  const dispatch = useAppDispatch();
  const surveys = useAppSelector((state: RootState) => state.surveys.surveys);
  const isLoading = useAppSelector((state: RootState) => state.surveys.loading);

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);

  const showError = useAppSelector((state: RootState) => state.surveys.error);
  const fetchData = async () => {
    let { user_uid } = userProfile;

    if (!user_uid) {
      const profile = await dispatch(performGetUserProfile());
      user_uid = profile.payload.user_uid;
    }

    await dispatch(fetchSurveys());
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const activeSurveys = surveys.filter((survey) => survey.state === "Active");
  const draftSurveys = surveys.filter((survey) => survey.state === "Draft");
  const pastSurveys = surveys.filter((survey) => survey.state === "Past");

  return (
    <>
      <GlobalStyle />

      {/* <Header items={NavItems} /> */}
      {isLoading ? (
        <>
          <FullScreenLoader></FullScreenLoader>
        </>
      ) : (
        <>
          {showError && (
            <Result
              status={showError.code}
              title={showError.code}
              subTitle={showError.error}
              extra={
                <Button
                  onClick={fetchData}
                  type="primary"
                  className="bg-geekblue-5 h-[40px]"
                  size="large"
                >
                  Reload Surveys
                </Button>
              }
            />
          )}
          {!showError && (
            <div
              className="pl-20 py-10 bg-gray-2"
              style={{ minHeight: "calc( 100vh - 158px)" }}
            >
              <Collapse
                ghost
                items={[
                  {
                    key: "1",
                    label: `Active surveys (${activeSurveys?.length})`,
                    children: (
                      <div id="surveys-active-items" className="flex flex-wrap">
                        {activeSurveys.map((survey) => (
                          <SurveyCard
                            survey_uid={survey.survey_uid.toString()}
                            key={survey.survey_uid}
                            link={`/survey-configuration/${survey.survey_uid.toString()}`}
                            title={survey.survey_name}
                            start={getDayMonth(survey.planned_start_date)}
                            end={getDayMonth(survey.planned_end_date)}
                            state="Active"
                          />
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: `Draft surveys (${draftSurveys?.length})`,
                    children: (
                      <div className="flex flex-wrap">
                        {userProfile.is_super_admin ||
                        userProfile.can_create_survey ? (
                          <StyledLink
                            onClick={() => {
                              dispatch(setActiveSurvey({}));
                              localStorage.setItem(
                                "activeSurvey",
                                JSON.stringify({})
                              );
                            }}
                            id="configure-new-survey-link"
                            to="/new-survey-config"
                            className="no-underline flex items-center"
                          >
                            <NewSurveyCard key="new_survey">
                              <PlusOutlined />
                              <Text>Configure new survey</Text>
                            </NewSurveyCard>
                          </StyledLink>
                        ) : null}
                        {draftSurveys.map((survey, index: number) => (
                          <div key={survey.survey_uid}>
                            <SurveyCard
                              title={survey.survey_name}
                              link={`/survey-configuration/${survey.survey_uid.toString()}`}
                              survey_uid={survey.survey_uid.toString()}
                              state="Draft"
                              lastUpdatedAt={getDayMonth(
                                survey.last_updated_at
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: "3",
                    label: `Past surveys (${pastSurveys?.length})`,
                    children: (
                      <div id="surveys-past-items" className="flex flex-wrap">
                        {pastSurveys.map((survey) => (
                          <SurveyCard
                            survey_uid={survey.survey_uid.toString()}
                            key={survey.survey_uid}
                            link={`/survey-configuration/${survey.survey_uid.toString()}`}
                            title={survey.survey_name}
                            start={getDayMonth(survey.planned_start_date)}
                            end={getDayMonth(survey.planned_end_date)}
                            state="Past"
                          />
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )}
          <Footer />
        </>
      )}
    </>
  );
}

export default SurveysHomePage;
