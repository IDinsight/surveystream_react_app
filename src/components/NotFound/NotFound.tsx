import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import Header from "../Header";
import { GlobalStyle } from "../../shared/Global.styled";

const NotFound: React.FC = () => (
  <>
    <GlobalStyle />
    <Header />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <Result
        status="error"
        title="This page is not found"
        subTitle={
          <>
            <p style={{ marginBottom: 0 }}>
              Please click on the button below to go to the home page and try
              again.
            </p>
            <p style={{ marginTop: 0 }}>
              In case the problem persists, please click on this{" "}
              <a
                href="https://idinsight.slack.com/channels/surveystream_bug_reporting"
                target="__blank"
              >
                link
              </a>{" "}
              to join the Slack channel for raising the issue.
            </p>
          </>
        }
        extra={[
          <Link to="/" key="home">
            <Button
              type="primary"
              style={{ backgroundColor: "#597EF7", color: "#FFF" }}
            >
              Home
            </Button>
          </Link>,
        ]}
      />
    </div>
  </>
);

export default NotFound;
