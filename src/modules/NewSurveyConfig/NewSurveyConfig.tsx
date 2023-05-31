import { useNavigate } from "react-router-dom";
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
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../shared/FooterBar.styled";
import { useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hooks";
import { SurveyBasicInformationData } from "../../redux/surveyConfig/types";
import { postBasicInformation } from "../../redux/surveyConfig/surveyConfigActions";

function NewSurveyConfig() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<SurveyBasicInformationData | null>(
    null
  );
  const [messageApi, contextHolder] = message.useMessage();
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

  const handleSave = async () => {
    try {
      console.log("formData", formData);
    } catch (error) {
      console.error("error", error);
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
        <SideMenu />
        <MainWrapper>
          {contextHolder}
          <BasicInformationForm setFormData={setFormData} />
        </MainWrapper>
      </div>
      <FooterWrapper>
        <SaveButton
          onClick={handleSave}
          loading={isLoading}
          disabled={formData === null}
        >
          Save
        </SaveButton>
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
