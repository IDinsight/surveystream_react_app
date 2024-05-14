import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import NavItems from "../../../components/NavItems";
import Header from "../../../components/Header";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  Tag,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import { CustomBtn } from "./SurveyStatusMapping.styled";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getTargetStatusMapping,
  updateTargetStatusMapping,
} from "../../../redux/targetStatusMapping/targetStatusMappingActions";

function SurveyStatusMapping() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const { loading: isLoading, surveyCTOForm: sctoForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const { loading: isMappingLoading, mappingConfig: targetStatusMapping } =
    useAppSelector((state: RootState) => state.targetStatusMapping);

  const [formIdName, setFormIdName] = useState<string>("");
  const [isFormConfirmed, setIsFormConfirmed] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingData, setEditingData] = useState<any>({
    survey_status: "",
    survey_status_label: "",
    completed_flag: true,
    refusal_flag: false,
    target_assignable: false,
    webapp_tag_color: "green",
  });

  const tableColumns = [
    {
      title: "Survey status",
      dataIndex: "survey_status",
      key: "survey_status",
    },
    {
      title: "Survey status label",
      dataIndex: "survey_status_label",
      key: "survey_status_label",
    },
    {
      title: "Completed flag",
      dataIndex: "completed_flag",
      key: "completed_flag",
    },
    {
      title: "Refusal flag",
      dataIndex: "refusal_flag",
      key: "refusal_flag",
    },
    {
      title: "Target assignable",
      dataIndex: "target_assignable",
      key: "target_assignable",
    },
    {
      title: "Web-app tag",
      dataIndex: "web_app_tag",
      key: "web_app_tag",
    },
  ];

  const tableDataSources = targetStatusMapping.map((item: any) => {
    return {
      key: item.id,
      survey_status: item.survey_status,
      survey_status_label: item.survey_status_label,
      completed_flag: item.completed_flag ? "TRUE" : "FALSE",
      refusal_flag: item.refusal_flag ? "TRUE" : "FALSE",
      target_assignable: item.target_assignable ? "TRUE" : "FALSE",
      web_app_tag: (
        <Tag color={item.webapp_tag_color}>{item.webapp_tag_color}</Tag>
      ),
    };
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const onConfirmClick = () => {
    if (!sctoForm.form_uid) return;

    dispatch(getTargetStatusMapping({ formUID: sctoForm.form_uid }));
    setIsFormConfirmed(true);
  };

  const onAddClick = () => {
    setIsEditing(true);
  };

  const onAddMapping = () => {
    if (!sctoForm.form_uid) return;

    dispatch(
      updateTargetStatusMapping({
        formUID: sctoForm.form_uid,
        data: [...targetStatusMapping, editingData],
      })
    ).then((res) => {
      if (res.payload.data.success) {
        message.success("Mapping added successfully!");
        setIsEditing(false);
      } else {
        message.error("Failed to add mapping!");
      }
    });
  };

  useEffect(() => {
    if (!survey_uid) {
      navigate("/surveys");
    }

    dispatch(getSurveyCTOForm({ survey_uid: survey_uid }));
  }, [dispatch, survey_uid]);

  return (
    <>
      <Header items={NavItems} />
      {isLoading || isMappingLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container title="Survey status" />
          <div style={{ marginLeft: 56, marginRight: 56 }}>
            <p style={{ color: "rgba(0,0,0, 0.45)" }}>
              ACME / Survey status{" "}
              {isFormConfirmed ? "/ Select survey status" : null}
            </p>
            {isFormConfirmed ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: 12,
                    marginBottom: 12,
                  }}
                >
                  <p>{formIdName}</p>
                  <CustomBtn
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginLeft: "auto" }}
                    onClick={onAddClick}
                  >
                    Add
                  </CustomBtn>
                  {selectedRowKeys.length === 1 ? (
                    <CustomBtn
                      type="primary"
                      icon={<EditOutlined />}
                      style={{ marginLeft: 10 }}
                    >
                      Edit
                    </CustomBtn>
                  ) : null}
                  {selectedRowKeys.length > 0 ? (
                    <CustomBtn
                      type="primary"
                      icon={<DeleteOutlined />}
                      style={{ marginLeft: 10 }}
                    >
                      Delete
                    </CustomBtn>
                  ) : null}
                </div>
                <Table
                  columns={tableColumns}
                  dataSource={tableDataSources}
                  rowSelection={rowSelection}
                  bordered
                />
                <Button type="primary" disabled style={{ marginTop: 12 }}>
                  Confirm
                </Button>
              </>
            ) : (
              <>
                <Form
                  form={form}
                  wrapperCol={{ span: 6 }}
                  style={{ marginTop: 48 }}
                >
                  <Form.Item
                    label="SCTO form ID"
                    name="scto-form-id"
                    required
                    tooltip="This is a required field"
                    rules={[
                      { required: true, message: "Please select the form id!" },
                    ]}
                  >
                    <Select
                      placeholder="Select SCTO form ID"
                      onSelect={(e) => setFormIdName(e)}
                    >
                      {Object.keys(sctoForm).length > 0 ? (
                        <Select.Option value={sctoForm.scto_form_id}>
                          {sctoForm.scto_form_id}
                        </Select.Option>
                      ) : null}
                    </Select>
                  </Form.Item>

                  {formIdName != "" ? (
                    <>
                      <Form.Item
                        label="Survey modality"
                        name="survey-modality"
                        required
                        tooltip="This is a required field"
                      >
                        <Input defaultValue="In-person" disabled />
                      </Form.Item>
                      <Form.Item shouldUpdate>
                        <CustomBtn type="primary" onClick={onConfirmClick}>
                          Confirm
                        </CustomBtn>
                      </Form.Item>
                    </>
                  ) : null}
                </Form>
              </>
            )}
          </div>
          {isEditing ? (
            <div
              style={{
                height: "100%",
                background: "white",
                position: "absolute",
                right: 0,
                width: 520,
                top: 70,
                padding: "40px 60px",
                border: "1px solid #f0f0f0",
              }}
            >
              <p
                style={{
                  color: "#262626",
                  fontSize: 24,
                  lineHeight: "32px",
                  fontWeight: 500,
                }}
              >
                Add
              </p>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <p
                    style={{
                      color: "#434343",
                      fontSize: 14,
                      lineHeight: "22px",
                    }}
                  >
                    <span style={{ color: "red" }}>*</span> Survey status:
                  </p>
                </Col>
                <Col span={16}>
                  <Input
                    onChange={(e) => {
                      setEditingData((prev: any) => {
                        return {
                          ...prev,
                          survey_status: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <p
                    style={{
                      color: "#434343",
                      fontSize: 14,
                      lineHeight: "22px",
                    }}
                  >
                    <span style={{ color: "red" }}>*</span> Survey status label:
                  </p>
                </Col>
                <Col span={16}>
                  <Input
                    onChange={(e) => {
                      setEditingData((prev: any) => {
                        return {
                          ...prev,
                          survey_status_label: e.target.value,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <p
                    style={{
                      color: "#434343",
                      fontSize: 14,
                      lineHeight: "22px",
                    }}
                  >
                    <span style={{ color: "red" }}>*</span> Completed flag:
                  </p>
                </Col>
                <Col span={16}>
                  <Select
                    defaultValue={true}
                    style={{ width: 120 }}
                    options={[
                      { value: true, label: "TRUE" },
                      { value: false, label: "FALSE" },
                    ]}
                    onChange={(val) => {
                      setEditingData((prev: any) => {
                        return {
                          ...prev,
                          completed_flag: val,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <p
                    style={{
                      color: "#434343",
                      fontSize: 14,
                      lineHeight: "22px",
                    }}
                  >
                    <span style={{ color: "red" }}>*</span> Refusal flag:
                  </p>
                </Col>
                <Col span={16}>
                  <Select
                    defaultValue={false}
                    style={{ width: 120 }}
                    options={[
                      { value: true, label: "TRUE" },
                      { value: false, label: "FALSE" },
                    ]}
                    onChange={(val) => {
                      setEditingData((prev: any) => {
                        return {
                          ...prev,
                          refusal_flag: val,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <p
                    style={{
                      color: "#434343",
                      fontSize: 14,
                      lineHeight: "22px",
                    }}
                  >
                    <span style={{ color: "red" }}>*</span> Target assignable:
                  </p>
                </Col>
                <Col span={16}>
                  <Select
                    defaultValue={false}
                    style={{ width: 120 }}
                    options={[
                      { value: true, label: "TRUE" },
                      { value: false, label: "FALSE" },
                    ]}
                    onChange={(val) => {
                      setEditingData((prev: any) => {
                        return {
                          ...prev,
                          target_assignable: val,
                        };
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <p
                    style={{
                      color: "#434343",
                      fontSize: 14,
                      lineHeight: "22px",
                    }}
                  >
                    <span style={{ color: "red" }}>*</span> Web-app tag:
                  </p>
                </Col>
                <Col span={16}>
                  <Row align="middle">
                    <Col span={16}>
                      <Input
                        onChange={(e) => {
                          setEditingData((prev: any) => {
                            return {
                              ...prev,
                              webapp_tag_color: e.target.value,
                            };
                          });
                        }}
                        defaultValue={editingData.webapp_tag_color}
                      />
                    </Col>
                    <Col span={8}>
                      <Tag
                        color={editingData.webapp_tag_color}
                        style={{ marginLeft: 16 }}
                      >
                        {editingData.webapp_tag_color}
                      </Tag>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Button
                type="default"
                style={{ marginTop: 24, marginRight: 12, borderRadius: 2 }}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                style={{
                  marginTop: 24,
                  marginLeft: 24,
                  backgroundColor: "#2f54eb",
                  color: "white",
                  borderRadius: 2,
                }}
                onClick={onAddMapping}
              >
                Add
              </Button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}

export default SurveyStatusMapping;
