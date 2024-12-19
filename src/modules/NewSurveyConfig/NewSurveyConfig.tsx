import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { message, Button } from "antd";

import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  MainWrapper,
} from "../../shared/Nav.styled";
import SideMenu from "./SideMenu";
import BasicInformationForm from "./BasicInformation/BasicInformationForm";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../shared/FooterBar.styled";
import { CustomBtn } from "../../shared/Global.styled";
import ModuleQuestionnaire from "./ModuleQuestionnaire";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import {
  SurveyBasicInformationData,
  SurveyModuleQuestionnaireData,
} from "../../redux/surveyConfig/types";
import {
  postBasicInformation,
  updateBasicInformation,
  updateSurveyModuleQuestionnaire,
} from "../../redux/surveyConfig/surveyConfigActions";
import {
  clearBasicInfo,
  clearModuleQuestionnaire,
} from "../../redux/surveyConfig/surveyConfigSlice";
import { setActiveSurvey } from "../../redux/surveyList/surveysSlice";
import { performGetUserProfile } from "../../redux/auth/authActions";
import { fetchSurveys } from "../../redux/surveyList/surveysActions";

export interface IStepIndex {
  sidebar: number;
  mqIndex: number; // mq stands for module questionnaire
}

function NewSurveyConfig() {
  const [messageApi, contextHolder] = message.useMessage();
  const [stepIndex, setStepIndex] = useState<IStepIndex>({
    sidebar: 0,
    mqIndex: 0,
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [surveyUid, setSurveyUid] = useState<string | undefined>(undefined);

  const [basicformData, setBasicFormData] =
    useState<SurveyBasicInformationData | null>(null);

  const [moduleQuestionnaireformData, setModuleFormData] =
    useState<SurveyModuleQuestionnaireData | null>(null);
  const isLoading = useAppSelector(
    (state: RootState) => state.surveyConfig.loading
  );
  const showError = useAppSelector(
    (state: RootState) => state.surveyConfig.error
  );
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const handleContinue = async () => {
    if (stepIndex.sidebar == 0) {
      return handleBasicContinue();
    } else {
      return handleModuleQuestionnaireContinue();
    }
  };

  const handleBack = async () => {
    if (stepIndex["sidebar"] == 1) {
      if (stepIndex["mqIndex"] == 0) return;

      setStepIndex((prev: IStepIndex) => ({
        ...prev,
        mqIndex: prev["mqIndex"] - 1,
      }));
    }
  };
  const handleModuleQuestionnaireContinue = async () => {
    if (stepIndex["sidebar"] == 1) {
      if (stepIndex["mqIndex"] >= 2) {
        if (moduleQuestionnaireformData === null) {
          messageApi.open({
            type: "error",
            content: "Kindly fill in form to continue",
          });
          return;
        }

        const validationRules = [
          {
            key: "target_mapping_criteria",
            message:
              "Please select the supervisor to target assignment criteria",
          },
          {
            key: "surveyor_mapping_criteria",
            message:
              "Please select the supervisor to surveyor assignment criteria",
          },
          {
            key: "supervisor_hierarchy_exists",
            message: "Please select the supervisor hierarchy",
          },
          {
            key: "target_assignment_criteria",
            message: "Please select the target assignment criteria",
          },
          {
            key: "reassignment_required",
            message: "Please select the reassignment required",
          },
          {
            key: "assignment_process",
            message: "Please select the assignment process",
          },
          {
            key: "supervisor_surveyor_relation",
            message: "Please select the supervisor surveyor relation",
          },
          {
            key: "language_location_mapping",
            message: "Please select the language location mapping",
          },
        ];

        const hasValidationErrors = !validationRules.every(
          (rule: { key: string; message: string }) => {
            const val =
              moduleQuestionnaireformData[
                rule.key as keyof SurveyModuleQuestionnaireData
              ];

            if (val === null || (Array.isArray(val) && val.length < 1)) {
              messageApi.open({
                type: "error",
                content: rule.message,
              });
              return false;
            }
            return true;
          }
        );

        if (hasValidationErrors) {
          return;
        }

        try {
          const response = await dispatch(
            updateSurveyModuleQuestionnaire({
              moduleQuestionnaireData: moduleQuestionnaireformData,
              surveyUid: survey_uid !== undefined ? survey_uid : surveyUid,
            })
          );
          if (response.payload.success) {
            message.open({
              type: "success",
              content: "Module questionnaire responses saved successfully.",
            });
            //set active survey
            dispatch(
              setActiveSurvey({
                survey_uid: survey_uid !== undefined ? survey_uid : surveyUid,
                survey_name: basicformData?.survey_name || "",
              })
            );

            localStorage.setItem(
              "activeSurvey",
              JSON.stringify({
                survey_uid: survey_uid !== undefined ? survey_uid : surveyUid,
                survey_name: basicformData?.survey_name || "",
              })
            );

            navigate(
              `/survey-configuration/${
                survey_uid !== undefined ? survey_uid : surveyUid
              }`
            );
          } else {
            message.open({
              type: "error",
              content: response.payload.error
                ? response.payload.error
                : response.payload.message,
            });
          }
        } catch (error) {
          // Handle any error
          messageApi.open({
            type: "error",
            content: showError.payload.message,
          });
        }
        return;
      }

      setStepIndex((prev: IStepIndex) => ({
        ...prev,
        mqIndex: prev["mqIndex"] + 1,
      }));
    }
  };

  const handleBasicContinue = async () => {
    try {
      if (basicformData === null) {
        messageApi.open({
          type: "error",
          content: "Kindly fill in form to continue",
        });
        return;
      }
      const validationRules = [
        { key: "survey_name", message: "Please fill in the Survey name" },
        { key: "survey_id", message: "Please fill in the Survey ID" },
        {
          key: "surveying_method",
          message: "Please fill in the Survey method",
        },
        {
          key: "planned_start_date",
          message: "Please fill in the System readiness start date",
        },
        {
          key: "planned_end_date",
          message: "Please fill in the Systems end date",
        },
      ];

      const hasValidationErrors = !validationRules.every((rule) => {
        if (!basicformData?.[rule.key]) {
          messageApi.open({
            type: "error",
            content: rule.message,
          });
          return false;
        }
        return true;
      });

      if (hasValidationErrors) {
        return;
      }

      let response;
      if (basicformData.survey_uid == null) {
        delete basicformData.survey_uid;
        response = await dispatch(postBasicInformation(basicformData));
      } else {
        response = await dispatch(
          updateBasicInformation({
            basicInformationData: basicformData,
            surveyUid: basicformData.survey_uid,
          })
        );
      }

      if (response.payload.success) {
        messageApi.open({
          type: "success",
          content: "Survey basic information saved successfully.",
        });

        // TODO: Check why response.payload have two different format
        let newSurveyUid;
        if (basicformData.survey_uid == null) {
          newSurveyUid = response.payload.survey.survey_uid;
        } else {
          newSurveyUid = response.payload.survey_uid;
        }
        const currentURL = window.location.href;
        const newURL = basicformData.survey_uid
          ? currentURL
          : `${currentURL}/${newSurveyUid}`;

        window.history.replaceState(null, "", newURL);
        setSurveyUid(newSurveyUid);

        // After saving the basic information, we need to update user profile
        // because it contains the list of surveys the user has created as survey admin
        dispatch(performGetUserProfile());

        if (stepIndex["sidebar"] < 1) {
          setStepIndex((prev: IStepIndex) => ({
            ...prev,
            sidebar: prev["sidebar"] + 1,
          }));
        }
      } else {
        message.open({
          type: "error",
          content: response.payload.error
            ? response.payload.error
            : response.payload.message,
        });
      }
    } catch (error) {
      // Handle any error
      messageApi.open({
        type: "error",
        content: showError.payload.message,
      });
    }
  };

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

  useEffect(() => {
    if (survey_uid === undefined) {
      dispatch(clearBasicInfo());
      dispatch(clearModuleQuestionnaire());
      dispatch(setActiveSurvey(null));
      setBasicFormData(null);
      setModuleFormData(null);
    }
  }, [dispatch]);

  return (
    <>
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title>
          {(() => {
            const activeSurveyData: any = localStorage.getItem("activeSurvey");
            const surveyName =
              (activeSurvey && activeSurvey.survey_name) ||
              (activeSurveyData && JSON.parse(activeSurveyData).survey_name) ||
              "";
            return surveyName ? `${surveyName}` : "New survey configuration";
          })()}
        </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu stepIndex={stepIndex} setStepIndexHandler={setStepIndex} />
        <MainWrapper>
          {contextHolder}
          {stepIndex["sidebar"] === 0 ? (
            <BasicInformationForm setFormData={setBasicFormData} />
          ) : (
            <ModuleQuestionnaire
              setFormData={setModuleFormData}
              stepIndex={stepIndex["mqIndex"]}
            />
          )}
          {isLoading ? (
            " "
          ) : (
            <div
              style={{
                display: "flex",
                marginBottom: "24px",
                marginTop: "24px",
              }}
            >
              <Button
                id="new-survey-config-save-button"
                onClick={handleBack}
                style={{
                  marginLeft: 50,
                  marginRight: 24,
                }}
                disabled={stepIndex.sidebar == 0 || stepIndex["mqIndex"] == 0}
              >
                Back
              </Button>

              <CustomBtn
                id="new-survey-config-continue-button"
                onClick={handleContinue}
                loading={isLoading}
                disabled={
                  stepIndex.sidebar === 0 ? basicformData === null : false
                }
              >
                {stepIndex.sidebar === 0
                  ? "Save"
                  : stepIndex["mqIndex"] >= 2
                  ? "Save"
                  : "Continue"}
              </CustomBtn>
            </div>
          )}
        </MainWrapper>
      </div>
    </>
  );
}

export default NewSurveyConfig;
