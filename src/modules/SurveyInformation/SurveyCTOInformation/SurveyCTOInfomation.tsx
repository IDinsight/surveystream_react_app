import { useEffect, useState } from "react";
import { Form, Row, Col, Input, Select, message } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import { HeaderContainer, NavWrapper, Title } from "../../../shared/Nav.styled";
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
import { GlobalStyle } from "../../../shared/Global.styled";
import HandleBackButton from "../../../components/HandleBackButton";
import Container from "../../../components/Layout/Container";

function SurveyCTOInfomation() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const isLoading = useAppSelector(
    (state: RootState) => state.surveyCTOInformation.loading
  );
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const [formData, setFormData] = useState<SurveyCTOForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [surveyCTOForm, setSurveyCTOForm] = useState<SurveyCTOForm | null>(
    null
  );
  const dispatch = useAppDispatch();
  const timezones = useAppSelector(
    (state: RootState) => state.surveyCTOInformation.timezones
  );

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

      if (survey_uid == undefined) {
        message.error("Kindly check that survey_uid is provided on the url");
        return;
      }

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

      if (formRes.payload.success === true) {
        message.success("SurveyCTO form updated successfully.");
        navigate(
          `/survey-information/survey-cto-questions/${survey_uid}/${
            surveyCTOForm?.form_uid
              ? surveyCTOForm?.form_uid
              : formRes.payload?.data?.survey?.form_uid
          }`
        );
      } else {
        message.error(formRes.payload.message);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      message.error(
        "Something went wrong, could not save surveyCTO information."
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchTimezones = async () => {
    await dispatch(getTimezones());
  };

  const fecthSurveyCTOForm = async () => {
    setLoading(true);

    const surveyCTOFormRes: any = await dispatch(
      getSurveyCTOForm({ survey_uid: survey_uid })
    );
    const surveyCTOFormResPayload: any =
      surveyCTOFormRes.payload.length > 0 ? surveyCTOFormRes.payload[0] : null;

    setSurveyCTOForm(surveyCTOFormResPayload);

    if (surveyCTOFormResPayload) {
      const formFieldData = {
        scto_form_id: surveyCTOFormResPayload.scto_form_id,
        scto_server_name: surveyCTOFormResPayload.scto_server_name,
        form_name: surveyCTOFormResPayload.form_name,
        tz_name: surveyCTOFormResPayload.tz_name,
        encryption_key_shared: surveyCTOFormResPayload.encryption_key_shared,
        server_access_role_granted:
          surveyCTOFormResPayload.server_access_role_granted,
        server_access_allowed: surveyCTOFormResPayload.server_access_allowed,
      };
      form.setFieldsValue(formFieldData);
      setFormData(formFieldData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTimezones();
    fecthSurveyCTOForm();
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>SurveyCTO information</Title>

        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        ></div>
      </HeaderContainer>

      {isLoading || loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <SCTOInformationFormWrapper>
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
                            <StyledTooltip title="Input the form ID of the main SCTO form. Ex: agrifieldnet_main_form">
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
                        required
                        label={
                          <span>
                            SCTO server name&nbsp;
                            <StyledTooltip title="SurveyCTO server name Ex: dodieic. Please carefully consider the server you are sharing is the one cleared for use on your project.">
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
                            required: true,
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
                            <StyledTooltip title="Input the form name of the main SCTO form. Ex: AgriFieldNet main survey form">
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
                            <StyledTooltip title="Select the timezone in which you will be conducting data collection. Ex: Asia/Kolkata">
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
                      via FlowCrypt/Dashlane.
                    </CheckboxSCTO>
                  </StyledFormItem>
                  <StyledFormItem
                    name="server_access_role_granted"
                    valuePropName="checked"
                  >
                    <CheckboxSCTO>
                      Please grant{" "}
                      <a
                        href="https://docs.surveycto.com/04-monitoring-and-management/01-the-basics/00b.managing-user-roles.html"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Data Manager
                      </a>{" "}
                      access to{" "}
                      <a href="mail:surveystream.devs@idinsight.org">
                        surveystream.devs@idinsight.org
                      </a>{" "}
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
                      the requirements of modules selected.
                    </CheckboxSCTO>
                  </StyledFormItem>
                </div>
              </Form>
            </SCTOInformationFormWrapper>
          </div>
          <FooterWrapper>
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
