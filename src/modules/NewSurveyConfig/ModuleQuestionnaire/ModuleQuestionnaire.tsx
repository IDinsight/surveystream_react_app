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
    assignment_process: null,
    language_location_mapping: null,
    reassignment_required: null,
    target_mapping_criteria: [],
    surveyor_mapping_criteria: [],
    supervisor_surveyor_relation: null,
    supervisor_hierarchy_exists: null,
    survey_uid: moduleQuestionnaire?.survey_uid
      ? moduleQuestionnaire?.survey_uid
      : survey_uid
        ? parseInt(survey_uid)
        : 0,
    target_assignment_criteria: [],
  });
  const [isLLMapping, setIsLLMapping] = useState<boolean | null>(null);

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

  // Enumerators checkbox options
  const enumeratorsCriteriaOptions = [
    {
      label: "Location of target",
      value: "Location of target",
    },
    { label: "Location of surveyors", value: "Location of surveyors" },
    { label: "Gender", value: "Gender" },
    { label: "Language", value: "Language" },
    {
      label: "Type of target/respondent",
      value: "Type of target/respondent",
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

  useEffect(() => {
    const surveyormappingSelected = mqFormData["surveyor_mapping_criteria"];
    const targetmappingSelected = mqFormData["target_mapping_criteria"];
    const enumeratorsSelected = mqFormData["target_assignment_criteria"];

    // Condition 1: If Location and Language is selected in surveyor mapping
    const result1 = ["Location", "Language"].every((val) =>
      surveyormappingSelected.includes(val)
    );

    // Condition 2: ("Location of target" or "Location of enumerators") and language is selected in target assignment criteria
    const sub_result2 = ["Location of target", "Location of surveyors"].some(
      (val) => enumeratorsSelected.includes(val)
    );
    const result2 = sub_result2 && enumeratorsSelected.includes("Language");

    // Condition 3: If Location and Language is selected in target mapping
    const result3 = ["Location", "Language"].every((val) =>
      targetmappingSelected.includes(val)
    );

    // Now, setting the result
    const result = result1 || result2 || result3;

    /*
      If user does not select location and language option
      then set false value for backend
    */
    if (!result) {
      const updatedFormData: SurveyModuleQuestionnaireData = {
        ...mqFormData,
        language_location_mapping: false,
      };
      setFieldsDataWithStates(updatedFormData);
    }

    setIsLLMapping(result);
  }, Object.values(mqFormData));

  const Questionnaire = () => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Title style={{ marginTop: "18px" }}>Supervisors</Title>
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

            <Title style={{ marginTop: "24px" }}>
              What is the mapping of supervisors to surveyors (supervisors :
              surveyors)?
            </Title>
            <StyledFormItem name="supervisor_surveyor_relation">
              <Radio.Group
                options={supervisorsEnumeratorsMappingOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>
          </>
        );

      case 1:
        return (
          <>
            <Title style={{ marginTop: "18px" }}>Surveyors</Title>
            <Title style={{ marginTop: "23px" }}>
              What is the criteria which you will use to assign targets to
              surveyors? Select all that apply
            </Title>
            <StyledFormItem name="target_assignment_criteria">
              <CheckboxGroup
                options={enumeratorsCriteriaOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>
            <Title style={{ marginTop: "24px" }}>
              What process will you use to perform the assignment of targets to
              surveyors?
            </Title>
            <StyledFormItem name="assignment_process">
              <Radio.Group
                options={enumeratorsTargetAssignmentWayOptions}
                style={{ marginTop: "15px" }}
              />
            </StyledFormItem>
          </>
        );

      case 2:
        return (
          <>
            {isLLMapping ? (
              <>
                <Title style={{ marginTop: "18px" }}>Language</Title>
                <Title style={{ marginTop: "23px" }}>
                  You have selected ‘location’ and ‘language’ as a mapping
                  criteria. Can the languages be mapped via locations?
                </Title>
                <StyledFormItem
                  name="language_location_mapping"
                  style={{ marginBottom: "18px" }}
                >
                  <Radio.Group
                    options={languageMappedOptions}
                    style={{ marginTop: "15px" }}
                  />
                </StyledFormItem>
              </>
            ) : null}
            <p>Now, please click on save to submit data.</p>
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
        <Title>Module questionnaire</Title>
        <p
          style={{
            color: "#8C8C8C",
            fontSize: "14px",
            fontFamily: '"Lato", sans-serif',
          }}
        >
          Please fill out the questionnaire to help us recommend useful
          SurveyStream modules for your survey
        </p>
        <Form form={form} onValuesChange={handleFormValuesChange}>
          {Questionnaire()}
        </Form>
      </ModuleQuestionnaireWrapper>
    </>
  );
};

export default ModuleQuestionnaire;
