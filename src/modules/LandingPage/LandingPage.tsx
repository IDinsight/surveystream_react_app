import { Button } from "antd";
import { Link } from "react-router-dom";

import {
  AppstoreAddOutlined,
  BookFilled,
  HomeFilled,
  MailOutlined,
} from "@ant-design/icons";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import CreditImg from "./../../assets/credit.svg";

import "./LandingPage.css";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import {
  LandingPageContainer,
  TextContainer,
  StyledButton,
  ImageContainer,
  NavMenu,
  NavMenuItem,
  ContactUsBtn,
  LoginBtn,
} from "./Landing.styled";
import { GlobalStyle } from "../../shared/Global.styled";

const NavItems = () => {
  return (
    <NavMenu className="nav-menu flex">
      <NavMenuItem className="w-32 bg-geekblue-5">
        <HomeFilled className="flex items-center !text-[16px]" />
        <span>Home</span>
      </NavMenuItem>
      <NavMenuItem className="min-w-32">
        <BookFilled className="flex items-center !text-[16px]" />
        <span>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.surveystream.idinsight.io"
          >
            Documentation
          </a>
        </span>
      </NavMenuItem>
      <NavMenuItem className="min-w-32">
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
      </NavMenuItem>
      <NavMenuItem className="min-w-32">
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
      </NavMenuItem>
    </NavMenu>
  );
};

function LandingPage() {
  const userProfile = useAppSelector((state: RootState) => state.auth.profile);

  return (
    <>
      <GlobalStyle />
      <Header items={NavItems} />
      <LandingPageContainer>
        <TextContainer>
          <p style={{ fontSize: "56px", lineHeight: "64px", color: "#4B5563" }}>
            Support your survey operations with SurveyStream
          </p>
          <p style={{ fontSize: "20px", lineHeight: "28px", color: "#4B5563" }}>
            Platform for configuring, running, and managing survey operations
          </p>
          <div style={{ marginTop: "40px" }}>
            <Link to={userProfile?.user_uid ? "/surveys" : "/login"}>
              <LoginBtn type="primary" size="large">
                {userProfile?.user_uid ? "Go to my surveys" : "Login"}
              </LoginBtn>
            </Link>
            <ContactUsBtn
              className="ml-[25px] !rounded-sm"
              type="default"
              target="_blank"
              rel="noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdLWVwrpStPL22WCtcY0ANntjc56GlLHYXZWcjrsQfVM0Syqg/viewform"
              size="large"
            >
              Contact Us
            </ContactUsBtn>
          </div>
        </TextContainer>
        <ImageContainer>
          <img src={CreditImg} className="h-[336px] w-[527px]" alt="Credit" />
        </ImageContainer>
      </LandingPageContainer>
      <Footer />
    </>
  );
}

export default LandingPage;
