import { useEffect, useState } from "react";
import { ChecksSwitch } from "../../modules/DQ/DQChecks/DQChecks.styled";
import DQChecksFilter from "../../modules/DQ/DQChecks/DQChecksFilter";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
} from "antd";
import { getSurveyCTOFormDefinition } from "../../redux/surveyCTOQuestions/apiService";
import { useAppDispatch } from "../../redux/hooks";
import { LoadingOutlined } from "@ant-design/icons";
import { CustomBtn, DescriptionText } from "../../shared/Global.styled";

interface IDQCheckDrawerGroup3Props {
  visible: boolean;
  drawerMode: string; // Added drawerMode prop
  onClose: any;
  onSave: any;
  data: any;
  typeID: string;
  dqForms: any[];
  parentFormQuestions: any[];
  showModuleName: boolean;
  moduleNames: any[];
  scoreNames: any[];
}

function DQCheckDrawerGroup3({
  visible,
  drawerMode,
  onClose,
  onSave,
  data,
  typeID,
  dqForms,
  parentFormQuestions,
  showModuleName,
  moduleNames,
  scoreNames,
}: IDQCheckDrawerGroup3Props) {
  const dispatch = useAppDispatch();

  const [localModuleNames, setlocalModuleNames] = useState<any>(moduleNames);
  const [localScoreNames, setLocalScoreNames] = useState<any>(scoreNames);
  const [filter, setFilter] = useState<any>([]);

  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [dqFormQuestions, setDqFormQuestions] = useState<any[]>([]);

  const [finalQuestions, setFinalQuestions] = useState<any[]>([]);

  const [localData, setLocalData] = useState<any>({
    dq_check_id: null,
    dq_scto_form_uid: null,
    variable_name: "",
    flag_description: "",
    is_active: true,
    module_name: "",
    spotcheck_score_name: null,
  });

  const handleFieldChange = (field: string, value: any) => {
    if (
      field === "is_active" &&
      value === true &&
      data?.isDeleted &&
      data?.questionName === localData.variable_name
    ) {
      message.error(
        "Some variables used in the check are deleted and hence, it cannot be activated. Please change the deleted variables to activate this check."
      );
      return;
    }

    setLocalData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleModeNameChange = (val: string) => {
    if (val && !localModuleNames.includes(val)) {
      setlocalModuleNames((prevOptions: any) => [...prevOptions, val]);
      handleFieldChange("module_name", val);
    }
  };

  const handleScoreNameChange = (val: string) => {
    if (val && !localScoreNames.includes(val)) {
      setLocalScoreNames((prevOptions: any) => [...prevOptions, val]);
      handleFieldChange("spotcheck_score_name", val);
    }
  };

  const handleSave = () => {
    if (!localData.dq_scto_form_uid) {
      message.error("Please select a data quality form");
      return;
    }

    if (!localData.variable_name) {
      message.error("Please select a variable");
      return;
    }

    if (filter.length > 0) {
      const isFilterValid = filter.every((f: any) => {
        return f.filter_group.every(
          (group: any) => group.question_name && group.filter_operator
        );
      });

      if (!isFilterValid) {
        message.error("Please input all filter conditions");
        return;
      }
    }

    onSave({
      ...localData,
      filters: filter,
    });
  };

  // Fetch form definition for questions
  useEffect(() => {
    if (localData.dq_scto_form_uid) {
      getSurveyCTOFormDefinition(localData.dq_scto_form_uid, false, true).then(
        (res: any) => {
          if (res?.data?.success) {
            const formDefinition = res.data.data;
            if (formDefinition && formDefinition.questions) {
              // Filter to exclude repeat groups with select_multiple question types
              const filteredQuestions = formDefinition.questions.filter(
                (question: any) =>
                  !(
                    question.is_repeat_group &&
                    question.question_type.startsWith("select_multiple")
                  )
              );
              const questionNames = filteredQuestions.map((question: any) => ({
                name: question.question_name,
                label:
                  question.question_name +
                  (question.is_repeat_group ? "_*" : ""),
                is_multi_select:
                  question.question_type.startsWith("select_multiple"),
              }));
              setDqFormQuestions(questionNames);
            }
          }
        }
      );
    }
  }, [localData.dq_scto_form_uid]);

  useEffect(() => {
    if (parentFormQuestions && dqFormQuestions) {
      // if type is mismatch check, find the common questions in both parent and dq form
      if (typeID === "7") {
        const questions: any = [];

        // find the questions that are common in both parent and dq form for mismatch checks
        parentFormQuestions.forEach((parentQuestion: any) => {
          dqFormQuestions.forEach((dqQuestion: any) => {
            if (parentQuestion.name === dqQuestion.name) {
              questions.push(dqQuestion);
            }
          });
        });
        setFinalQuestions(questions);
      } else {
        // for protocol violations and spotcheck scores, remove select multiple questions
        const dqFormQuestionsFiltered = dqFormQuestions.filter(
          (question: any) => question.is_multi_select !== true
        );

        setFinalQuestions(dqFormQuestionsFiltered);
      }
    } else {
      setFinalQuestions([]);
    }
  }, [parentFormQuestions, dqFormQuestions]);

  useEffect(() => {
    if (data) {
      setLocalData({
        dq_check_id: data.dqCheckUID,
        dq_scto_form_uid: data.dq_scto_form_uid,
        variable_name: data.questionName,
        flag_description: data.flagDescription,
        is_active: data.status === "Active",
        module_name: data.moduleName,
        spotcheck_score_name: data.spotcheck_score_name,
      });

      setFilter(data.filters);
    } else {
      setLocalData({
        dq_scto_form_uid: null,
        variable_name: "",
        flag_description: "",
        is_active: true,
        module_name: "",
        filters: [],
        spotcheck_score_name: null,
      });
    }
  }, [data]);

  return (
    <Drawer
      title={
        data
          ? "Edit DQ Check"
          : drawerMode === "bulk"
          ? "Add Bulk DQ Checks"
          : "Add DQ Check"
      }
      width={800}
      onClose={onClose}
      open={visible}
      style={{ paddingBottom: 80, fontFamily: "Lato" }}
    >
      <Form>
        <ChecksSwitch
          defaultChecked
          checked={localData.is_active}
          onChange={(value) => handleFieldChange("is_active", value)}
          checkedChildren="ACTIVE"
          unCheckedChildren="INACTIVE"
        />
        <DescriptionText>
          <span style={{ color: "#ff4d4f" }}>*</span> indicates required fields.
          All other fields are optional.
        </DescriptionText>
        <Row style={{ marginTop: 16 }}>
          <Col span={8}>
            <Form.Item
              label="Select data quality form:"
              tooltip="Form on which the check will run."
              required
            />
          </Col>
          <Col span={12}>
            <Select
              showSearch
              style={{ width: "100%" }}
              value={localData.dq_scto_form_uid}
              options={dqForms?.map((option: any) => ({
                value: option.form_uid,
                label: option.scto_form_id,
              }))}
              onChange={(value) => {
                handleFieldChange("dq_scto_form_uid", value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              label="Select variable"
              tooltip={`${
                typeID === "7"
                  ? "Select from the list of common questions in the parent and selected DQ form. Mismatch checks require the question name to be same in both forms."
                  : "Select from the list of questions in the selected DQ form."
              }`}
              required
            />
          </Col>
          <Col span={12}>
            <Select
              style={{ width: "100%" }}
              showSearch
              mode={
                typeID === "9" || (localData && localData.dq_check_id)
                  ? undefined
                  : "multiple"
              }
              placeholder="Select variable"
              value={
                typeID === "9" || (localData && localData.dq_check_id)
                  ? localData.variable_name
                  : localData.variable_name || []
              }
              options={finalQuestions.map((question: any) => ({
                value: question.name,
                label: question.label,
              }))}
              onChange={(value) => handleFieldChange("variable_name", value)}
            />
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
              style={{
                marginLeft: 24,
                display: isQuestionLoading ? "block" : "none",
              }}
            />
          </Col>
        </Row>
        {typeID === "9" ? (
          <Row>
            <Col span={8}>
              <Form.Item
                label="Score Name:"
                tooltip="Can be used to aggregate data from multiple scores. If left blank, the variable name will be used."
              />
            </Col>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                placeholder="Select or input an option"
                showSearch
                value={localData.spotcheck_score_name}
                options={localScoreNames?.map((name: any) => ({
                  value: name,
                  label: name,
                }))}
                onChange={(value) =>
                  handleFieldChange("spotcheck_score_name", value)
                }
                onBlur={(e: any) => {
                  const inputValue = e.target.value;
                  handleScoreNameChange(inputValue);
                }}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    const inputValue = e.target.value;
                    handleScoreNameChange(inputValue);
                  }
                }}
              />
            </Col>
          </Row>
        ) : null}
        <Row>
          <Col span={8}>
            <Form.Item
              label="Flag description:"
              tooltip="Short description of the flag that will be included in the outputs"
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Optional: Input flag description"
              value={localData.flag_description}
              onChange={(e) =>
                handleFieldChange("flag_description", e.target.value)
              }
            />
          </Col>
        </Row>
        <div>
          <Form.Item
            label="Filter before applying this check:"
            tooltip="Conditions to filter out the data before applying a check. Filter is applied on the DQ form. Example: age < 30"
          />
          <DQChecksFilter
            filters={filter}
            setFilterList={setFilter}
            questions={dqFormQuestions}
          />
        </div>
        {showModuleName ? (
          <div>
            <Row>
              <Form.Item
                label="Group variables in the output data using:"
                tooltip="This input is enabled as per selection in - Step 1: Global configuration."
              />
            </Row>
            <Row>
              <Col span={6}>
                <Form.Item
                  label="Module Name:"
                  style={{ marginLeft: 32 }}
                  tooltip="Will be included in the outputs and can be used to filter and group the results. If left blank, default value 'DQ' will be used."
                />
              </Col>
              <Col span={10}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Optional: Select or input an option"
                  showSearch
                  allowClear
                  value={localData.module_name}
                  options={localModuleNames?.map((name: any) => ({
                    value: name,
                    label: name,
                  }))}
                  onChange={(value) => handleFieldChange("module_name", value)}
                  onBlur={(e: any) => {
                    const inputValue = e.target.value;
                    handleModeNameChange(inputValue);
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") {
                      const inputValue = e.target.value;
                      handleModeNameChange(inputValue);
                    }
                  }}
                />
              </Col>
            </Row>
          </div>
        ) : null}
        <div>
          <Button style={{ marginTop: 16 }} onClick={onClose}>
            Cancel
          </Button>
          <CustomBtn style={{ marginLeft: 16 }} onClick={handleSave}>
            Save
          </CustomBtn>
        </div>
      </Form>
    </Drawer>
  );
}

export default DQCheckDrawerGroup3;
