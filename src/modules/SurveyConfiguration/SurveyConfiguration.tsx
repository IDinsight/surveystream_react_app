import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

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
import { fetchSurveys } from "../../redux/surveyList/surveysActions";
import { setActiveSurvey } from "../../redux/surveyList/surveysSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { Result, Button, Tag, Progress } from "antd";
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
  AudioOutlined,
  TableOutlined,
  MailOutlined,
  SoundOutlined,
  PictureOutlined,
  FormOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  HourglassOutlined,
} from "@ant-design/icons";
import { userHasPermission } from "../../utils/helper";
import { GlobalStyle } from "../../shared/Global.styled";
import useWindowDimensions from "../../hooks/useWindowDimensions";

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
    Mapping: "mapping/surveyor",
  },
  "Module configuration": {
    "Assign targets to surveyors": "assignments",
    "Assignments column configuration": "table-config",
    Emails: "emails",
    "Media (Audio/Photo) audits": "media-audits",
    "Track data quality": "dq-forms",
    "Admin forms": "admin-forms",
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
    navigate("/surveys"); // Navigate to the surveys page
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
    const colors: { [key: string]: string } = {
      Done: "green",
      "In Progress": "orange",
      Error: "red",
    };
    const color = colors[status];
    const icons: { [key: string]: any } = {
      Done: CheckCircleOutlined,
      "In Progress": SyncOutlined,
      Error: CloseCircleOutlined,
    };
    const IconComponent = icons[status] || HourglassOutlined;

    return (
      <StatusWrapper>
        <Tag icon={<IconComponent />} color={color}>
          {status}
        </Tag>
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

      case "Survey locations":
        return <PushpinFilled style={{ color: "#FAAD14", ...iconProps }} />;
      case "User and role management":
        return <UserOutlined style={{ color: "#D4380D", ...iconProps }} />;
      case "SurveyCTO information":
        return <MobileOutlined style={{ color: "#1D39C4", ...iconProps }} />;
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
      case "Track productivity":
        return <ProfileFilled style={{ color: "#FAAD14", ...iconProps }} />;
      case "Track data quality":
        return <ReadFilled style={{ color: "#7CB305", ...iconProps }} />;
      case "Media (Audio/Photo) audits":
        return <AudioOutlined style={{ color: "#08979C", ...iconProps }} />;
      case "Admin forms":
        return <FormOutlined style={{ color: "#8308cf", ...iconProps }} />;
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
      case "Survey locations":
        permission_name = "READ Survey Locations";
        break;
      case "User and role management":
        permission_name = "Survey Admin";
        break;
      case "SurveyCTO information":
        permission_name = "Survey Admin";
        break;
      case "Enumerators":
        permission_name = "READ Enumerators";
        break;
      case "Targets":
        permission_name = "READ Targets";
        break;
      case "Mapping":
        permission_name = "READ Mapping";
        break;
      case "Target status mapping":
        permission_name = "READ Target Status Mapping";
        break;
      case "Assign targets to surveyors":
        permission_name = "READ Assignments";
        break;
      case "Media (Audio/Photo) audits":
        permission_name = "READ Media Files Config";
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

  const renderSection = (sectionTitle: string, sectionConfig: any) => {
    if (Array.isArray(sectionConfig) && sectionConfig.length > 0) {
      return (
        <>
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
        </>
      );
    } else if (
      !Array.isArray(sectionConfig) &&
      Object.keys(sectionConfig).length > 0
    ) {
      const hasPermission = checkPermissions(sectionTitle);

      return hasPermission ? (
        <>
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
        </>
      ) : null;
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
            Reload Data
          </Button>
        }
      />;
    }
  };

  useEffect(() => {
    fetchData();
  }, [survey_uid]);

  useEffect(() => {
    if (survey_uid && !activeSurvey) {
      // fetch survey list
      dispatch(fetchSurveys()).then((surveyList) => {
        if (surveyList.payload?.length > 0) {
          const surveyInfo = surveyList.payload.find(
            (survey: any) => survey.survey_uid === parseInt(survey_uid)
          );

          // set the active survey
          dispatch(
            setActiveSurvey({ survey_uid, survey_name: surveyInfo.survey_name })
          );
        }
      });
    }
  }, [survey_uid]);

  const { height } = useWindowDimensions();

  return (
    <>
      <GlobalStyle />

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
          <SideMenu surveyProgress={surveyConfigs} windowHeight={height} />
          <MainWrapper windowHeight={height}>
            {Object.entries(surveyConfigs).map(
              ([sectionTitle, sectionConfig], index) => (
                <div key={index}>
                  {renderSection(sectionTitle, sectionConfig)}
                </div>
              )
            )}
          </MainWrapper>
        </div>
      )}
    </>
  );
};

export default SurveyConfiguration;
