import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import Header from "../Header";
import { GlobalStyle } from "../../shared/Global.styled";

const PermissionDenied: React.FC = () => (
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
        title="Permission Denied"
        subTitle={
          <>
            <p style={{ marginBottom: 0 }}>
              You do not have permissions to access the page you are trying to
              access.
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
          <Link to="/surveys" key="home">
            <Button
              type="primary"
              style={{ backgroundColor: "#597EF7", color: "#FFF" }}
            >
              Surveys
            </Button>
          </Link>,
        ]}
      />
    </div>
  </>
);

export default PermissionDenied;
