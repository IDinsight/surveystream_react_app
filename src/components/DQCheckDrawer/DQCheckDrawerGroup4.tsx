import { useEffect, useState } from "react";
import { ChecksSwitch } from "../../modules/DQ/DQChecks/DQChecks.styled";
import DQChecksFilter from "../../modules/DQ/DQChecks/DQChecksFilter";
import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";
import { CustomBtn } from "../../shared/Global.styled";

interface IDQCheckDrawerProps {
  visible: boolean;
  typeID: string;
  onClose: any;
  onSave: any;
  data: any;
  questions: any[];
}

function DQCheckDrawer4({
  visible,
  typeID,
  onClose,
  data,
  onSave,
  questions,
}: IDQCheckDrawerProps) {
  const [localData, setLocalData] = useState<any>({
    dq_check_id: null,
    variable_name: "",
    gps_type: null,
    threshold: null,
    gps_variable: null,
    grid_id: null,
    is_active: true,
  });

  const [confirmed, setConfirmed] = useState(false);

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

  const handleSave = () => {
    if (!localData.variable_name) {
      message.error("Please select a variable.");
      return;
    }

    if (localData.gps_type === null) {
      message.error("Please select a GPS check type.");
      return;
    }

    if (localData.threshold === null || localData.threshold === "") {
      message.error("Please input the threshold value.");
      return;
    }

    if (
      localData.gps_type === "point2point" &&
      localData.gps_variable === null
    ) {
      message.error("Please input the expected GPS variable.");
      return;
    }

    if (localData.gps_type === "point2shape" && localData.grid_id === null) {
      message.error("Please input the Grid ID variable.");
      return;
    }

    if (localData.gps_type === "point2shape" && confirmed === false) {
      message.error(
        "Please select the checkbox to confirm sharing required shape files with SurveyStream team."
      );
      return;
    }

    onSave({
      ...localData,
      filters: [],
    });
  };

  useEffect(() => {
    if (data) {
      setLocalData({
        dq_check_id: data.dqCheckUID,
        variable_name: data.questionName,
        is_active: data.status === "Active",
        gps_type: data.gpsType,
        threshold: data.threshold,
        gps_variable: data.gpsVariable,
        grid_id: data.gridIDVariable,
      });
    } else {
      setLocalData({
        dq_check_id: null,
        variable_name: "",
        gps_type: null,
        threshold: null,
        gps_variable: null,
        grid_id: null,
        is_active: true,
      });
    }
  }, [data]);

  return (
    <Drawer
      title={data ? "Edit GPS Check" : "Add New GPS Check"}
      width={600}
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
              label="Select type:"
              tooltip="Type of GPS check. Ex. Point to Point or Point to Shape"
              required
            />
          </Col>
          <Col span={12}>
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder="Select GPS type"
              value={localData.gps_type}
              onChange={(value) => handleFieldChange("gps_type", value)}
            >
              <Select.Option value="point2point">Point to Point</Select.Option>
              <Select.Option value="point2shape">Point to Shape</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item
              label="Select variable"
              tooltip="Choose variable from SCTO question list"
              required
            />
          </Col>
          <Col span={12}>
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder="Select variable"
              value={localData.variable_name ?? null}
              options={questions
                // Remove multi-select questions since they are not applicable for gps checks
                .filter((question: any) => question.is_multi_select !== true)
                .map((question: any) => ({
                  value: question.name,
                  label: question.label,
                }))}
              onChange={(value) => handleFieldChange("variable_name", value)}
            />
          </Col>
        </Row>
        {localData.gps_type === "point2point" && (
          <Row>
            <Col span={8}>
              <Form.Item
                label="Expected GPS variable:"
                tooltip="Value that is considered for checks"
                required
              />
            </Col>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Select GPS variable"
                value={localData.gps_variable}
                options={questions
                  // Remove multi-select questions since they are not applicable for gps checks
                  .filter((question: any) => question.is_multi_select !== true)
                  .map((question: any) => ({
                    value: question.name,
                    label: question.label,
                  }))}
                onChange={(value) => handleFieldChange("gps_variable", value)}
              />
            </Col>
          </Row>
        )}

        {localData.gps_type === "point2shape" && (
          <Row>
            <Col span={8}>
              <Form.Item
                label="Grid ID variable:"
                tooltip="Value that is considered for checks"
                required
              />
            </Col>
            <Col span={12}>
              <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Select GPS Grid ID variable"
                value={localData.grid_id}
                options={questions
                  // Remove multi-select questions since they are not applicable for gps checks
                  .filter((question: any) => question.is_multi_select !== true)
                  .map((question: any) => ({
                    value: question.name,
                    label: question.label,
                  }))}
                onChange={(value) => handleFieldChange("grid_id", value)}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col span={8}>
            <Form.Item
              label="Threshold distance (m):"
              tooltip="Threshold to check value within"
              required
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Input threshold"
              value={localData.threshold}
              onChange={(e) => handleFieldChange("threshold", e.target.value)}
            />
          </Col>
        </Row>
        {localData.gps_type === "point2shape" && (
          <Checkbox
            style={{ marginTop: 16, marginBottom: 16 }}
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          >
            Please share the shape files for the grids with SurveyStream team.
            The file names must follow the format:{" "}
            <code>&lt;grid id&gt;.gpkg</code>
          </Checkbox>
        )}
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

export default DQCheckDrawer4;
