import React, { useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
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
    "Survey locations": "location/add",
    Enumerators: "enumerators",
    Targets: "targets",
  },
};

const SurveyConfiguration: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const surveyConfigs = useAppSelector(
    (state: RootState) => state.surveyConfig.surveyConfigs
  );

  const isLoading = useAppSelector(
    (state: RootState) => state.surveyConfig.loading
  );

  const fetchData = async () => {
    await dispatch(getSurveyConfig({ survey_uid: survey_uid }));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

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
    const sectionRoute = sectionRoutes[sectionTitle];

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
        <Title>
          Survey configuration
          {(() => {
            const activeSurveyData: any = localStorage.getItem("activeSurvey");
            return ` : ${
              activeSurvey?.survey_name ||
              (activeSurveyData && JSON.parse(activeSurveyData)?.survey_name) ||
              ""
            }`;
          })()}
        </Title>
      </NavWrapper>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu surveyProgress={surveyConfigs} />
          <MainWrapper>
            {Object.entries(surveyConfigs).map(
              ([sectionTitle, sectionConfig], index) =>
                renderSection(sectionTitle, sectionConfig, index)
            )}
          </MainWrapper>
        </div>
      )}
    </>
  );
};

export default SurveyConfiguration;
