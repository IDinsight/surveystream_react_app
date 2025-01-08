import { useEffect, useState } from "react";
import { ChecksSwitch } from "../../modules/DQ/DQChecks/DQChecks.styled";
import DQChecksFilter from "../../modules/DQ/DQChecks/DQChecksFilter";
import { Button, Col, Drawer, Form, Input, message, Row, Select } from "antd";
import { CustomBtn } from "../../shared/Global.styled";

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

function DQCheckDrawer({
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
  const [localData, setLocalData] = useState<any>({
    dq_check_id: null,
    variable_name: "",
    outliner_metric: null,
    outliner_value: null,
    hard_min: null,
    hard_max: null,
    soft_min: null,
    soft_max: null,
    flag_description: "",
    is_active: true,
    module_name: "",
  });

  const handleFieldChange = (field: string, value: any) => {
    if (
      field === "is_active" &&
      value === true &&
      data?.isDeleted &&
      data?.questionName === localData.variable_name
    ) {
      message.error(
        "This check's variable is deleted and cannot be activated. Please change the variable to activate this check."
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

  const handleSave = () => {
    if (!localData.variable_name) {
      message.error("Please select a variable");
      return;
    }

    if (typeID === "3") {
      if (localData.outliner_metric === null) {
        message.error("Please select a metric");
        return;
      }

      if (localData.outliner_value === null) {
        message.error("Please input a value");
        return;
      }
    }

    if (typeID === "2") {
      if (
        localData.hard_min === null &&
        localData.soft_min === null &&
        localData.soft_max === null &&
        localData.hard_max === null
      ) {
        message.error(
          "Please input at least one value for Hard Min, Soft Min, Soft Max, or Hard Max"
        );
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
      filters: filter,
    });
  };

  useEffect(() => {
    if (data) {
      setLocalData({
        dq_check_id: data.dqCheckUID,
        variable_name: data.questionName,
        flag_description: data.flagDescription,
        is_active: data.status === "Active",
        module_name: data.moduleName,
        outliner_metric: data.outlinerMetric ?? null,
        outliner_value: data.outlinerValue ?? null,
        soft_min: data.softMin ?? null,
        soft_max: data.softMax ?? null,
        hard_min: data.hardMin ?? null,
        hard_max: data.hardMax ?? null,
      });

      setFilter(data.filters);
    } else {
      setLocalData({
        variable_name: "",
        flag_description: "",
        is_active: true,
        module_name: "",
        outliner_metric: null,
        outliner_value: null,
        soft_min: null,
        soft_max: null,
        hard_min: null,
        hard_max: null,
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
        {typeID === "2" && (
          <>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Hard Min:"
                  tooltip="Hard minimum value for the variable"
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Input value"
                  value={localData.hard_min}
                  onChange={(e) =>
                    handleFieldChange("hard_min", e.target.value)
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Soft Min:"
                  tooltip="Soft minimum value for the variable"
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Input value"
                  value={localData.soft_min}
                  onChange={(e) =>
                    handleFieldChange("soft_min", e.target.value)
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Soft Max:"
                  tooltip="Soft maximum value for the variable"
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Input value"
                  value={localData.soft_max}
                  onChange={(e) =>
                    handleFieldChange("soft_max", e.target.value)
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Hard Max:"
                  tooltip="Hard maximum value for the variable"
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Input value"
                  value={localData.hard_max}
                  onChange={(e) =>
                    handleFieldChange("hard_max", e.target.value)
                  }
                />
              </Col>
            </Row>
          </>
        )}
        {typeID === "3" && (
          <>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Measure:"
                  tooltip="Unit of measurement for the variable"
                />
              </Col>
              <Col span={12}>
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select metric"
                  value={localData.outliner_metric}
                  onChange={(value) =>
                    handleFieldChange("outliner_metric", value)
                  }
                >
                  <Select.Option value="interquartile_range">
                    Interquartile Range
                  </Select.Option>
                  <Select.Option value="standard_deviation">
                    Standard Deviation
                  </Select.Option>
                  <Select.Option value="percentile">Percentile</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="Multipler / Value:"
                  tooltip="Value that is considered for checks"
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Input value"
                  value={localData.outliner_value}
                  onChange={(e) =>
                    handleFieldChange("outliner_value", e.target.value)
                  }
                />
              </Col>
            </Row>
          </>
        )}
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

export default DQCheckDrawer;
