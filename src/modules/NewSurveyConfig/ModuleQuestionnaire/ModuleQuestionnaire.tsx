import React, { FC, useEffect, useState } from "react";
import {
  CheckboxGroup,
  ModuleQuestionnaireWrapper,
} from "./ModuleQuestionnaire.styled";
import { Title } from "../../../shared/Nav.styled";
import { Form, Radio } from "antd";
import { SurveyModuleQuestionnaireData } from "../../../redux/surveyConfig/types";
import { useParams } from "react-router-dom";
import { StyledFormItem } from "../NewSurveyConfig.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { getSurveyModuleQuestionnaire } from "../../../redux/surveyConfig/surveyConfigActions";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { GlobalStyle } from "../../../shared/Global.styled";
import DescriptionLink from "../../../components/DescriptionLink/DescriptionLink";

interface IModuleQuestionnaire {
  setFormData: (formData: SurveyModuleQuestionnaireData) => void;
}
const ModuleQuestionnaire: FC<IModuleQuestionnaire> = ({ setFormData }) => {
  const [form] = Form.useForm();
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state: RootState) => state.surveyConfig.loading
  );

  const moduleQuestionnaire = useAppSelector(
    (state: RootState) => state.surveyConfig.moduleQuestionnaire
  );

  const setFieldsDataWithStates = (data: any): void => {
    form.setFieldsValue(data);

    setFormData(data);
    setMQFormData(data);
  };

  useEffect(() => {
    const fetchSurveyModuleQuestionnaire = async () => {
      if (survey_uid) {
        await dispatch(
          getSurveyModuleQuestionnaire({ survey_uid: survey_uid })
        );
      }
    };

    fetchSurveyModuleQuestionnaire();
  }, [dispatch]);

  useEffect(() => {
    if (moduleQuestionnaire === null) {
      form.resetFields();
    } else {
      // If data is there, then set to states and fields
      const fieldData = { ...moduleQuestionnaire };
      setFieldsDataWithStates(fieldData);
    }
  }, [moduleQuestionnaire]);

  const [mqFormData, setMQFormData] = useState<SurveyModuleQuestionnaireData>({
    survey_uid: moduleQuestionnaire?.survey_uid
      ? moduleQuestionnaire?.survey_uid
      : survey_uid
      ? parseInt(survey_uid)
      : 0,
    target_assignment_criteria: [],
    target_mapping_criteria: [],
    surveyor_mapping_criteria: [],
    supervisor_hierarchy_exists: false,
    reassignment_required: false,
    assignment_process: null,
    supervisor_surveyor_relation: null,
    language_location_mapping: false,
  });

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const updatedFormData: SurveyModuleQuestionnaireData = {
      ...mqFormData,
      ...changedValues,
    };

    setFieldsDataWithStates(updatedFormData);
  };

  // Supervisors to surveyors checkbox options
  const surveyorsCriteriaOptions = [
    { label: "Location", value: "Location" },
    { label: "Gender", value: "Gender" },
    { label: "Language", value: "Language" },
    { label: "Manual mapping", value: "Manual" },
  ];

  // Supervisors to targets checkbox options
  const targetsCriteriaOptions = [
    { label: "Location", value: "Location" },
    { label: "Gender", value: "Gender" },
    { label: "Language", value: "Language" },
    { label: "Manual mapping", value: "Manual" },
  ];

  useEffect(() => {
    const updatedFormData: SurveyModuleQuestionnaireData = {
      ...mqFormData,
      language_location_mapping: false,
    };
    setFieldsDataWithStates(updatedFormData);
  }, Object.values(mqFormData));

  const Questionnaire = () => {
    {
      return (
        <>
          <Title style={{ marginTop: "23px" }}>
            What are the criteria which you will use to map supervisors to
            surveyors? Select all that apply
          </Title>
          <StyledFormItem required name="surveyor_mapping_criteria">
            <CheckboxGroup
              options={surveyorsCriteriaOptions}
              style={{ marginTop: "15px" }}
            />
          </StyledFormItem>
          <Title style={{ marginTop: "24px" }}>
            What are the criteria which you will use to map supervisors to
            targets? Select all that apply
          </Title>
          <StyledFormItem required name="target_mapping_criteria">
            <CheckboxGroup
              options={targetsCriteriaOptions}
              style={{ marginTop: "15px" }}
            />
          </StyledFormItem>
        </>
      );
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <GlobalStyle />
      <ModuleQuestionnaireWrapper>
        <p
          style={{
            color: "#8C8C8C",
            fontSize: "14px",
            fontFamily: '"Lato", sans-serif',
            width: "750px",
          }}
        >
          Please answer the following questions to help SurveyStream determine
          the specific configuration steps and data validations that will be
          needed for your survey.{" "}
          <DescriptionLink link="https://docs.surveystream.idinsight.io/basic_information#module-questionnaire" />
        </p>
        <Form form={form} onValuesChange={handleFormValuesChange}>
          {Questionnaire()}
        </Form>
      </ModuleQuestionnaireWrapper>
    </>
  );
};

export default ModuleQuestionnaire;
