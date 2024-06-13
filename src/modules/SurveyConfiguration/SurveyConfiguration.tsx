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
import {
  InfoCircleFilled,
  LayoutFilled,
  MobileOutlined,
  PushpinFilled,
  UserOutlined,
  InsertRowRightOutlined,
  HomeFilled,
  MailFilled,
  ProfileFilled,
  ReadFilled,
  ControlOutlined,
  BuildFilled,
  TableOutlined,
  MailOutlined,
  SoundOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { userHasPermission } from "../../utils/helper";
import { GlobalStyle } from "../../shared/Global.styled";

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
    "User and role management": "survey-roles/roles",
    "Survey locations": "location/upload",
    Enumerators: "enumerators",
    Targets: "targets",
    "Target status mapping": "survey/status-mapping",
  },
  "Module configuration": {
    "Assign targets to surveyors": "assignments",
    Emails: "emails",
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
  const userProfile = useAppSelector((state: RootState) => state.auth.profile);

  const fetchData = async () => {
    const surveyConfigRes = await dispatch(
      getSurveyConfig({ survey_uid: survey_uid })
    );
  };

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
  const renderModuleIcon = (sectionTitle: string) => {
    const iconProps = { fontSize: "28px" };

    switch (sectionTitle) {
      case "Basic information":
        return <InfoCircleFilled style={{ color: "#FAAD14", ...iconProps }} />;
      case "Module selection":
        return <LayoutFilled style={{ color: "#7CB305", ...iconProps }} />;
      case "SurveyCTO information":
        return <MobileOutlined style={{ color: "#1D39C4", ...iconProps }} />;
      case "User and role management":
        return <UserOutlined style={{ color: "#D4380D", ...iconProps }} />;
      case "Survey locations":
        return <PushpinFilled style={{ color: "#FAAD14", ...iconProps }} />;
      case "Enumerators":
        return (
          <InsertRowRightOutlined style={{ color: "#C41D7F", ...iconProps }} />
        );
      case "Targets":
        return <HomeFilled style={{ color: "#389E0D", ...iconProps }} />;
      case "Mapping":
        return <ControlOutlined style={{ color: "#531DAB", ...iconProps }} />;
      case "Target status mapping":
        return <BuildFilled style={{ color: "#D4380D", ...iconProps }} />;
      case "Assign targets to surveyors":
        return <MailFilled style={{ color: "#D4380D", ...iconProps }} />;
      case "Emails":
        return <MailOutlined style={{ color: "#389E0D", ...iconProps }} />;
      case "Assignments column configuration":
        return <TableOutlined style={{ color: "#1D39C4", ...iconProps }} />;
      case "Media (Audio/Photo) audits":
        return <SoundOutlined style={{ color: "#D4380D", ...iconProps }} />;
      case "Track productivity":
        return <ProfileFilled style={{ color: "#FAAD14", ...iconProps }} />;
      case "Track data quality":
        return <ReadFilled style={{ color: "#7CB305", ...iconProps }} />;
      default:
        return <InfoCircleFilled style={{ color: "#FAAD14", ...iconProps }} />;
    }
  };

  const checkPermissions = (sectionTitle: string) => {
    let permission_name: string;

    switch (sectionTitle) {
      case "Basic information":
        permission_name = "Survey Admin";
        break;
      case "Module selection":
        permission_name = "Survey Admin";
        break;
      case "SurveyCTO information":
        permission_name = "Survey Admin";
        break;
      case "User and role management":
        permission_name = "Survey Admin";
        break;
      case "Survey locations":
        permission_name = "READ Survey Locations";
        break;
      case "Enumerators":
        permission_name = "READ Enumerators";
        break;
      case "Targets":
        permission_name = "READ Targets";
        break;
      case "Target status mapping":
        permission_name = "READ Target Status Mapping";
        break;
      case "Assign targets to surveyors":
        permission_name = "READ Assignments";
        break;
      case "Assignments column configuration":
        permission_name = "READ Assignments";
        break;
      case "Emails":
        permission_name = "READ Emails";
        break;
      case "Track productivity":
        permission_name = "READ Productivity";
        break;
      case "Track data quality":
        permission_name = "READ Data Quality";
        break;
      default:
        permission_name = sectionTitle;
        break;
    }
    return userHasPermission(userProfile, survey_uid, permission_name);
  };

  const renderSection = (
    sectionTitle: string,
    sectionConfig: any,
    index: number
  ) => {
    if (Array.isArray(sectionConfig) && sectionConfig.length > 0) {
      return (
        <div key={index}>
          {sectionConfig.some((item: any) => checkPermissions(item?.name)) && (
            <SectionTitle>{`${sectionTitle}`}</SectionTitle>
          )}

          <div style={{ flexWrap: "wrap", display: "flex" }}>
            {sectionConfig.map((item: any, i: number) => {
              const hasPermission = checkPermissions(item?.name);
              return hasPermission ? (
                <Link
                  key={i}
                  style={{
                    width: 309,
                    display: "inline-block",
                    color: "#434343",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  to={generateLink(sectionTitle, item.name)}
                >
                  <StyledCard style={{ margin: "0.2rem", height: 165 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "left",
                        marginBottom: "10px",
                      }}
                    >
                      {renderModuleIcon(item.name)}
                    </div>
                    {item.name}
                    {renderStatus(item.status)}
                  </StyledCard>
                </Link>
              ) : null;
            })}
          </div>
        </div>
      );
    } else if (
      !Array.isArray(sectionConfig) &&
      Object.keys(sectionConfig).length > 0
    ) {
      const hasPermission = checkPermissions(sectionTitle);

      return hasPermission ? (
        <div key={index}>
          <SectionTitle>{`${sectionTitle}`}</SectionTitle>

          <Link
            style={{
              width: 309,
              display: "inline-block",
              color: "#434343",
              cursor: "pointer",
              textDecoration: "none",
            }}
            to={generateLink(sectionTitle, "")}
          >
            <StyledCard style={{ height: 165 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                  marginBottom: "10px",
                }}
              >
                {renderModuleIcon(sectionTitle)}
              </div>

              {sectionTitle}
              {renderStatus(sectionConfig.status)}
            </StyledCard>
          </Link>
        </div>
      ) : null;
    } else {
      <Result
        key={index}
        title={"Reload Configuration"}
        subTitle={"Failed to load configuration, kindly reload"}
        extra={
          <Button
            onClick={fetchData}
            type="primary"
            className="bg-geekblue-5 h-[40px]"
            size="large"
          >
            Reload Data
          </Button>
        }
      />;
    }
  };

  useEffect(() => {
    fetchData();
  }, [survey_uid]);

  return (
    <>
      <GlobalStyle />

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
              ([sectionTitle, sectionConfig], index) => (
                <>{renderSection(sectionTitle, sectionConfig, index)}</>
              )
            )}
          </MainWrapper>
        </div>
      )}
    </>
  );
};

export default SurveyConfiguration;
