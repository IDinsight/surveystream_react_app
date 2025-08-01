import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import SideMenu from "../SideMenu";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Drawer,
  Tag,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import {
  TargetStatusFormWrapper,
  BodyContainer,
  FormItemLabel,
  StatusMappingTable,
} from "./SurveyStatusMapping.styled";
import { CustomBtn } from "../../../shared/Global.styled";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getTargetStatusMapping,
  updateTargetStatusMapping,
} from "../../../redux/targetStatusMapping/targetStatusMappingActions";
import { getSurveyBasicInformation } from "../../../redux/surveyConfig/surveyConfigActions";
import { HeaderContainer, Title } from "../../../shared/Nav.styled";
import SurveyStatusCount from "../../../components/SurveyStatusCount";
import DescriptionLink from "../../../components/DescriptionLink";

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
  const { loading: isSideMenuLoading } = useAppSelector(
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

  const webAppTagColors = [
    "green",
    "gold",
    "cyan",
    "red",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "gray",
    "maroon",
    "olive",
    "navy",
    "teal",
  ];

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

  const handleFormUID = async () => {
    if (!sctoForm.form_uid) {
      try {
        const sctoFormResponse = await dispatch(
          getSurveyCTOForm({ survey_uid: survey_uid })
        );
        const fetchedFormUID = sctoFormResponse?.payload[0]?.form_uid;
        const fetchedFormName = sctoFormResponse?.payload[0]?.scto_form_id;

        if (fetchedFormUID) {
          setFormIdName(fetchedFormName);
          dispatch(getTargetStatusMapping({ formUID: fetchedFormUID }));
          setIsFormConfirmed(true);
        } else {
          message.error("Kindly configure SCTO Form to proceed");
        }
      } catch (error) {
        console.error("Error fetching sctoForm:", error);
      }
    } else {
      dispatch(getTargetStatusMapping({ formUID: sctoForm.form_uid }));
      setIsFormConfirmed(true);
    }
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
    for (const ele of targetStatusMapping) {
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
    }

    dispatch(
      updateTargetStatusMapping({
        formUID: sctoForm.form_uid,
        data: [...targetStatusMapping, editingData],
      })
    ).then((res) => {
      if (res.payload.data && res.payload.data.success === true) {
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
    handleFormUID();
  }, [dispatch, survey_uid]);

  return (
    <>
      {isLoading ||
      isMappingLoading ||
      isBasicInfoLoading ||
      isSideMenuLoading ||
      !isFormConfirmed ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          <HeaderContainer>
            <Title>Survey Status for Targets</Title>
            <SurveyStatusCount surveyStatusCount={targetStatusMapping.length} />
            <BodyContainer>
              <CustomBtn style={{ marginLeft: "auto" }} onClick={onAddClick}>
                Add
              </CustomBtn>
              <CustomBtn
                style={{ marginLeft: 10 }}
                onClick={onEditClick}
                disabled={selectedRowKeys.length !== 1}
              >
                Edit
              </CustomBtn>
              <CustomBtn
                style={{ marginLeft: 10 }}
                onClick={onDeleteMapping}
                disabled={selectedRowKeys.length === 0}
              >
                Delete
              </CustomBtn>
            </BodyContainer>
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <TargetStatusFormWrapper>
              <>
                <p
                  style={{
                    color: "#8C8C8C",
                    fontSize: 14,
                    marginBottom: 0,
                  }}
                >
                  Target status mapping is used to determine the status
                  (completed, refused, pending etc.) of a target for
                  productivity calculations and assignments, based on the value
                  recorded in the survey_status variable in its SurveyCTO
                  submissions. <br /> Add or edit all possible survey status
                  values for the selected form with form ID: {formIdName}. If
                  nothing is configured, the default values as per survey
                  modality is shown below.{" "}
                  <DescriptionLink link="https://docs.surveystream.idinsight.io/target_status" />
                </p>
                <StatusMappingTable
                  columns={tableColumns}
                  dataSource={tableDataSources}
                  rowSelection={rowSelection}
                  pagination={{ position: ["topRight"] }}
                  bordered={true}
                />
              </>

              {editingMode ? (
                <Drawer
                  open={editingMode ? true : false}
                  size="large"
                  onClose={() => setEditingMode(null)}
                  title={
                    editingMode === "add"
                      ? "Add Survey Status"
                      : "Edit Survey Status"
                  }
                >
                  <Row align="middle" style={{ marginBottom: 12 }}>
                    <Col span={7}>
                      <FormItemLabel>
                        <span style={{ color: "red" }}>*</span> Survey status:
                      </FormItemLabel>
                    </Col>
                    <Col span={14}>
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
                    <Col span={7}>
                      <FormItemLabel>
                        <span style={{ color: "red" }}>*</span> Survey status
                        label:
                      </FormItemLabel>
                    </Col>
                    <Col span={14}>
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
                    <Col span={7}>
                      <FormItemLabel>
                        <span style={{ color: "red" }}>*</span> Completed flag:
                      </FormItemLabel>
                    </Col>
                    <Col span={14}>
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
                    <Col span={7}>
                      <FormItemLabel>
                        <span style={{ color: "red" }}>*</span> Refusal flag:
                      </FormItemLabel>
                    </Col>
                    <Col span={14}>
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
                    <Col span={7}>
                      <FormItemLabel>
                        <span style={{ color: "red" }}>*</span> Target
                        assignable:
                      </FormItemLabel>
                    </Col>
                    <Col span={14}>
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
                    <Col span={7}>
                      <FormItemLabel>
                        <span style={{ color: "red" }}>*</span> Web-app tag:
                      </FormItemLabel>
                    </Col>
                    <Col span={14}>
                      <Row align="middle">
                        <Col span={10}>
                          <Select
                            defaultValue={editingData.webapp_tag_color}
                            style={{ width: 120 }}
                            options={webAppTagColors.map((color) => {
                              return { value: color, label: color };
                            })}
                            onChange={(val) => {
                              setEditingData((prev: any) => {
                                return {
                                  ...prev,
                                  webapp_tag_color: val,
                                };
                              });
                            }}
                          />
                        </Col>
                        <Col span={8}>
                          <Tag
                            color={editingData.webapp_tag_color}
                            style={{ marginLeft: 0 }}
                          >
                            {editingData.webapp_tag_color}
                          </Tag>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Button
                    type="default"
                    style={{ marginTop: 24 }}
                    onClick={() => setEditingMode(null)}
                  >
                    Cancel
                  </Button>
                  <CustomBtn
                    style={{
                      marginTop: 24,
                      marginLeft: 24,
                    }}
                    onClick={
                      editingMode === "add" ? onAddMapping : onEditMapping
                    }
                  >
                    Save
                  </CustomBtn>
                </Drawer>
              ) : null}
            </TargetStatusFormWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default SurveyStatusMapping;
