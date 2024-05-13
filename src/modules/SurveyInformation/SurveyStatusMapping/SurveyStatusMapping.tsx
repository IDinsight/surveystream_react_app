import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import NavItems from "../../../components/NavItems";
import Header from "../../../components/Header";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import { CustomBtn } from "./SurveyStatusMapping.styled";
import { PlusOutlined } from "@ant-design/icons";

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

  const [formIdName, setFormIdName] = useState<string>(
    "gfa_2023_endline_hh_survey_v1"
  );
  const [isFormConfirmed, setIsFormConfirmed] = useState<boolean>(true);

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

  useEffect(() => {
    if (!survey_uid) {
      navigate("/surveys");
    }

    dispatch(getSurveyCTOForm({ survey_uid: survey_uid }));
  }, [dispatch, survey_uid]);

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
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
                  >
                    Add
                  </CustomBtn>
                </div>
                <Table columns={tableColumns} />
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
                        <CustomBtn
                          type="primary"
                          onClick={() => setIsFormConfirmed(true)}
                        >
                          Confirm
                        </CustomBtn>
                      </Form.Item>
                    </>
                  ) : null}
                </Form>
              </>
            )}
          </div>
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
                  style={{ color: "#434343", fontSize: 14, lineHeight: "22px" }}
                >
                  <span style={{ color: "red" }}>*</span> Survey status:
                </p>
              </Col>
              <Col span={16}>
                <Input />
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 12 }}>
              <Col span={8}>
                <p
                  style={{ color: "#434343", fontSize: 14, lineHeight: "22px" }}
                >
                  <span style={{ color: "red" }}>*</span> Survey status label:
                </p>
              </Col>
              <Col span={16}>
                <Input />
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 12 }}>
              <Col span={8}>
                <p
                  style={{ color: "#434343", fontSize: 14, lineHeight: "22px" }}
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
                />
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 12 }}>
              <Col span={8}>
                <p
                  style={{ color: "#434343", fontSize: 14, lineHeight: "22px" }}
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
                />
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 12 }}>
              <Col span={8}>
                <p
                  style={{ color: "#434343", fontSize: 14, lineHeight: "22px" }}
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
                />
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 12 }}>
              <Col span={8}>
                <p
                  style={{ color: "#434343", fontSize: 14, lineHeight: "22px" }}
                >
                  <span style={{ color: "red" }}>*</span> Web-app tag:
                </p>
              </Col>
              <Col span={16}>
                <Input />
              </Col>
            </Row>
            <Button
              type="default"
              style={{ marginTop: 24, marginRight: 12, borderRadius: 2 }}
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
            >
              Add
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default SurveyStatusMapping;
