import React, { FC } from "react";
import {
  CheckboxGroup,
  ModuleQuestionnaireWrapper,
} from "./ModuleQuestionnaire.styled";
import { Title } from "../../../shared/Nav.styled";

interface IModuleQuestionnaire {
  stepIndex: number;
}

const ModuleQuestionnaire: FC<IModuleQuestionnaire> = ({ stepIndex }) => {
  // Supervisors checkbox options
  const supervisorsCriteriaOptions = [
    { label: "Location", value: "supervisor_criteria_location" },
    { label: "Gender", value: "supervisor_criteria_gender" },
    { label: "Language", value: "supervisor_criteria_language" },
    { label: "Manual mapping", value: "supervisor_criteria_mapping" },
  ];

  const supervisorsHierarchyOptions = [
    { label: "Yes, there is a heirarchy", value: "supervisor_heirarchy_yes" },
    {
      label: "No, they are all at the same level",
      value: "supervisor_heirarchy_no",
    },
  ];

  // Enumerators checkbox options
  const enumeratorsCriteriaOptions = [
    {
      label: "Location of target",
      value: "enumerator_criteria_target_location",
    },
    { label: "Location of enumerators", value: "enumerator_criteria_location" },
    { label: "Gender", value: "enumerator_criteria_gender" },
    { label: "Language", value: "enumerator_criteria_language" },
    {
      label: "Type of target/respondent",
      value: "enumerator_criteria_target_type",
    },
  ];

  const enumeratorsTargetChangeOptions = [
    { label: "Yes", value: "enumerators_target_change_yes" },
    {
      label: "No, there is a fixed list of targets and enumerators",
      value: "enumerators_target_change_no",
    },
  ];

  const enumeratorsTargetAssignmentWayOptions = [
    {
      label: "Manual assignment during the survey",
      value: "enumerator_target_assignment_manual",
    },
    {
      label: "Randomized assignment",
      value: "enumerator_target_assignment_random",
    },
  ];

  const supervisorsEnumeratorsMappingOptions = [
    { label: "1 : many", value: "one_to_many" },
    { label: "1 : 1", value: "one_to_one" },
    { label: "many : 1", value: "many_to_one", disabled: true },
    { label: "many : many", value: "many_to_many", disabled: true },
  ];

  // Language checkbox options
  const languageMappedOptions = [
    { label: "Yes", value: "language_mapped_yes" },
    { label: "No", value: "language_mapped_no" },
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
            <CheckboxGroup
              options={supervisorsCriteriaOptions}
              style={{ marginTop: "15px" }}
            />
            <Title style={{ marginTop: "24px" }}>
              Is there a hierarchy in supervisors?
            </Title>
            <CheckboxGroup
              options={supervisorsHierarchyOptions}
              style={{ marginTop: "15px" }}
            />
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
            <CheckboxGroup
              options={enumeratorsCriteriaOptions}
              style={{ marginTop: "15px" }}
            />
            <Title style={{ marginTop: "24px" }}>
              Will the assignment of the targets to enumerators change during
              the course of the survey?
            </Title>
            <CheckboxGroup
              options={enumeratorsTargetChangeOptions}
              style={{ marginTop: "15px" }}
            />
            <Title style={{ marginTop: "24px" }}>
              What process will you use to perform the assignment of targets to
              enumerators?
            </Title>
            <CheckboxGroup
              options={enumeratorsTargetAssignmentWayOptions}
              style={{ marginTop: "15px" }}
            />
            <Title style={{ marginTop: "24px" }}>
              What is the mapping of supervisors to enumerators (supervisors :
              enumerator)?
            </Title>
            <CheckboxGroup
              options={supervisorsEnumeratorsMappingOptions}
              style={{ marginTop: "15px" }}
            />
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
            <CheckboxGroup
              options={languageMappedOptions}
              style={{ marginTop: "15px" }}
            />
          </>
        );
    }
  };

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
      <div>{Questionnaire()}</div>
    </ModuleQuestionnaireWrapper>
  );
};

export default ModuleQuestionnaire;
