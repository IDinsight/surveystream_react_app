import React, { FC } from "react";
import { Col, Input, Row, Select, Tooltip } from "antd";
import { DatePicker } from "antd";
import {
  BasicInformationFormWrapper,
  StyledFormItem,
  TwoColumnForm,
} from "./BasicInformationForm.styled";
import { FormInstance } from "antd/lib/form";

export interface BasicInformationFormProps {
  form: FormInstance;
}
import { useForm } from "antd/es/form/Form";
import { QuestionCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const BasicInformationForm: FC<BasicInformationFormProps> = () => {
  const [form] = useForm();

  return (
    <BasicInformationFormWrapper data-testid="BasicInformationForm">
      <p style={{ fontSize: 16 }}>Basic Information</p>
      <p style={{ fontSize: 14 }}>
        Please fill out the basic information about your survey
      </p>
      <TwoColumnForm form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <StyledFormItem
              required
              label={
                <span>
                  Survey name&nbsp;
                  <Tooltip title="It will be used to refer to the survey in the web app and to create folders on Google Drive. Ex: Digital Green, ADP 2.0 R1. For multiple rounds of the surveys, you’ll have to create different survey names">
                    <QuestionCircleOutlined />
                  </Tooltip>
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
              name="projectName"
              label={
                <span>
                  Project name (optional)&nbsp;
                  <Tooltip title="It can be used to group together multiple rounds. Ex: ADP 2.0 would be the project name, ADP 2.0 R1 and ADP 2.0 R2 would be the survey names.">
                    <QuestionCircleOutlined />
                  </Tooltip>
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
              style={{ display: "block", marginTop: "37px" }}
              required
              label={
                <span>
                  Survey method&nbsp;
                  <Tooltip title="Survey method">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              name="surveyMethod"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
            >
              <Input
                placeholder="Choose survey method"
                style={{ width: "100%" }}
              />
            </StyledFormItem>

            <StyledFormItem
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="systemsReadinessStartDate"
              style={{ display: "block" }}
              label={
                <span>
                  Systems readiness start date (YYYY-MM-DD)&nbsp;
                  <Tooltip title="Systems readiness start date (YYYY-MM-DD)">
                    <QuestionCircleOutlined />
                  </Tooltip>
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

          <Col span={12}>
            <StyledFormItem
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={
                <span>
                  Survey ID&nbsp;
                  <Tooltip title="It has to be a unique ID. Naming convention is ‘survey name + round name’. Ex: adp2.0_r1. It is used to name the prod tracker and dq tracker tables. Please limit the ID to 25 characters.">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
              name="surveyID"
              style={{ display: "block" }}
            >
              <Input placeholder="Enter survey ID" style={{ width: "100%" }} />
            </StyledFormItem>

            <StyledFormItem
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="surveyDescription"
              style={{ display: "block" }}
              label={
                <span>
                  Survey description&nbsp;
                  <Tooltip title="Survey description">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </span>
              }
            >
              <TextArea
                placeholder="Household surveys of ~ 56000 households to measure ~200 indicators"
                style={{ width: "100%" }}
              ></TextArea>
            </StyledFormItem>

            <StyledFormItem
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="irbApproval"
              label={
                <span>
                  Have you received an IRB approval? (optional)&nbsp;
                  <Tooltip title="IRB approval">
                    <QuestionCircleOutlined />
                  </Tooltip>
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
              required
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              label={
                <span>
                  Systems end date (YYYY-MM-DD)&nbsp;
                  <Tooltip title="Systems end date (YYYY-MM-DD)">
                    <QuestionCircleOutlined />
                  </Tooltip>
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
