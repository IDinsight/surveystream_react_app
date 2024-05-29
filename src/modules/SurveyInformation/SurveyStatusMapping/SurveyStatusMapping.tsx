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
import {
  BodyContainer,
  CustomBtn,
  EditingModel,
  FormItemLabel,
} from "./SurveyStatusMapping.styled";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getTargetStatusMapping,
  updateTargetStatusMapping,
} from "../../../redux/targetStatusMapping/targetStatusMappingActions";
import { getSurveyBasicInformation } from "../../../redux/surveyConfig/surveyConfigActions";

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

  const { loading: isBasicInfoLoading, basicInfo } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const [formIdName, setFormIdName] = useState<string>("");
  const [isFormConfirmed, setIsFormConfirmed] = useState<boolean>(false);
  const [editingMode, setEditingMode] = useState<string | null>(null);
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
      key: item.survey_status,
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

  // Row selection for status table
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onConfirmClick = () => {
    if (!sctoForm.form_uid) return;

    dispatch(getTargetStatusMapping({ formUID: sctoForm.form_uid }));
    setIsFormConfirmed(true);
  };

  const onAddClick = () => {
    setEditingMode("add");
  };

  const onEditClick = () => {
    const rowData = targetStatusMapping.find(
      (item: any) => item.survey_status === selectedRowKeys[0]
    );

    setEditingData(rowData);
    setEditingMode("edit");
  };

  const onAddMapping = () => {
    if (!sctoForm.form_uid) return;

    // Check if all the required fields are filled
    if (Object.values(editingData).includes("")) {
      message.error("Please fill all the required fields!");
      return;
    }

    // Check whether web-app tag is a valid CSS color
    const s = new Option().style;
    s.color = editingData.webapp_tag_color;
    if (s.color === "") {
      message.error("Please enter a valid CSS color code!");
      return;
    }

    // Check if survey status and survey status label already exists
    targetStatusMapping.forEach((ele: any) => {
      if (ele.survey_status === parseInt(editingData.survey_status)) {
        message.error(
          "Survey status already exists, please add unique survey status!"
        );
        return;
      }

      if (
        ele.survey_status_label.toLowerCase() ===
        editingData.survey_status_label.toLowerCase()
      ) {
        message.error(
          "Survey status label already exists, please add a unique survey status label!"
        );
        return;
      }
    });

    dispatch(
      updateTargetStatusMapping({
        formUID: sctoForm.form_uid,
        data: [...targetStatusMapping, editingData],
      })
    ).then((res) => {
      if (res.payload.data.success) {
        message.success("Mapping added successfully!");
        setEditingMode(null);
        setSelectedRowKeys([]);

        if (!sctoForm.form_uid) return;
        dispatch(getTargetStatusMapping({ formUID: sctoForm.form_uid }));
      } else {
        message.error("Failed to add mapping!");
      }
    });
  };

  const onEditMapping = () => {
    if (!sctoForm.form_uid) return;

    // Check if all the required fields are filled
    if (Object.values(editingData).includes("")) {
      message.error("Please fill all the required fields!");
      return;
    }

    // Check whether web-app tag is a valid CSS color
    const s = new Option().style;
    s.color = editingData.webapp_tag_color;
    if (s.color === "") {
      message.error("Please enter a valid CSS color code!");
      return;
    }

    dispatch(
      updateTargetStatusMapping({
        formUID: sctoForm.form_uid,
        data: [
          ...targetStatusMapping.filter(
            (ele: any) => ele.survey_status !== editingData.survey_status
          ),
          editingData,
        ],
      })
    ).then((res) => {
      if (res.payload.data.success) {
        message.success("Mapping edit successfully!");
        setEditingMode(null);
        setSelectedRowKeys([]);

        if (!sctoForm.form_uid) return;
        dispatch(getTargetStatusMapping({ formUID: sctoForm.form_uid }));
      } else {
        message.error("Failed to edit mapping!");
      }
    });
  };

  const onDeleteMapping = () => {
    if (!sctoForm.form_uid) return;

    const newMapping = targetStatusMapping.filter(
      (ele: any) => !selectedRowKeys.includes(ele.survey_status)
    );

    dispatch(
      updateTargetStatusMapping({
        formUID: sctoForm.form_uid,
        data: newMapping,
      })
    ).then((res) => {
      if (res.payload.data.success) {
        message.success("Mapping deleted successfully!");
        setSelectedRowKeys([]);

        if (!sctoForm.form_uid) return;
        dispatch(getTargetStatusMapping({ formUID: sctoForm.form_uid }));
      } else {
        message.error("Failed to delete mapping!");
      }
    });
  };

  useEffect(() => {
    if (!survey_uid) {
      navigate("/surveys");
    }

    dispatch(getSurveyCTOForm({ survey_uid: survey_uid }));
    dispatch(getSurveyBasicInformation({ survey_uid: survey_uid }));
  }, [dispatch, survey_uid]);

  return (
    <>
      <Header items={NavItems} />
      {isLoading || isMappingLoading || isBasicInfoLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container title="Survey status" />
          <div style={{ marginLeft: 56, marginRight: 56 }}>
            <p style={{ color: "rgba(0,0,0, 0.45)" }}>
              {basicInfo?.survey_name} / Survey status{" "}
              {isFormConfirmed ? "/ Select survey status" : null}
            </p>
            {isFormConfirmed ? (
              <>
                <BodyContainer>
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
                      onClick={onEditClick}
                    >
                      Edit
                    </CustomBtn>
                  ) : null}
                  {selectedRowKeys.length > 0 ? (
                    <CustomBtn
                      type="primary"
                      icon={<DeleteOutlined />}
                      style={{ marginLeft: 10 }}
                      onClick={onDeleteMapping}
                    >
                      Delete
                    </CustomBtn>
                  ) : null}
                </BodyContainer>
                <Table
                  columns={tableColumns}
                  dataSource={tableDataSources}
                  rowSelection={rowSelection}
                  bordered
                />
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
                        <Input
                          defaultValue={basicInfo.surveying_method}
                          disabled
                        />
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
          {editingMode ? (
            <EditingModel>
              <p
                style={{
                  color: "#262626",
                  fontSize: 24,
                  lineHeight: "32px",
                  fontWeight: 500,
                }}
              >
                {editingMode === "add" ? "Add mapping" : "Edit mapping"}
              </p>
              <Row align="middle" style={{ marginBottom: 12 }}>
                <Col span={8}>
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Survey status:
                  </FormItemLabel>
                </Col>
                <Col span={16}>
                  <Input
                    type="number"
                    defaultValue={editingData.survey_status || ""}
                    disabled={editingMode === "edit"}
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
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Survey status label:
                  </FormItemLabel>
                </Col>
                <Col span={16}>
                  <Input
                    defaultValue={editingData.survey_status_label}
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
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Completed flag:
                  </FormItemLabel>
                </Col>
                <Col span={16}>
                  <Select
                    defaultValue={editingData.completed_flag ?? true}
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
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Refusal flag:
                  </FormItemLabel>
                </Col>
                <Col span={16}>
                  <Select
                    defaultValue={editingData.refusal_flag ?? false}
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
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Target assignable:
                  </FormItemLabel>
                </Col>
                <Col span={16}>
                  <Select
                    defaultValue={editingData.target_assignable ?? false}
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
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Web-app tag:
                  </FormItemLabel>
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
                onClick={() => setEditingMode(null)}
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
                onClick={editingMode === "add" ? onAddMapping : onEditMapping}
              >
                {editingMode === "add" ? "Add" : "Edit"}
              </Button>
            </EditingModel>
          ) : null}
        </>
      )}
    </>
  );
}

export default SurveyStatusMapping;
