import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import Header from "../../components/Header";
import SideMenu from "./SideMenu";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import { RootState } from "../../redux/store";
import styled from "styled-components";
import { NavWrapper, BackLink, BackArrow } from "../../shared/Nav.styled";

import {
  CheckboxLabel,
  StyledCard,
  Title,
  MainWrapper,
  StatusText,
  StatusWrapper,
  SectionTitle,
} from "./SurveyConfiguration.styled";
import { getSurveyConfig } from "../../redux/surveyConfig/surveyConfigActions";
import { useAppDispatch } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { Result, Button } from "antd";

interface CheckboxProps {
  checked: boolean;
  color: string;
}

const CustomCheckbox: React.FC<CheckboxProps> = ({ checked, color }) => {
  const CheckboxWrapper = styled.div`
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    background-color: ${checked ? color : "transparent"};
    border: 1px solid ${color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    cursor: default;
  `;
  return (
    <CheckboxWrapper>
      {checked && <CheckboxLabel>✓</CheckboxLabel>}
    </CheckboxWrapper>
  );
};

CustomCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
};

const sectionRoutes: { [key: string]: string } = {
  "Basic information": "new-survey-config",
  "Module selection": "module-selection",
  "Survey information": "survey-information",
  "Module configuration": "module-configuration",
};

const itemRoutes: { [key: string]: { [key: string]: string } } = {
  "Survey information": {
    "SurveyCTO information": "survey-cto-information",
    "Field supervisor roles": "field-supervisor-roles/add",
  },
};

const SurveyConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const surveyConfigs = useSelector(
    (state: RootState) => state.reducer.surveyConfig.surveyConfigs
  );

  const isLoading = useSelector(
    (state: RootState) => state.reducer.surveyConfig.loading
  );

  const fetchData = async () => {
    await dispatch(getSurveyConfig({ survey_uid: survey_uid }));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const renderStatus = (status: string) => {
    let color;
    if (status === "Done") {
      color = "#389E0D";
    } else if (status === "In Progress") {
      color = "#D48806";
    } else if (status === "Error") {
      color = "#F5222D";
    } else {
      color = "#8C8C8C";
    }

    return (
      <StatusWrapper>
        <CustomCheckbox checked={true} color={color} />
        <StatusText>{status}</StatusText>
      </StatusWrapper>
    );
  };

  const generateLink = (sectionTitle: string, itemName: string) => {
    console.log("sectionTitle", sectionTitle);

    console.log("itemName", itemName);

    const sectionRoute = sectionRoutes[sectionTitle];

    console.log("sectionRoute", sectionRoute);

    if (sectionRoute) {
      const itemRoute = itemRoutes[sectionTitle]?.[itemName];

      if (itemRoute) {
        return `/${sectionRoute}/${itemRoute}/${survey_uid}`;
      }

      return `/${sectionRoute}/${survey_uid}`;
    }

    return "";
  };

  const renderSection = (
    sectionTitle: string,
    sectionConfig: any,
    index: number
  ) => {
    if (Array.isArray(sectionConfig) && sectionConfig.length > 0) {
      return (
        <div key={index}>
          <SectionTitle>{`${index + 1} -> ${sectionTitle}`}</SectionTitle>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {sectionConfig.map((item: any, i: number) => (
              <StyledCard
                key={i}
                style={{
                  margin: "0.2rem",
                  flex: "0 0 30%",
                  width: "33%",
                }}
              >
                <Link
                  style={{ color: "#2F54EB", cursor: "pointer" }}
                  to={generateLink(sectionTitle, item.name)}
                >
                  {item.name}
                </Link>
                {renderStatus(item.status)}
              </StyledCard>
            ))}
          </div>
        </div>
      );
    } else if (
      !Array.isArray(sectionConfig) &&
      Object.keys(sectionConfig).length > 0
    ) {
      return (
        <div key={index}>
          <SectionTitle>{`${index + 1} -> ${sectionTitle}`}</SectionTitle>

          <StyledCard
            style={{
              width: "33%",
            }}
          >
            <Link
              style={{ color: "#2F54EB", cursor: "pointer" }}
              to={generateLink(sectionTitle, "")}
            >
              {sectionTitle}
            </Link>
            {renderStatus(sectionConfig.status)}
          </StyledCard>
        </div>
      );
    } else {
      <Result
        title={"Reload Configuration"}
        subTitle={"Failed to load configuration, kindly reload"}
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
      />;
    }
  };

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
        <SideMenu surveyProgress={surveyConfigs} />
        <MainWrapper>
          {Object.entries(surveyConfigs).map(
            ([sectionTitle, sectionConfig], index) =>
              renderSection(sectionTitle, sectionConfig, index)
          )}
        </MainWrapper>
      </div>
    </>
  );
};

export default SurveyConfiguration;
