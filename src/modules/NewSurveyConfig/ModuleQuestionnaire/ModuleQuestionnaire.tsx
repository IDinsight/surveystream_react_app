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

interface IModuleQuestionnaire {
  stepIndex: number;
  setFormData: (formData: SurveyModuleQuestionnaireData) => void;
}

const ModuleQuestionnaire: FC<IModuleQuestionnaire> = ({
  stepIndex,
  setFormData,
}) => {
  const [form] = Form.useForm();
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.surveyConfig.loading
  );

  const moduleQuestionnaire = useAppSelector(
    (state: RootState) => state.reducer.surveyConfig.moduleQuestionnaire
  );

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

  const [basicFormData, setBasicFormData] =
    useState<SurveyModuleQuestionnaireData>({
      assignment_process: moduleQuestionnaire?.assignment_process
        ? moduleQuestionnaire?.assignment_process
        : "",
      language_location_mapping: moduleQuestionnaire?.language_location_mapping
        ? moduleQuestionnaire?.language_location_mapping
        : false,
      reassignment_required: moduleQuestionnaire?.reassignment_required
        ? moduleQuestionnaire?.reassignment_required
        : false,
      supervisor_assignment_criteria:
        moduleQuestionnaire?.supervisor_assignment_criteria
          ? moduleQuestionnaire?.supervisor_assignment_criteria
          : [],
      supervisor_surveyor_relation:
        moduleQuestionnaire?.supervisor_surveyor_relation
          ? moduleQuestionnaire?.supervisor_surveyor_relation
          : "",
      supervisor_hierarchy_exists:
        moduleQuestionnaire?.supervisor_hierarchy_exists
          ? moduleQuestionnaire?.supervisor_hierarchy_exists
          : false,
      survey_uid: moduleQuestionnaire?.survey_uid
        ? moduleQuestionnaire?.survey_uid
        : survey_uid
        ? parseInt(survey_uid)
        : 0,
      target_assignment_criteria:
        moduleQuestionnaire?.target_assignment_criteria
          ? moduleQuestionnaire?.target_assignment_criteria
          : [],
    });

  const handleFormValuesChange = (changedValues: any, allValues: any) => {
    const updatedFormData: SurveyModuleQuestionnaireData = moduleQuestionnaire
      ? {
          ...moduleQuestionnaire,
          ...changedValues,
        }
      : {
          ...basicFormData,
          ...changedValues,
        };

    setBasicFormData(updatedFormData);
    setFormData(updatedFormData);
  };
  // Supervisors checkbox options
  const supervisorsCriteriaOptions = [
    { label: "Location", value: "Location" },
    { label: "Gender", value: "Gender" },
    { label: "Language", value: "Language" },
    { label: "Manual mapping", value: "Manual" },
  ];

  const supervisorsHierarchyOptions = [
    { label: "Yes, there is a hierarchy", value: true },
    {
      label: "No, they are all at the same level",
      value: false,
    },
  ];

  // Enumerators checkbox options
  const enumeratorsCriteriaOptions = [
    {
      label: "Location of target",
      value: "Location of target",
    },
    { label: "Location of enumerators", value: "Location of enumerators" },
    { label: "Gender", value: "Gender" },
    { label: "Language", value: "Location" },
    {
      label: "Type of target/respondent",
      value: "Type of target/respondent",
    },
  ];

  const enumeratorsTargetChangeOptions = [
    { label: "Yes", value: true },
    {
      label: "No, there is a fixed list of targets and enumerators",
      value: false,
    },
  ];

  const enumeratorsTargetAssignmentWayOptions = [
    {
      label: "Manual assignment during the survey",
      value: "Manual",
    },
    {
      label: "Randomized assignment",
      value: "Random",
    },
  ];

  const supervisorsEnumeratorsMappingOptions = [
    { label: "1 : many", value: "1:many" },
    { label: "1 : 1", value: "1:1" },
    { label: "many : 1", value: "many:1", disabled: true },
    { label: "many : many", value: "many:many", disabled: true },
  ];

  // Language checkbox options
  const languageMappedOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const Questionnaire = () => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Title style={{ marginTop: "18px" }}>Supervisors</Title>
            <Title style={{ marginTop: "23px" }}>
              What are the criteria which you will use to assign supervisors to
              enumerators? Select all that apply
            </Title>
            <StyledFormItem
              name="supervisor_assignment_criteria"
              initialValue={moduleQuestionnaire?.supervisor_assignment_criteria}
            >
              <CheckboxGroup
                options={supervisorsCriteriaOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>

            <Title style={{ marginTop: "24px" }}>
              Is there a hierarchy in supervisors?
            </Title>
            <StyledFormItem
              name="supervisor_hierarchy_exists"
              initialValue={moduleQuestionnaire?.supervisor_hierarchy_exists}
            >
              <Radio.Group
                options={supervisorsHierarchyOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>
          </>
        );

      case 1:
        return (
          <>
            <Title style={{ marginTop: "18px" }}>Enumerators</Title>
            <Title style={{ marginTop: "23px" }}>
              What is the criteria which you will use to assign enumerators to
              targets? Select all that apply
            </Title>
            <StyledFormItem
              name="target_assignment_criteria"
              initialValue={moduleQuestionnaire?.target_assignment_criteria}
            >
              <CheckboxGroup
                options={enumeratorsCriteriaOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>
            <Title style={{ marginTop: "24px" }}>
              Will the assignment of the targets to enumerators change during
              the course of the survey?
            </Title>
            <StyledFormItem
              name="reassignment_required"
              initialValue={moduleQuestionnaire?.reassignment_required}
            >
              <Radio.Group
                options={enumeratorsTargetChangeOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>
            <Title style={{ marginTop: "24px" }}>
              What process will you use to perform the assignment of targets to
              enumerators?
            </Title>
            <StyledFormItem
              name="assignment_process"
              initialValue={moduleQuestionnaire?.assignment_process}
            >
              <Radio.Group
                options={enumeratorsTargetAssignmentWayOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>
            <Title style={{ marginTop: "24px" }}>
              What is the mapping of supervisors to enumerators (supervisors :
              enumerator)?
            </Title>
            <StyledFormItem
              name="supervisor_surveyor_relation"
              initialValue={moduleQuestionnaire?.supervisor_surveyor_relation}
            >
              <Radio.Group
                options={supervisorsEnumeratorsMappingOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>
          </>
        );

      case 2:
        return (
          <>
            <Title style={{ marginTop: "18px" }}>Language</Title>
            <Title style={{ marginTop: "23px" }}>
              You have selected ‘location’ and ‘language’ as a mapping criteria.
              Can the languages be mapped via locations?
            </Title>
            <StyledFormItem
              name="language_location_mapping"
              initialValue={moduleQuestionnaire?.language_location_mapping}
            >
              <Radio.Group
                options={languageMappedOptions}
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
    <ModuleQuestionnaireWrapper>
      <Title>Module questionnaire</Title>
      <p
        style={{
          color: "#8C8C8C",
          fontSize: "14px",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        Please fill out the questionnaire to help us recommend useful
        SurveyStream modules for your survey
      </p>
      <Form form={form} onValuesChange={handleFormValuesChange}>
        {Questionnaire()}
      </Form>
    </ModuleQuestionnaireWrapper>
  );
};

export default ModuleQuestionnaire;
