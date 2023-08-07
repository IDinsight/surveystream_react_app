import { Button } from "antd";
import { Link } from "react-router-dom";

import {
  AppstoreAddOutlined,
  BookFilled,
  HomeFilled,
  MailOutlined,
  ProjectOutlined,
  ReconciliationOutlined,
  RightSquareOutlined,
  RocketOutlined,
  ScheduleOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import CreditImg from "./../../assets/credit.svg";
import CostReductionImg from "./../../assets/cost-reduction.svg";
import BetterQualityImg from "./../../assets/better-quality.svg";
import FasterResponsesImg from "./../../assets/faster-responses.svg";

import "./LandingPage.css";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
const NavItems = () => {
  return (
    <div className="nav-menu flex">
      <div className="w-32 bg-geekblue-5">
        <HomeFilled className="flex items-center !text-[16px]" />
        <span>Home</span>
      </div>
      <div className="min-w-32">
        <BookFilled className="flex items-center !text-[16px]" />
        <span>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://sites.google.com/idinsight.org/dod-surveystream-onboarding/home"
          >
            Documentation
          </a>
        </span>
      </div>
      <div className="min-w-32">
        <MailOutlined className="flex items-center !text-[16px]" />
        <span>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdLWVwrpStPL22WCtcY0ANntjc56GlLHYXZWcjrsQfVM0Syqg/viewform"
          >
            Contact Us
          </a>
        </span>
      </div>
      <div className="min-w-32">
        <AppstoreAddOutlined className="flex items-center !text-[16px]" />
        <span>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.google.com/spreadsheets/d/1WbmebjDLrbo6c15KZzbu1rkvNHlnBAy_p-nREz3OjNE/"
          >
            Roadmap
          </a>
        </span>
      </div>
    </div>
  );
};

function LandingPage() {
  const userProfile = useAppSelector((state: RootState) => state.auth.profile);

  return (
    <>
      <Header items={NavItems} />
      <div className="flex h-[568px] pt-[100px] pl-[180px] pr-[88px]">
        <div className="flex flex-col w-1/2 pr-[30px]">
          <p className="font-inter font-medium text-[56px] leading-[64px] text-gray-10 m-0">
            Support your survey operations with SurveyStream
          </p>
          <p className="font-inter font-normal text-[20px] leading-[28px] text-gray-7">
            Platform for configuring, running, and managing survey operations
          </p>
          <div className="mt-[40px]">
            <Link to={userProfile?.user_uid ? "/surveys" : "/login"}>
              <Button
                id="home-login-button"
                type="primary"
                size="large"
                className="bg-geekblue-5 !rounded-sm min-w-[94px]"
              >
                {userProfile?.user_uid ? "Go to my surveys" : "Login"}
              </Button>
            </Link>
            <Button
              id="home-contact-us-button"
              className="ml-[25px] text-[20px] !rounded-sm"
              type="default"
              target="_blank"
              rel="noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdLWVwrpStPL22WCtcY0ANntjc56GlLHYXZWcjrsQfVM0Syqg/viewform"
              size="large"
            >
              Contact Us
            </Button>
          </div>
        </div>
        <div className="flex w-1/2 flex justify-center">
          <img src={CreditImg} className="h-[336px] w-[527px]" alt="Credit" />
        </div>
      </div>
      {/**
      <div className="flex flex-col h-[745px] pl-[180px] pr-[180px] bg-gray-2">
        <div className="pt-[130px] w-[575px]">
          <p className="font-inter font-medium text-[38px] leading-[46px] text-gray-10 m-0">
            Almost everything you need to run large scale surveys
          </p>
          <p className="font-inter font-normal text-[20px] leading-[28px] text-gray-7">
            Survey setup, productivity monitoring, data quality monitoring
          </p>
        </div>
        <div className="pt-[30px]">
          <div className="flex justify-between">
            <div className="w-[328px]">
              <ReconciliationOutlined className="text-gray-9 !text-2xl" />
              <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
                Survey configuration
              </p>
              <p className="font-inter font-normal text-[20px] leading-[28px] text-gray-7">
                Provide details required for configuring your survey
              </p>
            </div>
            <div className="w-[328px]">
              <UsergroupAddOutlined className="text-gray-9 !text-2xl" />
              <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
                Surveyor Hiring
              </p>
              <p className="font-inter font-normal text-[20px] leading-[28px] text-gray-7">
                Automate the surveyor hiring process
              </p>
            </div>
            <div className="w-[328px]">
              <RightSquareOutlined className="text-gray-9 !text-2xl" />
              <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
                Assignments
              </p>
              <p className="font-inter font-normal text-[20px] leading-[28px] text-gray-7">
                Assign targets to surveyors and share assignment information via
                automated emails
              </p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-[328px]">
              <RocketOutlined className="text-gray-9 !text-2xl" />
              <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
                Productivity tracking
              </p>
              <p className="font-inter font-normal text-[20px] leading-[28px] text-gray-7">
                Track surveyor productivity
              </p>
            </div>
            <div className="w-[328px]">
              <ProjectOutlined className="text-gray-9 !text-2xl" />
              <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
                Data quality tracking
              </p>
              <p className="font-inter font-normal text-[20px] leading-[28px] text-gray-7">
                Track surveyor data quality
              </p>
            </div>
            <div className="w-[328px]">
              <ScheduleOutlined className="text-gray-9 !text-2xl" />
              <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
                Audits (audio and photo)
              </p>
              <p className="font-inter font-normal text-[20px] leading-[28px] text-gray-7">
                Audit media files (audios and photos) in an easy manner
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-[120px] h-[700px] pl-[180px] pr-[180px]">
        <p className="font-inter font-medium text-[38px] leading-[46px] text-gray-10 m-0 w-[535px]">
          Be more efficient, faster, and cheaper with SurveyStream
        </p>
        <div className="flex justify-between mt-[75px]">
          <div>
            <img
              className="h-[284px] w-[328px]"
              src={CostReductionImg}
              alt="Cost Reduction"
            />
            <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
              Cost reduction
            </p>
          </div>
          <div>
            <img
              className="h-[284px] w-[328px]"
              src={BetterQualityImg}
              alt="Better Quality"
            />
            <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
              Better data quality
            </p>
          </div>
          <div>
            <img
              className="h-[284px] w-[328px]"
              src={FasterResponsesImg}
              alt="Faster Responses"
            />
            <p className="font-inter font-medium text-[20px] leading-[28px] text-gray-10">
              Faster responses
            </p>
          </div>
        </div>
      </div>
      */}
      <Footer />
    </>
  );
}

export default LandingPage;
