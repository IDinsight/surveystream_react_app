import { Form, Row, Col, Input, Select } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../../shared/Nav.styled";

import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  CheckboxSCTO,
  SCTOInformationFormWrapper,
  StyledFormItem,
  StyledTooltip,
  TwoColumnForm,
} from "./SurveyCTOInformation.styled";
import { DescriptionText } from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import {
  getSurveyCTOForm,
  getTimezones,
} from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

function SurveyCTOInfomation() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.surveyCTOInformation.loading
  );
  const activeSurvey = useAppSelector(
    (state: RootState) => state.reducer.surveys.activeSurvey
  );
  const handleGoBack = () => {
    navigate(-1);
  };
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const timezones = useAppSelector(
    (state: RootState) => state.reducer.surveyCTOInformation.timezones
  );

  console.log("timezones", timezones);

  const surveyCTOForm = useAppSelector(
    (state: RootState) => state.reducer.surveyCTOInformation.surveyCTOForm
  );

  const fetchTimezones = async () => {
    await dispatch(getTimezones());
  };
  const fecthSurveyCTOForm = async () => {
    await dispatch(getSurveyCTOForm({ survey_uid: survey_uid }));
  };

  useEffect(() => {
    fetchTimezones();
    fecthSurveyCTOForm();
  }, [dispatch]);

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> {activeSurvey?.survey_name} </Title>
      </NavWrapper>

      {isLoading ? (
        <>
          <FullScreenLoader></FullScreenLoader>
        </>
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <SCTOInformationFormWrapper>
              <Title>SurveyCTO information</Title>
              <DescriptionText>
                Please fill out the SurveyCTO form details
              </DescriptionText>
              <TwoColumnForm form={form}>
                <Row gutter={36}>
                  <Col span={10}>
                    <StyledFormItem
                      required
                      label={
                        <span>
                          Main Form ID&nbsp;
                          <StyledTooltip title="Main SCTO form ID. Ex: Main_Individual_RD_Survey">
                            <QuestionCircleOutlined />
                          </StyledTooltip>
                        </span>
                      }
                      name="formID"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      style={{ display: "block" }}
                    >
                      <Input style={{ width: "100%" }} />
                    </StyledFormItem>

                    <StyledFormItem
                      label={
                        <span>
                          SCTO server name&nbsp;
                          <StyledTooltip title="SCTO server name Ex: dodieic. Note to teams: Please consider carefully the server you will be using is appropriate for your project.">
                            <QuestionCircleOutlined />
                          </StyledTooltip>
                        </span>
                      }
                      name="serverName"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      style={{ display: "block" }}
                    >
                      <Input style={{ width: "100%" }} />
                    </StyledFormItem>
                  </Col>

                  <Col span={10}>
                    <StyledFormItem
                      required
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      label={
                        <span>
                          Main form name&nbsp;
                          <StyledTooltip title="Main SCTO form name. Ex: Main_Individual_RD_Survey">
                            <QuestionCircleOutlined />
                          </StyledTooltip>
                        </span>
                      }
                      name="formName"
                      style={{ display: "block", width: "300px" }}
                    >
                      <Input style={{ width: "100%" }} />
                    </StyledFormItem>

                    <StyledFormItem
                      required
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                      name="locationTimezone"
                      style={{ display: "block", width: "300px" }}
                      label={
                        <span>
                          Time zone of location of data collection&nbsp;
                          <StyledTooltip title="Select the timezone for data collection Ex: Asia/Kolkata">
                            <QuestionCircleOutlined />
                          </StyledTooltip>
                        </span>
                      }
                    >
                      <Select
                        options={[
                          { value: "Asia/Kolkata", label: "Asia/Kolkata" },
                          { value: "Asia/Dhaka", label: "Asia/Dhaka" },
                        ]}
                      />
                    </StyledFormItem>
                  </Col>
                </Row>
              </TwoColumnForm>
              <div style={{ marginTop: "40px" }}>
                <CheckboxSCTO>
                  Please share the SCTO key with{" "}
                  <a href="mail:surveystream.devs@idinsight.org">
                    surveystream.devs@idinsight.org
                  </a>{" "}
                  via Dashlane.
                </CheckboxSCTO>
                <CheckboxSCTO>
                  Please grant{" "}
                  <a
                    href="https://docs.surveycto.com/04-monitoring-and-management/01-the-basics/00b.managing-user-roles.html"
                    target="__blank"
                  >
                    Data Manager
                  </a>{" "}
                  access to{" "}
                  <a href="mail:surveystream.devs@idinsight.org">
                    surveystream.devs@idinsight.org
                  </a>
                  on the SCTO server. Please ensure the role has API access
                  enabled.
                </CheckboxSCTO>
                <CheckboxSCTO>
                  I allow SurveyStream to connect to the SCTO server as per the
                  requirements of modules selected
                </CheckboxSCTO>
              </div>
            </SCTOInformationFormWrapper>
          </div>
          <FooterWrapper>
            <SaveButton>Save</SaveButton>
            <ContinueButton>Continue</ContinueButton>
          </FooterWrapper>
        </>
      )}
    </>
  );
}

export default SurveyCTOInfomation;
