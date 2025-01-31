import { useEffect, useState } from "react";
import { ChecksSwitch } from "../../modules/DQ/DQChecks/DQChecks.styled";
import DQChecksFilter from "../../modules/DQ/DQChecks/DQChecksFilter";
import { Button, Col, Drawer, Form, Input, message, Row, Select } from "antd";
import { CustomBtn } from "../../shared/Global.styled";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import DQChecksAssertion from "../../modules/DQ/DQChecks/DQChecksAssertion";
import validateExpression from "./../../utils/parser";

interface IDQCheckDrawerProps {
  visible: boolean;
  typeID: string;
  onClose: any;
  onSave: any;
  data: any;
  questions: any[];
  showModuleName: boolean;
  moduleNames: any[];
}

function DQCheckDrawer5({
  visible,
  typeID,
  onClose,
  data,
  onSave,
  questions,
  showModuleName,
  moduleNames,
}: IDQCheckDrawerProps) {
  const [localModuleNames, setlocalModuleNames] = useState<any>(moduleNames);
  const [filter, setFilter] = useState<any>([]);
  const [assertion, setAssertion] = useState<any>([]);

  const [localData, setLocalData] = useState<any>({
    dq_check_id: null,
    variable_name: { question_name: "", alias: "A" },
    other_variable_name: [],
    flag_description: "",
    is_active: true,
    module_name: "",
  });

  const handleFieldChange = (field: string, value: any) => {
    if (
      field === "is_active" &&
      value === true &&
      data?.isDeleted &&
      data?.questionName === localData.variable_name.question_name
    ) {
      message.error(
        "This check's variable is deleted and cannot be activated. Please change the variable to activate this check."
      );
      return;
    }

    if (field === "variable_name") {
      setLocalData((prev: any) => ({
        ...prev,
        [field]: { question_name: value, alias: "A" },
      }));
    } else {
      setLocalData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleOtherVariableChange = (index: number, value: any) => {
    setLocalData((prev: any) => {
      const otherVariableName = prev.other_variable_name;
      otherVariableName[index].question_name = value;
      return {
        ...prev,
        other_variable_name: otherVariableName,
      };
    });
  };

  const handleModeNameChange = (val: string) => {
    if (val && !localModuleNames.includes(val)) {
      setlocalModuleNames((prevOptions: any) => [...prevOptions, val]);
      handleFieldChange("module_name", val);
    }
  };

  const handleSave = () => {
    if (!localData.variable_name.question_name) {
      message.error("Please select a variable");
      return;
    }

    if (assertion.length > 0) {
      const isOtherVariableValid = assertion.every(
        (group: { assert_group: { assertion: string }[] }) => {
          return group.assert_group.every((variable: { assertion: string }) => {
            const validation = validateExpression(variable.assertion);
            if (!variable.assertion || !validation.valid) {
              if (!variable.assertion) {
                message.error("Please select all other variables");
              } else {
                message.error(validation.errors[0]);
              }
              return false;
            }
            return true;
          });
        }
      );

      if (!isOtherVariableValid) {
        return;
      }
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
      assertion: assertion,
      filters: filter,
    });
  };

  const getNextAlias = () => {
    const otherVariableName = localData.other_variable_name;
    if (otherVariableName.length === 0) {
      return "B";
    }

    const lastAlias = otherVariableName[otherVariableName.length - 1].alias;
    return String.fromCharCode(lastAlias.charCodeAt(0) + 1);
  };

  const handleOtherVariableDelete = (index: number) => () => {
    setLocalData((prev: any) => {
      const otherVariableName = prev.other_variable_name;
      otherVariableName.splice(index, 1);
      return {
        ...prev,
        other_variable_name: otherVariableName,
      };
    });
  };

  useEffect(() => {
    if (data) {
      setLocalData({
        dq_check_id: data.dqCheckUID,
        variable_name: {
          question_name: data.questionName,
          alias: "A",
        },
        flag_description: data.flagDescription,
        is_active: data.status === "Active",
        module_name: data.moduleName,
        other_variable_name: data.otherVariable,
      });

      setFilter(data.filters);
      setAssertion(data.assertions);
    } else {
      setLocalData({
        variable_name: { question_name: "", alias: "A" },
        other_variable_name: [],
        flag_description: "",
        is_active: true,
        module_name: "",
      });
    }
  }, [data]);

  return (
    <Drawer
      title={data ? "Edit DQ Check" : "Add New DQ Check"}
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
        <Row style={{ marginTop: 16 }}>
          <Col span={8}>
            <Form.Item
              label="Select variable"
              tooltip="Choose variable from SCTO question list"
              required
            />
          </Col>
          <Col span={12} style={{ display: "flex", alignItems: "center" }}>
            <Select
              style={{ width: "80%" }}
              showSearch
              placeholder="Select variable"
              value={localData.variable_name.question_name}
              options={questions.map((question: any) => ({
                value: question.name,
                label: question.label,
              }))}
              onChange={(value) => handleFieldChange("variable_name", value)}
            />
            <span style={{ marginLeft: 24, marginTop: 6 }}>Alias: A</span>
          </Col>
        </Row>
        <Row style={{ marginTop: 8 }}>
          <Col>
            <Form.Item
              label="Select other variables needed for the check:"
              tooltip="Choose other variable from SCTO question list for logic checks"
            />
          </Col>
        </Row>
        {localData.other_variable_name?.map((variable: any, index: number) => (
          <Row key={index}>
            <Col span={8}>
              <Form.Item
                label={`Select variable ${index + 1}`}
                tooltip="Choose variable from SCTO question list"
                required
              />
            </Col>
            <Col span={12} style={{ display: "flex", alignItems: "center" }}>
              <Select
                style={{ width: "80%" }}
                showSearch
                placeholder="Select variable"
                value={variable.question_name}
                options={questions.map((question: any) => ({
                  value: question.name,
                  label: question.label,
                }))}
                onChange={(value) => handleOtherVariableChange(index, value)}
              />
              <span style={{ marginLeft: "24px", marginTop: "6px" }}>
                Alias: {variable.alias}
              </span>
            </Col>
            <Button
              type="link"
              style={{ marginLeft: 16, marginTop: 16 }}
              onClick={handleOtherVariableDelete(index)}
            >
              <DeleteOutlined />
            </Button>
          </Row>
        ))}
        <Row>
          <Col>
            <Button
              type="link"
              onClick={() =>
                setLocalData((prev: any) => {
                  return {
                    ...prev,
                    other_variable_name: [
                      ...prev.other_variable_name,
                      {
                        question_name: "",
                        alias: getNextAlias(),
                      },
                    ],
                  };
                })
              }
            >
              <PlusOutlined /> Add another variable
            </Button>
          </Col>
        </Row>
        <Row style={{ marginTop: 8 }}>
          <Col>
            <Form.Item
              label="Assertions:"
              tooltip="Assertions conditions for logic checks"
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DQChecksAssertion
              assertions={assertion}
              setAssertions={setAssertion}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              label="Flag description:"
              tooltip="Short description of the flag that will be included in the outputs"
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Input flag description"
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
            tooltip="Conditions to filter out the data before applying a check. Example: age < 30"
          />
          <DQChecksFilter
            filters={filter}
            setFilterList={setFilter}
            questions={questions}
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
                  placeholder="Select or input an option"
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
          <Button style={{ marginTop: 20 }} onClick={onClose}>
            Cancel
          </Button>
          <CustomBtn style={{ marginLeft: 20 }} onClick={handleSave}>
            Save
          </CustomBtn>
        </div>
      </Form>
    </Drawer>
  );
}

export default DQCheckDrawer5;
