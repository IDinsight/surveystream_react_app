import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Select, message } from "antd";
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
import {
  getSurveyCTOForm,
  getTimezones,
  postSurveyCTOForm,
  putSurveyCTOForm,
} from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { SurveyCTOForm } from "../../../redux/surveyCTOInformation/types";

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
  const [formData, setFormData] = useState<SurveyCTOForm | null>(null);
  const handleGoBack = () => {
    navigate(-1);
  };
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const timezones = useAppSelector(
    (state: RootState) => state.reducer.surveyCTOInformation.timezones
  );

  const surveyCTOForm = useAppSelector(
    (state: RootState) => state.reducer.surveyCTOInformation.surveyCTOForm
  );

  useEffect(() => {
    // Set initial form values when surveyCTOForm is available
    if (surveyCTOForm) {
      form.setFieldsValue({
        scto_form_id: surveyCTOForm.scto_form_id,
        scto_server_name: surveyCTOForm.scto_server_name,
        form_name: surveyCTOForm.form_name,
        tz_name: surveyCTOForm.tz_name,
        encryption_key_shared: surveyCTOForm.encryption_key_shared,
        server_access_role_granted: surveyCTOForm.server_access_role_granted,
        server_access_allowed: surveyCTOForm.server_access_allowed,
      });
    }
  }, [surveyCTOForm, form]);

  const fetchTimezones = async () => {
    await dispatch(getTimezones());
  };
  const fecthSurveyCTOForm = async () => {
    await dispatch(getSurveyCTOForm({ survey_uid: survey_uid }));
  };

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const formValues: SurveyCTOForm = {
      scto_form_id: allValues.scto_form_id,
      form_name: allValues.form_name,
      tz_name: allValues.tz_name,
      scto_server_name: allValues.scto_server_name ?? "",
      encryption_key_shared: allValues.encryption_key_shared ?? false,
      server_access_role_granted: allValues.server_access_role_granted ?? false,
      server_access_allowed: allValues.server_access_allowed ?? false,
    };

    setFormData(formValues); // Update form data
  };

  const handleContinue = async () => {
    try {
      if (formData === null) {
        message.error("Please fill in all required fields.");
        return false;
      }
      const validatedData = await form.validateFields();
      setLoading(true);

      const surveyCTOData = formData;
      let formRes;

      if (
        surveyCTOForm &&
        surveyCTOForm?.form_uid !== null &&
        surveyCTOForm?.form_uid !== undefined
      ) {
        formRes = await dispatch(
          putSurveyCTOForm({
            surveyCTOData: surveyCTOData,
            formUid: surveyCTOForm.form_uid,
          })
        );
      } else {
        formRes = await dispatch(
          postSurveyCTOForm({
            surveyCTOData: surveyCTOData,
            surveyUid: survey_uid,
          })
        );
      }

      if (formRes && formRes.payload.status === false) {
        message.error(formRes.payload.message);
      } else {
        message.success("SurveyCTO form updated successfully");
        navigate(
          `/survey-information/field-supervisor-roles/add/${survey_uid}`
        );
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);

      if (Array.isArray(error.errorFields) && error.errorFields.length > 0) {
        // Handle validation errors
        const errorMessage = error.errorFields[0]?.errors[0];

        message.error(errorMessage);
      } else {
        message.error("Please fill in all required fields.");
      }
    } finally {
      setLoading(false);
    }
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
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <SCTOInformationFormWrapper>
              <Title>SurveyCTO information</Title>
              <DescriptionText>
                Please fill out the SurveyCTO form details
              </DescriptionText>
              <Form form={form} onValuesChange={handleFormValuesChange}>
                <TwoColumnForm>
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
                        name="scto_form_id"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{ display: "block" }}
                        rules={[
                          {
                            required: true,
                            message: "Please enter a Main Form ID",
                          },
                        ]}
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
                        name="scto_server_name"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{ display: "block" }}
                        rules={[
                          {
                            required: false,
                            message: "Please enter a SCTO server name",
                          },
                        ]}
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
                        name="form_name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter a Main form name",
                          },
                        ]}
                        style={{ display: "block", width: "300px" }}
                      >
                        <Input style={{ width: "100%" }} />
                      </StyledFormItem>
                      <StyledFormItem
                        required
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        name="tz_name"
                        style={{ display: "block", width: "300px" }}
                        label={
                          <span>
                            Time zone of location of data collection&nbsp;
                            <StyledTooltip title="Select the timezone for data collection Ex: Asia/Kolkata">
                              <QuestionCircleOutlined />
                            </StyledTooltip>
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message:
                              "Please enter a Time zone of location of data collection",
                          },
                        ]}
                      >
                        <Select showSearch optionFilterProp="children">
                          {timezones.map((timezone: { name: string }) => (
                            <Select.Option
                              key={timezone.name}
                              value={timezone.name}
                            >
                              {timezone.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </StyledFormItem>
                    </Col>
                  </Row>
                </TwoColumnForm>
                <div style={{ marginTop: "40px", display: "block" }}>
                  <StyledFormItem
                    name="encryption_key_shared"
                    valuePropName="checked"
                  >
                    <CheckboxSCTO>
                      Please share the SCTO key with{" "}
                      <a href="mail:surveystream.devs@idinsight.org">
                        surveystream.devs@idinsight.org
                      </a>{" "}
                      via Dashlane.
                    </CheckboxSCTO>
                  </StyledFormItem>
                  <StyledFormItem
                    name="server_access_role_granted"
                    valuePropName="checked"
                  >
                    <CheckboxSCTO>
                      Please grant
                      <a
                        href="https://docs.surveycto.com/04-monitoring-and-management/01-the-basics/00b.managing-user-roles.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Data Manager
                      </a>
                      access to
                      <a href="mail:surveystream.devs@idinsight.org">
                        surveystream.devs@idinsight.org
                      </a>
                      on the SCTO server. Please ensure the role has API access
                      enabled.
                    </CheckboxSCTO>
                  </StyledFormItem>
                  <StyledFormItem
                    name="server_access_allowed"
                    valuePropName="checked"
                  >
                    <CheckboxSCTO>
                      I allow SurveyStream to connect to the SCTO server as per
                      the requirements of modules selected
                    </CheckboxSCTO>
                  </StyledFormItem>
                </div>
              </Form>
            </SCTOInformationFormWrapper>
          </div>
          <FooterWrapper>
            <SaveButton onClick={handleGoBack}>Back</SaveButton>
            <ContinueButton onClick={handleContinue} loading={loading}>
              Continue
            </ContinueButton>
          </FooterWrapper>
        </>
      )}
    </>
  );
}

export default SurveyCTOInfomation;
