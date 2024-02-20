import React, { useEffect, useState } from "react";
import { Col, Input, Row, Select, DatePicker, Form } from "antd";
import {
  BasicInformationFormWrapper,
  TwoColumnForm,
  StyledTooltip,
} from "./BasicInformationForm.styled";
import { QuestionCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Title } from "../../../shared/Nav.styled";
import { SurveyBasicInformationData } from "../../../redux/surveyConfig/types";
import { performGetUserProfile } from "../../../redux/auth/authActions";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getSurveyBasicInformation } from "../../../redux/surveyConfig/surveyConfigActions";
import { RootState } from "../../../redux/store";
import { useParams } from "react-router-dom";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import dayjs from "dayjs";
import { StyledFormItem } from "../NewSurveyConfig.styled";

export interface BasicInformationFormProps {
  setFormData: (formData: SurveyBasicInformationData) => void;
}

const BasicInformationForm: React.FC<BasicInformationFormProps> = ({
  setFormData,
}) => {
  const [form] = Form.useForm();
  const [userUId, setUserUId] = useState<any>();
  const dispatch = useAppDispatch();

  const basicInfo = useAppSelector(
    (state: RootState) => state.surveyConfig.basicInfo
  );

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const isLoading = useAppSelector(
    (state: RootState) => state.surveyConfig.loading
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await dispatch(performGetUserProfile());
      const { user_uid } = profile.payload;
      setUserUId(user_uid);
    };

    fetchUserProfile();

    //get basic information for survey in case it exists
    const fetchSurveyBasicInformation = async () => {
      if (survey_uid) {
        await dispatch(getSurveyBasicInformation({ survey_uid: survey_uid }));
      }
    };

    fetchSurveyBasicInformation();
  }, [dispatch]);

  useEffect(() => {
    if (basicInfo === null) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...basicInfo,
        planned_start_date: dayjs(basicInfo?.planned_start_date),
        planned_end_date: dayjs(basicInfo?.planned_end_date),
      });

      // Setting the data to parent
      const fieldsValue = fieldValuesToformValues(form.getFieldsValue());
      setFormData({ ...fieldsValue });
    }
  }, [basicInfo]);

  const fieldValuesToformValues = (
    objValues: any
  ): SurveyBasicInformationData => {
    return {
      ...objValues,
      survey_uid: basicInfo?.survey_uid ? basicInfo?.survey_uid : null,
      planned_start_date: dayjs(objValues.planned_start_date).format(
        "YYYY-MM-DD"
      ),
      planned_end_date: dayjs(objValues.planned_end_date).format("YYYY-MM-DD"),
      config_status: basicInfo?.config_status
        ? basicInfo?.config_status
        : "In Progress - Configuration",
      state: basicInfo?.state ? basicInfo?.state : "Draft",
      created_by_user_uid: userUId,
    };
  };
  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const formValues: SurveyBasicInformationData =
      fieldValuesToformValues(allValues);
    setFormData(formValues); // Update form data in the parent component
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <BasicInformationFormWrapper data-testid="BasicInformationForm">
      <Title>Basic Information</Title>

      <p style={{ fontSize: 14 }}>
        Please fill out the basic information about your survey
      </p>
      <TwoColumnForm form={form} onValuesChange={handleFormValuesChange}>
        <Row gutter={36}>
          <Col span={10}>
            <StyledFormItem
              required
              label={
                <span>
                  Survey name&nbsp;
                  <StyledTooltip title="The survey name will be the label you see for your survey throughout the web app and other SurveyStream generated outputs like Google Drive folders. Example: ADP 2.0 Round 1">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              name="survey_name"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ display: "block" }}
            >
              <Input
                id="basic-information-survey-name"
                placeholder="Enter survey name"
                style={{ width: "100%" }}
              />
            </StyledFormItem>

            <StyledFormItem
              name="project_name"
              label={
                <span>
                  Project name (optional)&nbsp;
                  <StyledTooltip title="The project name can be used to group together multiple related surveys, such as different survey rounds. Example: ADP 2.0">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ display: "block" }}
            >
              <Input
                id="basic-information-project-name"
                placeholder="Enter project name"
                style={{ width: "100%" }}
              />
            </StyledFormItem>

            <StyledFormItem
              style={{ display: "block", marginTop: "37px" }}
              required
              label={
                <span>
                  Survey method&nbsp;
                  <StyledTooltip title="The survey method can help determine how other parts of SurveyStream will be setup for your survey.">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              name="surveying_method"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                id="basic-information-survey-method"
                placeholder="Choose survey method"
                style={{ width: "100%" }}
              >
                <Select.Option value="in-person">In-person</Select.Option>
                <Select.Option value="phone">Phone</Select.Option>
                <Select.Option value="mixed-mode">Mixed Mode</Select.Option>
              </Select>
            </StyledFormItem>

            <StyledFormItem
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="planned_start_date"
              style={{ display: "block" }}
              label={
                <span>
                  Systems readiness start date (YYYY-MM-DD)&nbsp;
                  <StyledTooltip title="The systems readiness start date is the date at which your team will begin using SurveyStream to support survey activities.">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
            >
              <DatePicker
                id="basic-information-start-date"
                placeholder="Choose start date"
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
              />
            </StyledFormItem>
          </Col>

          <Col span={10}>
            <StyledFormItem
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={
                <span>
                  Survey ID&nbsp;
                  <StyledTooltip title="It has to be a unique ID. Naming convention is ‘survey name + round name’. Ex: adp2.0_r1. It is used to name the prod tracker and dq tracker tables. Please limit the ID to 25 characters.">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              name="survey_id"
              style={{ display: "block" }}
            >
              <Input
                id="basic-information-survey-id"
                placeholder="Enter survey ID"
                style={{ width: "100%" }}
              />
            </StyledFormItem>

            <StyledFormItem
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="survey_description"
              style={{ display: "block" }}
              label={
                <span>
                  Survey description&nbsp;
                  <StyledTooltip title="The survey description can help provide additional context about your survey to other SurveyStream users.">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
            >
              <TextArea
                id="basic-information-survey-description"
                placeholder="Survey description"
                style={{ width: "100%" }}
              ></TextArea>
            </StyledFormItem>

            <StyledFormItem
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="irb_approval"
              label={
                <span>
                  Have you received an IRB approval?&nbsp;
                  <StyledTooltip title="The IRB approval checkbox serves as a reminder to your team to secure ethics approvals before beginning survey activities.">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select
                id="basic-information-irb-approval"
                style={{ width: "100%" }}
                placeholder="Yes, no, pending"
              >
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
              </Select>
            </StyledFormItem>

            <StyledFormItem
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={
                <span>
                  Systems end date (YYYY-MM-DD)&nbsp;
                  <StyledTooltip title="The systems end date is the date when your team is projected to finish using SurveyStream to support survey activities.">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              name="planned_end_date"
              style={{ display: "block" }}
            >
              <DatePicker
                id="basic-information-end-date"
                placeholder="Choose end date"
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
              />
            </StyledFormItem>
          </Col>
        </Row>
      </TwoColumnForm>
    </BasicInformationFormWrapper>
  );
};

export default BasicInformationForm;
