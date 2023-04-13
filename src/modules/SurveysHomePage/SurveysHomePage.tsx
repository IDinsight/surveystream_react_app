import { HomeFilled, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getDayMonth } from "../../utils/helper";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SurveyCard from "../../components/SurveyCard";

import "./SurveysHomePage.css";
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

// TODO: Remove this
import MockData from "./MockData";

function SurveysHomePage() {
  const activeSurvey = MockData?.data?.filter(
    (survey: any) => survey["state"] == "active"
  );

  const draftSurvey = MockData?.data?.filter(
    (survey: any) => survey["state"] == "draft"
  );

  const pastSurvey = MockData?.data?.filter(
    (survey: any) => survey["state"] == "past"
  );

  return (
    <>
      <Header items={NavItems} />
      <div className="ml-[80px] mt-[40px]">
        <div id="surveys-active" className="mb-10">
          <p className="font-inter font-medium text-base text-gray-7">
            Active surveys
          </p>
          <div id="surveys-active-items" className="flex flex-wrap">
            {activeSurvey.map((survey) => {
              return (
                <SurveyCard
                  key={survey.survey_uid}
                  link={survey.survey_uid.toString()}
                  title={survey.survey_name}
                  start={getDayMonth(survey.planned_start_date)}
                  end={getDayMonth(survey.planned_end_date)}
                />
              );
            })}
          </div>
        </div>
        <div id="surveys-draft" className="mb-10">
          <p className="font-inter font-medium text-base text-gray-7">
            Draft surveys
          </p>
          <div className="flex">
            {draftSurvey.map((survey) => {
              return (
                <div
                  key={survey.survey_uid}
                  className="mt-4 mr-[22px] p-4 w-[270px] h-[84px] bg-gray-1 rounded-sm shadow-[0_0_4px_rgba(0,0,0,0.08)]"
                >
                  <Link
                    to={survey.survey_uid.toString()}
                    className="font-inter font-medium text-base text-geekblue-7 no-underline h-12 inline-block"
                  >
                    ADP 2.0 R1 Health Ben PLW main survey form
                  </Link>
                  <p className="m-0 mt-2 font-inter font-normal text-xs leading-[20px] text-gray-7">
                    Last edited on {survey.last_updated_at}
                  </p>
                </div>
              );
            })}
            <div className="flex justify-center items-center mt-4 w-[270px] bg-gray-1 rounded-sm shadow-[0_0_4px_rgba(0,0,0,0.08)]">
              <Link to="/new_survey_config" className="no-underline">
                <PlusOutlined className="!text-base text-gray-9" />
                <span className="ml-3 font-inter font-medium text-base text-gray-10">
                  Configure new survey
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div id="surveys-past" className="mb-10">
          <p className="font-inter font-medium text-base text-gray-7">
            Past surveys
          </p>
          <div id="surveys-past-items" className="flex flex-wrap">
            {pastSurvey.map((survey) => {
              return (
                <SurveyCard
                  key={survey.survey_uid}
                  link={survey.survey_uid.toString()}
                  title={survey.survey_name}
                  start={getDayMonth(survey.planned_start_date)}
                  end={getDayMonth(survey.planned_end_date)}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SurveysHomePage;
