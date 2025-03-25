import SideMenu from "../../SideMenu";
import { HeaderContainer, Title } from "../../../../shared/Nav.styled";
import { SCTOLoadErrorArea } from "../../SurveyCTOQuestions/SurveyCTOQuestions.styled";

import { GlobalStyle } from "../../../../shared/Global.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { Form, Input, message, Radio, Space, Modal, Alert } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckboxSCTO, StyledFormItem } from "./TargetsConfig.styled";
import { CustomBtn } from "../../../../shared/Global.styled";

import {
  ContinueButton,
  FooterWrapper,
} from "../../../../shared/FooterBar.styled";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { getSurveyCTOForm } from "../../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import {
  postTargetConfig,
  updateTargetSCTOColumns,
  getTargetConfig,
  putTargetConfig,
  deleteAllTargets,
  getTargets,
} from "../../../../redux/targets/targetActions";
import Container from "../../../../components/Layout/Container";
import { setuploadMode } from "../../../../redux/targets/targetSlice";
import TargetsReupload from "../TargetsReupload/TargetsReupload";
import TargetsRemap from "../TargetsRemap/TargetsRemap";

function TargetsConfig() {
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [sourceType, setSourceType] = useState("");
  const handleSourceChange = (e: any) => {
    setSourceType(e.target.value);
  };
  const { survey_uid } = useParams<{ survey_uid: string }>() ?? {
    survey_uid: "",
  };
  const { form_uid } = useParams<{ form_uid: string }>() ?? {
    form_uid: "",
  };
  const [targetConfig, setTargetConfig] = useState<any>();

  const toggleUploadMode = (value: string) => {
    dispatch(setuploadMode(value));
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [sctoError, setSctoError] = useState(false);
  const [surveyCTOErrorMessages, setSurveyCTOErrorMessages] = useState<
    string[]
  >([]);
  const [screenMode, setScreenMode] = useState<string>("manage");

  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );

  const fetchTargetConfig = async () => {
    setLoading(true);
    const response = await dispatch(getTargetConfig({ form_uid: form_uid! }));
    if (response.payload.success) {
      handleSourceChange({
        target: { value: response.payload.data.data.target_source },
      });
      const configData = response.payload.data.data;
      const { form_uid, ...restConfig } = configData;
      setTargetConfig(restConfig);
      handleSourceChange({
        target: { value: configData.target_source },
      });
      form.setFieldsValue(restConfig);
    }
    setLoading(false);
  };

  const handleFormUID = async () => {
    try {
      setLoading(true);
      const sctoForm = await dispatch(
        getSurveyCTOForm({ survey_uid: survey_uid })
      );
      if (sctoForm?.payload[0]?.form_uid) {
        navigate(
          `/survey-information/targets/config/${survey_uid}/${sctoForm?.payload[0]?.form_uid}`
        );
      } else {
        navigate(`/survey-information/survey-cto-information/${survey_uid}`);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form_uid == "" || form_uid == undefined || form_uid == "undefined") {
      handleFormUID();
    } else {
      fetchTargetConfig();
    }
  }, [form_uid]);

  const handleDeleteAllTargets = async () => {
    try {
      setLoading(true);
      const deleteResponse = await dispatch(
        deleteAllTargets({ form_uid: form_uid! })
      );
      if (!deleteResponse.payload.success) {
        message.error("Delete failed");
      }
    } catch (error) {
      console.log("Error deleting targets", error);
    } finally {
      setLoading(false);
    }
  };

  const handlConfigChanges = async (values: any) => {
    if (targetConfig) {
      const targets = await dispatch(getTargets({ formUID: form_uid! }));
      if (targets.payload.data.data.length > 0) {
        const hasChanges = Object.keys(values).some((key) => {
          if (key === "form_uid") return false;
          const isChanged = values[key] !== targetConfig[key];
          return isChanged;
        });

        if (
          hasChanges ||
          (values.target_source === "csv" &&
            targetConfig.target_source === "csv")
        ) {
          setModalVisible(true);
          return;
        }
      }
    }
    await handleSaveConfig("");
  };

  const handleContinue = async () => {
    try {
      await form.validateFields(); // Validate all fields before submission
      const values = form.getFieldsValue();
      values.form_uid = form_uid;

      await handlConfigChanges(values);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleSaveConfig = async (mode: string) => {
    try {
      await form.validateFields(); // Validate all fields before submission
      const values = form.getFieldsValue();
      values.form_uid = form_uid;

      if (mode === "delete") {
        await handleDeleteAllTargets();
      }

      setLoading(true);

      const response = targetConfig
        ? await dispatch(putTargetConfig(values))
        : await dispatch(postTargetConfig(values));

      if (response.payload) {
        if (sourceType === "csv") {
          if (mode === "merge") {
            setScreenMode("reupload");
          } else {
            navigate(
              `/survey-information/targets/upload/${survey_uid}/${form_uid}`
            );
          }
        } else {
          const refresh_scto_columns = await dispatch(
            updateTargetSCTOColumns({ form_uid: form_uid! })
          );
          if (refresh_scto_columns.payload.success) {
            navigate(
              `/survey-information/targets/scto_map/${survey_uid}/${form_uid}`
            );
          } else {
            setSctoError(true);
            setSurveyCTOErrorMessages(refresh_scto_columns.payload.errors);
            message.error("Error in fetching data from SurveyCTO");
          }
        }
      } else {
        console.log("Error in postTargetConfig");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Targets: Configuration</Title>
      </HeaderContainer>
      {loading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          {screenMode === "manage" ? (
            <>
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#f5f5f5",
                  paddingLeft: "80px",
                  paddingTop: "23px",
                  fontFamily: "Lato",
                }}
              >
                <Form
                  form={form}
                  layout="horizontal"
                  style={{
                    paddingTop: "20px",
                    fontFamily: "Lato",
                    fontSize: "16px",
                  }}
                >
                  <StyledFormItem
                    name="target_source"
                    label="Select the source of targets"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please select the source of targets",
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Space
                        direction="horizontal"
                        onChange={handleSourceChange}
                      >
                        <Radio value="csv">Upload CSV</Radio>
                        <Radio value="scto">
                          Connect to a SurveyCTO dataset/form
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </StyledFormItem>

                  {sourceType === "scto" && (
                    <>
                      <StyledFormItem
                        name="scto_input_type"
                        label="Select type of SurveyCTO input"
                        labelCol={{ span: 24 }}
                        rules={[
                          {
                            required: true,
                            message: "Please select type of SurveyCTO input",
                          },
                        ]}
                      >
                        <Radio.Group>
                          <Space direction="horizontal">
                            <Radio value="dataset">Dataset</Radio>
                            <Radio value="form">Form</Radio>
                          </Space>
                        </Radio.Group>
                      </StyledFormItem>
                      <StyledFormItem
                        name="scto_input_id"
                        labelCol={{ span: 24 }}
                        label="Enter the SurveyCTO dataset/form ID"
                        rules={[
                          {
                            required: true,
                            message:
                              "Please enter the SurveyCTO dataset/form ID",
                          },
                        ]}
                      >
                        <Input style={{ width: "25%" }} />
                      </StyledFormItem>
                      <StyledFormItem
                        name="scto_encryption_flag"
                        valuePropName="checked"
                      >
                        <CheckboxSCTO>
                          The form is encrypted. If yes, please share the key
                          with{" "}
                          <a href="mail:surveystream.devs@idinsight.org">
                            surveystream.devs@idinsight.org
                          </a>{" "}
                          via FlowCrypt/Nordpass.
                        </CheckboxSCTO>
                      </StyledFormItem>
                    </>
                  )}
                </Form>
                {sctoError && (
                  <SCTOLoadErrorArea>
                    <br />
                    The SurveyCTO form definition could not be loaded due to the
                    following errors:
                    <br />
                    <br />
                    <div>
                      <Alert message={surveyCTOErrorMessages} type="error" />
                      <br />
                    </div>
                  </SCTOLoadErrorArea>
                )}
                <CustomBtn onClick={handleContinue} style={{ marginTop: 20 }}>
                  Continue
                </CustomBtn>
              </div>
              <Modal
                title="Warning"
                visible={modalVisible}
                onOk={() => {
                  setModalVisible(false);
                  handleSaveConfig("delete"); // Continue after deletion
                }}
                onCancel={() => {
                  setModalVisible(false);
                  handleSaveConfig("merge"); // Continue without deletion
                }}
                okText="Delete existing targets data"
                cancelText="Merge with existing targets data"
              >
                <p>
                  We have detected changes to target config. Do you want to
                  delete existing targets data?
                </p>
              </Modal>
            </>
          ) : null}
          {screenMode === "reupload" ? (
            <>
              <TargetsReupload setScreenMode={setScreenMode} />
            </>
          ) : null}
          {screenMode === "remap" ? (
            <>
              <TargetsRemap setScreenMode={setScreenMode} />
            </>
          ) : null}
        </div>
      )}
    </>
  );
}
export default TargetsConfig;
