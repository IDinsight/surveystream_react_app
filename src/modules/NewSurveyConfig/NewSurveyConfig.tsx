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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ModuleQuestionnaire from "./ModuleQuestionnaire";

export interface IStepIndex {
  sidebar: number;
  mqIndex: number; // mq stands for module questionnaire
}

function NewSurveyConfig() {
  const [stepIndex, setStepIndex] = useState<IStepIndex>({
    sidebar: 0,
    mqIndex: 0,
  });
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const handleContinue = () => {
    // Ensure to not go ahead after second index
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
          {stepIndex["sidebar"] === 0 ? (
            <BasicInformationForm form={form} />
          ) : (
            <ModuleQuestionnaire stepIndex={stepIndex["mqIndex"]} />
          )}
        </MainWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton onClick={handleContinue}>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default NewSurveyConfig;
