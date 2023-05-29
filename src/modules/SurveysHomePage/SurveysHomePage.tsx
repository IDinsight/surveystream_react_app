import { useEffect } from "react";
import { HomeFilled, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getDayMonth } from "../../utils/helper";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { fetchSurveys } from "../../redux/surveyList/surveysActions";
import { RootState } from "../../redux/store";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SurveyCard from "../../components/SurveyCard";

import "./SurveysHomePage.css";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { performGetUserProfile } from "../../redux/auth/authActions";
import { Result } from "antd";

const NavItems = () => {
  return (
    <div className="nav-menu flex">
      <div className="w-36 bg-geekblue-5">
        <HomeFilled className="flex items-center !text-base !text-gray-2" />
        <span className="!text-gray-2">Surveys</span>
      </div>
    </div>
  );
};

function SurveysHomePage() {
  const dispatch = useAppDispatch();
  const surveys = useAppSelector(
    (state: RootState) => state.reducer.surveys.surveys
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.surveys.loading
  );

  const showError = useAppSelector(
    (state: RootState) => state.reducer.surveys.error
  );

  useEffect(() => {
    const fetchData = async () => {
      const profile = await dispatch(performGetUserProfile());
      // get user_id here use it to load surveys
      const { user_uid } = profile.payload;

      await dispatch(fetchSurveys({ user_uid: user_uid }));
    };

    fetchData();
  }, [dispatch]);

  const activeSurveys = surveys.filter((survey) => survey.state === "Active");
  const draftSurveys = surveys.filter((survey) => survey.state === "Draft");
  const pastSurveys = surveys.filter((survey) => survey.state === "Past");

  return (
    <>
      <Header items={NavItems} />
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
                <Link to="/new-survey-config" className="no-underline">
                  <PlusOutlined className="!text-base text-gray-9" />
                  <span className="ml-3 font-inter font-medium text-base text-gray-10">
                    Configure new survey
                  </span>
                </Link>
              }
            />
          )}
          {!showError && (
            <div className="pl-20 py-10 bg-gray-2">
              <div id="surveys-active" className="mb-10">
                <p className="font-inter font-medium text-base text-gray-7">
                  Active surveys
                </p>
                <div id="surveys-active-items" className="flex flex-wrap">
                  {activeSurveys.map((survey) => (
                    <SurveyCard
                      key={survey.survey_uid}
                      link={survey.survey_uid.toString()}
                      title={survey.survey_name}
                      start={getDayMonth(survey.planned_start_date)}
                      end={getDayMonth(survey.planned_end_date)}
                    />
                  ))}
                </div>
              </div>
              <div id="surveys-draft" className="mb-10">
                <p className="font-inter font-medium text-base text-gray-7">
                  Draft surveys
                </p>
                <div className="flex">
                  {draftSurveys.map((survey) => (
                    <div
                      key={survey.survey_uid}
                      className="mt-4 mr-[22px] p-4 w-[270px] h-[84px] bg-gray-1 rounded-sm shadow-[0_0_4px_rgba(0,0,0,0.08)]"
                    >
                      <Link
                        to={survey.survey_uid.toString()}
                        className="font-inter font-medium text-base text-geekblue-7 no-underline h-12 inline-block"
                      >
                        {survey.survey_name}
                      </Link>
                      <p className="m-0 mt-2 font-inter font-normal text-xs leading-5 text-gray-7">
                        Last edited on {survey.last_updated_at}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-center items-center mt-4 w-[270px] bg-gray-1 rounded-sm shadow-[0_0_4px_rgba(0,0,0,0.08)]">
                    <Link to="/new-survey-config" className="no-underline">
                      <PlusOutlined className="!text-base text-gray-9" />
                      <span className="ml-3 font-inter font-medium text-base text-gray-10">
                        Configure new survey
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              <div id="surveys-past">
                <p className="font-inter font-medium text-base text-gray-7">
                  Past surveys
                </p>
                <div id="surveys-past-items" className="flex flex-wrap">
                  {pastSurveys.map((survey) => (
                    <SurveyCard
                      key={survey.survey_uid}
                      link={survey.survey_uid.toString()}
                      title={survey.survey_name}
                      start={getDayMonth(survey.planned_start_date)}
                      end={getDayMonth(survey.planned_end_date)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <Footer />
        </>
      )}
    </>
  );
}

export default SurveysHomePage;
