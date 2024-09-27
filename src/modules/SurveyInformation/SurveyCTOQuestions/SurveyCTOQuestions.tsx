import {
  Title,
  MainWrapper,
  HeaderContainer,
} from "../../../shared/Nav.styled";

import { Form, Select, message, Alert } from "antd";
import {
  FooterWrapper,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  QuestionsForm,
  QuestionsFormTitle,
  SCTOQuestionsButton,
  SCTOLoadErrorArea,
} from "./SurveyCTOQuestions.styled";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionWrap,
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
import { getSurveyLocationGeoLevels } from "../../../redux/surveyLocations/surveyLocationsActions";
import {
  resetSurveyCTOQuestionsForm,
  setSurveyCTOQuestionsForm,
} from "../../../redux/surveyCTOQuestions/surveyCTOQuestionsSlice";
import { SurveyCTOQuestionsForm } from "../../../redux/surveyCTOQuestions/types";
import { GlobalStyle } from "../../../shared/Global.styled";
import Container from "../../../components/Layout/Container";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";

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
  const [hasError, setHasError] = useState<boolean>(false);
  const [surveyCTOErrorMessages, setSurveyCTOErrorMessages] = useState<
    string[]
  >([]);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.surveyCTOQuestions.loading
  );
  const surveyCTOQuestionsForm = useAppSelector(
    (state: RootState) => state.surveyCTOQuestions.surveyCTOQuestionsForm
  );
  const surveyCTOQuestions = useAppSelector(
    (state: RootState) => state.surveyCTOQuestions.surveyCTOQuestions
  );
  const surveyLocationGeoLevels = useAppSelector(
    (state: RootState) => state.surveyLocations.surveyLocationGeoLevels
  );

  const fetchSurveyLocationGeoLevels = async () => {
    if (survey_uid != undefined) {
      await dispatch(getSurveyLocationGeoLevels({ survey_uid: survey_uid }));
    }
  };

  const handleFormChange = (changedFields: any[]) => {
    const fieldName: string = changedFields[0]["name"];
    const fieldValue = changedFields[0]["value"];

    dispatch(
      setSurveyCTOQuestionsForm({
        ...surveyCTOQuestionsForm,
        [fieldName]: fieldValue,
      })
    );
  };

  const loadFormQuestions = async (refresh = false) => {
    setLoading(true);
    setHasError(false);
    setSurveyCTOErrorMessages([]);
    const errorMessages: string[] = [];
    if (form_uid != undefined) {
      const questionsRes = await dispatch(
        await getCTOFormQuestions({ formUid: form_uid, refresh: refresh })
      );

      if (questionsRes.payload?.error) {
        if (questionsRes.payload?.error.includes("ResourceNotFoundException")) {
          errorMessages.push(
            "The resource is not found. Either the SCTO server name is wrong, or access is not given."
          );
        } else if (questionsRes.payload?.error.includes("Client Error")) {
          errorMessages.push(
            "Either Main Form ID is wrong or access is not given"
          );
        } else {
          errorMessages.push(questionsRes.payload?.error);
        }
        setHasError(true);
      } else if (questionsRes.payload?.errors) {
        setHasError(true);
        // Check if the error message is an array
        if (Array.isArray(questionsRes.payload?.errors)) {
          questionsRes.payload?.errors.forEach(
            (error: string, index: number) => {
              errorMessages.push(error);
            }
          );
        } else {
          errorMessages.push("An unknown error occurred");
        }
        setSurveyCTOErrorMessages(errorMessages);
      }

      //dispatch twice if refresh
      if (refresh) {
        const refreshRes = await dispatch(
          getCTOFormQuestions({ formUid: form_uid })
        );

        if (refreshRes.payload?.message) {
          setHasError(true);
          setSurveyCTOErrorMessages([
            'Could not find SCTO form questions, please click the "Load questions from SCTO" button to retry.',
          ]);
        }
      }
    } else {
      message.error(
        "Kindly check if the form_uid is provided on the url to proceed."
      );
    }
    setLoading(false);
  };

  const loadFormMappings = async () => {
    if (form_uid != undefined) {
      const res = await dispatch(getSCTOFormMapping({ formUid: form_uid }));
      const formData: any = res.payload;
      await setSurveySCTOQuestionsData(formData);
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
        const formattedData = Object.entries(formData).reduce(
          (result: { [key: string]: any }, [key, value]) => {
            if (key.includes("locations.")) {
              const formattedKey = key.replace("locations.", "");
              (result.locations as { [key: string]: any }) =
                result.locations || {};
              result.locations[formattedKey] = value;
            } else {
              result[key] = value;
            }
            return result;
          },
          { locations: {} }
        );

        if (surveyCTOQuestionsForm.new_form) {
          formRes = await dispatch(
            postSCTOFormMapping({
              ctoFormMappingData: formattedData as SurveyCTOQuestionsForm,
              formUid: form_uid,
            })
          );
        } else {
          formRes = await dispatch(
            putSCTOFormMapping({
              ctoFormMappingData: formattedData as SurveyCTOQuestionsForm,
              formUid: form_uid,
            })
          );
        }

        if (formRes.payload.success === false) {
          message.error(formRes.payload.message);
          return;
        } else {
          message.success("surveyCTOForm mapping updated successfully");
          navigate(`/survey-configuration/${survey_uid}`);
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

  const renderQuestionsSelectArea = () => {
    if (isLoading) {
      return <FullScreenLoader />;
    }
    if (!isLoading && hasError) {
      return (
        <SCTOLoadErrorArea>
          <br />
          The SurveyCTO form definition could not be loaded due to the following
          errors:
          <br />
          <br />
          {surveyCTOErrorMessages.map((error, index) => {
            const key = "uniqueKey" + index + Date.now();
            return (
              <div key={key}>
                <Alert message={error} type="error" />
                <br />
              </div>
            );
          })}
        </SCTOLoadErrorArea>
      );
    }

    // </>
    if (!hasError && !isLoading) {
      return (
        <QuestionsForm form={form} onFieldsChange={handleFormChange}>
          <QuestionsFormTitle>Questions to be mapped</QuestionsFormTitle>

          <StyledFormItem
            initialValue={surveyCTOQuestionsForm?.survey_status}
            rules={[
              {
                required: false,
                message: "Please enter survey status",
              },
              {
                validator: (_: any, value: string | undefined) => {
                  const valueOccurrences = Object.values(
                    surveyCTOQuestionsForm
                  ).filter(
                    (v) =>
                      v === value &&
                      value !== undefined &&
                      value !== null &&
                      value !== ""
                  ).length;

                  if (valueOccurrences > 1) {
                    return Promise.reject("Duplicate value!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            name="survey_status"
            label={
              <span>
                Survey status&nbsp;
                <StyledTooltip title="Select the variable that is used to track the overall status of the survey. It will be used for tracking productivity, data quality and assignments.">
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
            rules={[
              {
                required: false,
                message: "Please enter revisit section",
              },
              {
                validator: (_: any, value: string | undefined) => {
                  const valueOccurrences = Object.values(
                    surveyCTOQuestionsForm
                  ).filter(
                    (v) =>
                      v === value &&
                      value !== undefined &&
                      value !== null &&
                      value !== ""
                  ).length;

                  if (valueOccurrences > 1) {
                    return Promise.reject("Duplicate value!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            name="revisit_section"
            label={
              <span>
                Revisit Section&nbsp;
                <StyledTooltip title="It is a comma separated list of modules which are not completed and flagged for revisit for a survey that is not completed.">
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
              {
                validator: (_: any, value: string | undefined) => {
                  const valueOccurrences = Object.values(
                    surveyCTOQuestionsForm
                  ).filter(
                    (v) =>
                      v === value &&
                      value !== undefined &&
                      value !== null &&
                      value !== ""
                  ).length;

                  if (valueOccurrences > 1) {
                    return Promise.reject("Duplicate value!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            name="target_id"
            label={
              <span>
                Target ID&nbsp;
                <StyledTooltip title="Select the variable that is used to track the Target ID. It will be used for tracking productivity, data quality and assignments.">
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
                message: "Please enter surveyor ID",
              },
              {
                validator: (_: any, value: string | undefined) => {
                  const valueOccurrences = Object.values(
                    surveyCTOQuestionsForm
                  ).filter(
                    (v) =>
                      v === value &&
                      value !== undefined &&
                      value !== null &&
                      value !== ""
                  ).length;

                  if (valueOccurrences > 1) {
                    return Promise.reject("Duplicate value!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            name="enumerator_id"
            label={
              <span>
                Surveyor ID&nbsp;
                <StyledTooltip title="Select the variable that is used to track the Surveyor ID. It will be used for tracking productivity, data quality and assignments.">
                  <QuestionCircleOutlined />
                </StyledTooltip>
              </span>
            }
            style={{ display: "block" }}
          >
            {renderQuestionsSelect()}
          </StyledFormItem>
          {renderLocationsSelect()}
        </QuestionsForm>
      );
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

  const renderLocationsSelect = () => {
    const numGeoLevels = surveyLocationGeoLevels.length;

    const fields = Array.from({ length: numGeoLevels }, (_, index) => {
      const geoLevel: {
        geo_level_name?: string;
      } = surveyLocationGeoLevels[index];
      const location_field = `location_${index + 1}`;

      return (
        <StyledFormItem
          key={index}
          initialValue={surveyCTOQuestionsForm?.locations?.location_field}
          required
          rules={[
            {
              required: true,
              message: `Please enter ${geoLevel?.geo_level_name} ID`,
            },
            {
              validator: (_: any, value: string | undefined) => {
                const valueOccurrences = Object.values(
                  surveyCTOQuestionsForm
                ).filter((v) => v === value).length;

                if (valueOccurrences > 1) {
                  return Promise.reject("Duplicate value!");
                }
                return Promise.resolve();
              },
            },
          ]}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          name={`locations.${location_field}`}
          label={
            <span>
              {geoLevel?.geo_level_name} ID&nbsp;
              <StyledTooltip title={`${geoLevel?.geo_level_name} ID`}>
                <QuestionCircleOutlined />
              </StyledTooltip>
            </span>
          }
          style={{ display: "block" }}
        >
          {renderQuestionsSelect()}
        </StyledFormItem>
      );
    });
    return fields;
  };

  const setSurveySCTOQuestionsData = (formData: any) => {
    form.setFieldsValue({
      survey_status: formData?.survey_status,
    });
    form.setFieldsValue({
      revisit_section: formData?.revisit_section,
    });
    form.setFieldsValue({
      target_id: formData?.target_id,
    });
    form.setFieldsValue({
      enumerator_id: formData?.enumerator_id,
    });

    if (formData?.locations) {
      Object.entries(formData.locations).forEach(([key, value], index) => {
        const dynamicKey = `locations.location_${index + 1}`;
        form.setFieldsValue({
          [`${dynamicKey}`]: value,
        });
      });
    }
  };

  const handleFormUID = () => {
    if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
      try {
        const sctoForm = dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        ).then((res) => {
          if (res.payload[0]?.form_uid) {
            navigate(
              `/survey-information/survey-cto-questions/${survey_uid}/${res.payload[0]?.form_uid}`
            );
          } else {
            message.error("Kindly configure SCTO Form to proceed");
            navigate(
              `/survey-information/survey-cto-information/${survey_uid}`
            );
          }
        });
      } catch (error) {
        console.log("Error fetching sctoForm:", error);
      }
    }
  };

  useEffect(() => {
    handleFormUID();

    if (form_uid) {
      loadFormQuestions();
      fetchSurveyLocationGeoLevels();
      loadFormMappings();
    }

    return () => {
      dispatch(resetSurveyCTOQuestionsForm());
      form.resetFields();
    };
  }, [navigate]);

  return (
    <>
      <GlobalStyle />

      <Container />
      <HeaderContainer>
        <Title> SurveyCTO Questions</Title>

        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        >
          <SCTOQuestionsButton
            type="dashed"
            loading={loading}
            onClick={() => loadFormQuestions(true)}
            disabled={form_uid == undefined}
          >
            Load questions from SCTO form
          </SCTOQuestionsButton>
        </div>
      </HeaderContainer>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <MainWrapper>
          <DescriptionWrap>
            <DescriptionText>
              This step has 3 pre-requisites:
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
          </DescriptionWrap>
          {renderQuestionsSelectArea()}
        </MainWrapper>
      </div>
      <FooterWrapper>
        <ContinueButton loading={loading} onClick={handleContinue}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default SurveyCTOQuestions;
