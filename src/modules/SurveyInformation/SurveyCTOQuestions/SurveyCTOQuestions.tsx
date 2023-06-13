import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  MainWrapper,
} from "../../../shared/Nav.styled";

import { Form, Select } from "antd";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  QuestionsForm,
  QuestionsFormTitle,
  SCTOQuestionsButton,
} from "./SurveyCTOQuestions.styled";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  DescriptionWrap,
  DescriptionTitle,
  DescriptionText,
  StyledFormItem,
  StyledTooltip,
} from "../SurveyInformation.styled";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";

function SurveyCTOQuestions() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const activeSurvey = useAppSelector(
    (state: RootState) => state.reducer.surveys.activeSurvey
  );
  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> {activeSurvey?.survey_name} </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <MainWrapper>
          <DescriptionWrap>
            <DescriptionTitle> SurveyCTO Questions </DescriptionTitle>

            <DescriptionText>
              This step has 2 pre-requisites:
              <ol>
                <li>
                  Data Manager access to the SCTO server has been provided to
                  surveystream.devs@idinsight.org
                </li>
                <li>
                  You can see surveystream.devs@idinsight.org as an active user
                  on SCTO
                </li>
                <li>
                  The main form ID shared will be the form used for main data
                  collection, the form has been deployed, and the variable names
                  will not change.
                </li>
              </ol>
            </DescriptionText>

            <SCTOQuestionsButton>
              Load questions from SCTO form
            </SCTOQuestionsButton>
          </DescriptionWrap>

          <QuestionsForm>
            <QuestionsFormTitle>Questions to be mapped</QuestionsFormTitle>

            <StyledFormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              name="surveyStatus"
              label={
                <span>
                  Survey status&nbsp;
                  <StyledTooltip title="Survey status">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select style={{ width: "100%" }}></Select>
            </StyledFormItem>

            <StyledFormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              name="revisitSection"
              label={
                <span>
                  Revisit Section&nbsp;
                  <StyledTooltip title="Revisit section">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select style={{ width: "100%" }}></Select>
            </StyledFormItem>

            <StyledFormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              name="targetId"
              label={
                <span>
                  Revisit Section&nbsp;
                  <StyledTooltip title="Target ID">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select style={{ width: "100%" }}></Select>
            </StyledFormItem>

            <StyledFormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              name="targetId"
              label={
                <span>
                  Enumerator ID&nbsp;
                  <StyledTooltip title="Enumerator ID">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select style={{ width: "100%" }}></Select>
            </StyledFormItem>
            <StyledFormItem>
              <p>If location is used in the survey</p>
            </StyledFormItem>

            <StyledFormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              name="stateID"
              label={
                <span>
                  State ID&nbsp;
                  <StyledTooltip title="State ID">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select style={{ width: "100%" }}></Select>
            </StyledFormItem>

            <StyledFormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              name="districtID"
              label={
                <span>
                  District ID&nbsp;
                  <StyledTooltip title="District ID">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select style={{ width: "100%" }}></Select>
            </StyledFormItem>

            <StyledFormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
              name="blockID"
              label={
                <span>
                  Block ID&nbsp;
                  <StyledTooltip title="Block ID">
                    <QuestionCircleOutlined />
                  </StyledTooltip>
                </span>
              }
              style={{ display: "block" }}
            >
              <Select style={{ width: "100%" }}></Select>
            </StyledFormItem>
          </QuestionsForm>
        </MainWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyCTOQuestions;
