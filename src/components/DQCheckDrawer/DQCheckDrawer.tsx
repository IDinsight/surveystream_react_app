import { useEffect, useState } from "react";
import { ChecksSwitch } from "../..//modules/DQ/DQChecks/DQChecks.styled";
import DQChecksFilter from "../../modules/DQ/DQChecks/DQChecksFilter";
import { Button, Col, Drawer, Form, Input, message, Row, Select } from "antd";

interface IDQCheckDrawerProps {
  visible: boolean;
  onClose: any;
  onSave: any;
  data: any;
  questions: any[];
  showModuleName: boolean;
  moduleNames: any[];
  variablesValues: string[];
}

function DQCheckDrawer({
  visible,
  onClose,
  data,
  onSave,
  questions,
  showModuleName,
  moduleNames,
  variablesValues,
}: IDQCheckDrawerProps) {
  const [localModuleNames, setlocalModuleNames] = useState<any>(moduleNames);
  const [filter, setFilter] = useState<any>([]);
  const [localData, setLocalData] = useState<any>({
    dq_check_id: null,
    variable_name: "",
    check_values: [],
    flag_description: "",
    is_active: true,
    module_name: "",
  });

  const handleFieldChange = (field: string, value: any) => {
    setLocalData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleModeNameChange = (val: string) => {
    if (val && !localModuleNames.includes(val)) {
      setlocalModuleNames((prevOptions: any) => [...prevOptions, val]);
      handleFieldChange("module_name", val);
    }
  };

  const handleSave = () => {
    if (!localData.variable_name) {
      message.error("Please select a variable");
      return;
    }

    if (localData.check_values.length === 0) {
      message.error("Please input at least one check value");
      return;
    }

    onSave({
      ...localData,
      filters: filter,
    });
  };

  useEffect(() => {
    if (data) {
      setLocalData({
        dq_check_id: data.dqCheckUID,
        variable_name: data.questionName,
        check_values: data.value,
        flag_description: data.flagDescription,
        is_active: data.status === "Active",
        module_name: data.moduleName,
      });

      setFilter(data.filters);
    } else {
      setLocalData({
        variable_name: "",
        check_values: [],
        flag_description: "",
        is_active: true,
        module_name: "",
        filters: [],
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
            />
          </Col>
          <Col span={12}>
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder="Select variable"
              value={localData.variable_name}
              options={questions.map((question: any) => ({
                value: question.name,
                label: question.label,
              }))}
              onChange={(value) => handleFieldChange("variable_name", value)}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              label="Check values:"
              tooltip="Value that is considered for checks"
            />
          </Col>
          <Col span={12}>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              value={localData.check_values}
              options={variablesValues?.map((option: any) => ({
                value: option,
                label: option === "''" ? "(empty)" : option,
              }))}
              onChange={(newValue) => {
                const cleanedValues = [...new Set(newValue)];
                const updatedValues = cleanedValues.map((value) =>
                  value === '""' ? "''" : value
                );
                handleFieldChange("check_values", updatedValues);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              label="Flag description:"
              tooltip="Short description of the flag."
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
          <Button
            style={{ marginLeft: 20 }}
            type="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </Form>
    </Drawer>
  );
}

export default DQCheckDrawer;
