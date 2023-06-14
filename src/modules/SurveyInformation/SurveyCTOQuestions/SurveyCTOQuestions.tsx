import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  MainWrapper,
} from "../../../shared/Nav.styled";

import { Form, Select, message } from "antd";
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
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionWrap,
  DescriptionTitle,
  DescriptionText,
  StyledFormItem,
  StyledTooltip,
} from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { useEffect, useState } from "react";
import {
  getCTOFormQuestions,
  getSCTOFormMapping,
  postSCTOFormMapping,
  putSCTOFormMapping,
} from "../../../redux/surveyCTOQuestions/surveyCTOQuestionsActions";

function SurveyCTOQuestions() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid?: string }>() ?? {
    form_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.reducer.surveys.activeSurvey
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.surveyCTOQuestions.loading
  );
  const surveyCTOQuestionsForm = useAppSelector(
    (state: RootState) =>
      state.reducer.surveyCTOQuestions.surveyCTOQuestionsForm
  );
  const surveyCTOQuestions = useAppSelector(
    (state: RootState) => state.reducer.surveyCTOQuestions.surveyCTOQuestions
  );

  useEffect(() => {
    loadFormMappings();
  }, [dispatch]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const loadFormQuestions = async () => {
    setLoading(true);
    if (form_uid != undefined) {
      const questionsRes = await dispatch(
        getCTOFormQuestions({ formUid: form_uid })
      );
      console.log("questionsRes", questionsRes);
    } else {
      message.error(
        "Kindly check if the form_uid is provided on the url to proceed."
      );
    }
    setLoading(false);
  };

  const loadFormMappings = () => {
    if (form_uid != undefined) {
      dispatch(getSCTOFormMapping({ formUid: form_uid }));
    } else {
      message.error(
        "Kindly check if the form_uid is provided on the url to proceed."
      );
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);

      await form.validateFields();
      if (form_uid !== undefined) {
        let formRes;
        const formData = form.getFieldsValue();

        if (surveyCTOQuestionsForm) {
          formRes = await dispatch(
            putSCTOFormMapping({
              ctoFormMappingData: formData,
              formUid: form_uid,
            })
          );
        } else {
          formRes = await dispatch(
            postSCTOFormMapping({
              ctoFormMappingData: formData,
              formUid: form_uid,
            })
          );
        }

        if (formRes.payload.success === false) {
          message.error(formRes.payload.message);
          return;
        } else {
          message.success("surveyCTOForm mapping updated successfully");
          navigate(
            `/survey-information/field-supervisor-roles/add/${survey_uid}`
          );
        }
      } else {
        message.error(
          "Kindly check if the form_uid is provided on the url to proceed."
        );
      }

      // Save successful, navigate to the next step
    } catch (error) {
      message.error("Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionsSelect = () => {
    return (
      <Select showSearch optionFilterProp="children">
        {surveyCTOQuestions?.questions?.map(
          (question: { question_name: string }) => (
            <Select.Option
              key={question.question_name}
              value={question.question_name}
            >
              {question.question_name}
            </Select.Option>
          )
        )}
      </Select>
    );
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

            <SCTOQuestionsButton
              type="dashed"
              loading={loading}
              onClick={loadFormQuestions}
              disabled={form_uid == undefined}
            >
              Load questions from SCTO form
            </SCTOQuestionsButton>
          </DescriptionWrap>

          {isLoading ? (
            <FullScreenLoader />
          ) : (
            <QuestionsForm form={form}>
              <QuestionsFormTitle>Questions to be mapped</QuestionsFormTitle>

              <StyledFormItem
                initialValue={surveyCTOQuestionsForm?.survey_status}
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter survey status",
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                name="survey_status"
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
                {renderQuestionsSelect()}
              </StyledFormItem>

              <StyledFormItem
                initialValue={surveyCTOQuestionsForm?.revisit_section}
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter revisit section",
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                name="revisit_section"
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
                {renderQuestionsSelect()}
              </StyledFormItem>

              <StyledFormItem
                initialValue={surveyCTOQuestionsForm?.target_id}
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter target ID",
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                name="target_id"
                label={
                  <span>
                    Target ID&nbsp;
                    <StyledTooltip title="Target ID">
                      <QuestionCircleOutlined />
                    </StyledTooltip>
                  </span>
                }
                style={{ display: "block" }}
              >
                {renderQuestionsSelect()}
              </StyledFormItem>

              <StyledFormItem
                initialValue={surveyCTOQuestionsForm?.enumerator_id}
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter enumerator ID",
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                name="enumerator_id"
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
                {renderQuestionsSelect()}
              </StyledFormItem>
              <StyledFormItem>
                <p>If location is used in the survey</p>
              </StyledFormItem>

              <StyledFormItem
                initialValue={surveyCTOQuestionsForm?.locations?.state_id}
                required
                rules={[
                  {
                    required: false,
                    message: "Please enter state ID",
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                name="locations.state_id"
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
                {renderQuestionsSelect()}
              </StyledFormItem>

              <StyledFormItem
                initialValue={surveyCTOQuestionsForm?.locations?.district_id}
                required
                rules={[
                  {
                    required: false,
                    message: "Please enter district ID",
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                name="locations.district_id"
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
                {renderQuestionsSelect()}
              </StyledFormItem>

              <StyledFormItem
                initialValue={surveyCTOQuestionsForm?.locations?.block_id}
                required
                rules={[
                  {
                    required: false,
                    message: "Please enter block ID",
                  },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                name="locations.block_id"
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
                {renderQuestionsSelect()}
              </StyledFormItem>
            </QuestionsForm>
          )}
        </MainWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton loading={loading} onClick={handleContinue}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyCTOQuestions;
