import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { message } from "antd";
import Header from "../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  MainWrapper,
} from "../../shared/Nav.styled";
import SideMenu from "./SideMenu";
import BasicInformationForm from "./BasicInformation/BasicInformationForm";
import { Form } from "antd";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../shared/FooterBar.styled";
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
  const [form] = Form.useForm();
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
    (state: RootState) => state.reducer.surveyConfig.loading
  );
  const showError = useAppSelector(
    (state: RootState) => state.reducer.surveyConfig.error
  );
  const activeSurvey = useAppSelector(
    (state: RootState) => state.reducer.surveys.activeSurvey
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
              content: "Survey module questionnaire data updated successfully.",
            });
            navigate(
              `/module-selection/${
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
          console.error("post error", error);
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
          key: "survey_description",
          message: "Please fill in the Survey description",
        },
        { key: "irb_approval", message: "Please fill in the IRB approval" },
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
          content: "Your draft survey has been updated successfully.",
        });
        const newSurveyUid = response.payload.survey.survey_uid;
        const currentURL = window.location.href;
        const newURL = `${currentURL}/${newSurveyUid}`;

        window.history.replaceState(null, "", newURL);
        setSurveyUid(newSurveyUid);

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
      console.error("post error", error);
      messageApi.open({
        type: "error",
        content: showError.payload.message,
      });
    }
  };

  useEffect(() => {
    if (survey_uid === undefined) {
      dispatch(clearBasicInfo());
      dispatch(clearModuleQuestionnaire());
      dispatch(setActiveSurvey(null));
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title>
          New survey config
          {activeSurvey?.survey_name ? ` : ${activeSurvey?.survey_name}` : ""}
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
        </MainWrapper>
      </div>
      <FooterWrapper>
        <SaveButton
          onClick={handleBack}
          disabled={stepIndex.sidebar == 0 || stepIndex["mqIndex"] == 0}
        >
          Back
        </SaveButton>

        <ContinueButton
          onClick={handleContinue}
          loading={isLoading}
          disabled={stepIndex.sidebar === 0 ? basicformData === null : false}
        >
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default NewSurveyConfig;
