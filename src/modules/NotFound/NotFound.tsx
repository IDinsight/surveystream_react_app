import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

const NotFound: React.FC = () => (
  <>
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
              The page you are trying to load is not found! Please go back home
              and try again. If the problem persists,
            </p>
            <p style={{ marginTop: 0 }}>
              please contact the SurveyStream team.
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
