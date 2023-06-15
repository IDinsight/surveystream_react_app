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
import moment from "moment";
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
    (state: RootState) => state.reducer.surveyConfig.basicInfo
  );

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.surveyConfig.loading
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
        form.setFieldsValue({
          systemsReadinessStartDate: moment(basicInfo?.planned_start_date),
        });
        form.setFieldsValue({
          systemsEndDate: moment(basicInfo?.planned_end_date),
        });
      }
    };

    fetchSurveyBasicInformation();
  }, [dispatch]);

  useEffect(() => {
    if (basicInfo === null) {
      form.resetFields();
    }
  }, [basicInfo]);

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const formValues: SurveyBasicInformationData = {
      survey_uid: basicInfo?.survey_uid ? basicInfo?.survey_uid : null,
      survey_id: allValues.surveyID,
      survey_name: allValues.surveyName,
      project_name: allValues.projectName,
      survey_description: allValues.surveyDescription,
      surveying_method: allValues.surveyMethod,
      irb_approval: allValues.irbApproval,
      planned_start_date: moment(allValues.systemsReadinessStartDate).format(
        "YYYY-MM-DD"
      ),
      planned_end_date: moment(allValues.systemsEndDate).format("YYYY-MM-DD"),
      config_status: "In Progress - Configuration",
      state: "Draft",
      created_by_user_uid: userUId,
    };

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
              initialValue={basicInfo?.survey_name}
              required
              label={
                <span>
                  Survey name&nbsp;
                  <StyledTooltip title="It will be used to refer to the survey in the web app and to create folders on Google Drive. Ex: Digital Green, ADP 2.0 R1. For multiple rounds of the surveys, you’ll have to create different survey names">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              name="surveyName"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ display: "block" }}
            >
              <Input
                placeholder="Enter survey name"
                style={{ width: "100%" }}
              />
            </StyledFormItem>

            <StyledFormItem
              initialValue={basicInfo?.project_name}
              name="projectName"
              label={
                <span>
                  Project name (optional)&nbsp;
                  <StyledTooltip title="It can be used to group together multiple rounds. Ex: ADP 2.0 would be the project name, ADP 2.0 R1 and ADP 2.0 R2 would be the survey names.">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ display: "block" }}
            >
              <Input
                placeholder="Enter project name"
                style={{ width: "100%" }}
              />
            </StyledFormItem>

            <StyledFormItem
              initialValue={basicInfo?.surveying_method}
              style={{ display: "block", marginTop: "37px" }}
              required
              label={
                <span>
                  Survey method&nbsp;
                  <StyledTooltip title="Survey method">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              name="surveyMethod"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Select
                placeholder="Choose survey method"
                style={{ width: "100%" }}
              >
                <Select.Option value="in-person">In-person</Select.Option>
                <Select.Option value="phone">Phone</Select.Option>
              </Select>
            </StyledFormItem>

            <StyledFormItem
              initialValue={
                basicInfo?.planned_start_date
                  ? moment(basicInfo?.planned_start_date)
                  : null
              }
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="systemsReadinessStartDate"
              style={{ display: "block" }}
              label={
                <span>
                  Systems readiness start date (YYYY-MM-DD)&nbsp;
                  <StyledTooltip title="Systems readiness start date (YYYY-MM-DD)">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
            >
              <DatePicker
                placeholder="Choose start date"
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
              />
            </StyledFormItem>
          </Col>

          <Col span={10}>
            <StyledFormItem
              initialValue={basicInfo?.survey_id}
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
              name="surveyID"
              style={{ display: "block" }}
            >
              <Input placeholder="Enter survey ID" style={{ width: "100%" }} />
            </StyledFormItem>

            <StyledFormItem
              initialValue={basicInfo?.survey_description}
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="surveyDescription"
              style={{ display: "block" }}
              label={
                <span>
                  Survey description&nbsp;
                  <StyledTooltip title="Survey description">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
            >
              <TextArea
                placeholder="Household surveys of ~ 56000 households to measure ~200 indicators"
                style={{ width: "100%" }}
              ></TextArea>
            </StyledFormItem>

            <StyledFormItem
              initialValue={basicInfo?.irb_approval}
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="irbApproval"
              label={
                <span>
                  Have you received an IRB approval? (optional)&nbsp;
                  <StyledTooltip title="IRB approval">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select style={{ width: "100%" }} placeholder="Yes, no, pending">
                <Select.Option value="Yes">Yes</Select.Option>
                <Select.Option value="No">No</Select.Option>
                <Select.Option value="Pending">Pending</Select.Option>
              </Select>
            </StyledFormItem>

            <StyledFormItem
              initialValue={
                basicInfo?.planned_end_date
                  ? moment(basicInfo?.planned_end_date)
                  : null
              }
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={
                <span>
                  Systems end date (YYYY-MM-DD)&nbsp;
                  <StyledTooltip title="Systems end date (YYYY-MM-DD)">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              name="systemsEndDate"
              style={{ display: "block" }}
            >
              <DatePicker
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
