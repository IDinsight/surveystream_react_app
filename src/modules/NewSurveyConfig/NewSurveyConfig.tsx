import { useState } from "react";
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
import { SurveyBasicInformationData } from "../../redux/surveyConfig/types";
import { postBasicInformation } from "../../redux/surveyConfig/surveyConfigActions";
import { useNavigate } from "react-router-dom";

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
  const [formData, setFormData] = useState<SurveyBasicInformationData | null>(
    null
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.surveyConfig.loading
  );
  const showError = useAppSelector(
    (state: RootState) => state.reducer.surveyConfig.error
  );

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const handleContinue = async () => {
    try {
      if (formData === null) {
        messageApi.open({
          type: "error",
          content: "Kindly fill in form to continue",
        });
        return;
      }
      console.log("formData", formData);

      const validationRules = [
        { key: "survey_name", message: "Please fill in the Survey name" },
        { key: "survey_id", message: "Please fill in the Survey ID" },

        {
          key: "description",
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
        if (!formData?.[rule.key]) {
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

      const response = await dispatch(postBasicInformation(formData));

      if (response.payload.success) {
        messageApi.open({
          type: "success",
          content: response.payload.data.message,
        });

        if (stepIndex["sidebar"] < 1) {
          setStepIndex((prev: IStepIndex) => ({
            ...prev,
            sidebar: prev["sidebar"] + 1,
          }));
        }

        /*
        If we are on second index in sidebar then 
        increament only module questionnaire step's index
      */
        if (stepIndex["sidebar"] == 1) {
          if (stepIndex["mqIndex"] >= 2) return;

          setStepIndex((prev: IStepIndex) => ({
            ...prev,
            mqIndex: prev["mqIndex"] + 1,
          }));
        }
      } else {
        messageApi.open({
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

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title>New survey config</Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu stepIndex={stepIndex} setStepIndexHandler={setStepIndex} />
        <MainWrapper>
          {contextHolder}
          {stepIndex["sidebar"] === 0 ? (
            <BasicInformationForm setFormData={setFormData} />
          ) : (
            <ModuleQuestionnaire stepIndex={stepIndex["mqIndex"]} />
          )}
        </MainWrapper>
      </div>
      <FooterWrapper>
        <ContinueButton
          onClick={handleContinue}
          loading={isLoading}
          disabled={formData === null}
        >
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default NewSurveyConfig;
