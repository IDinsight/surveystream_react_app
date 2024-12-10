import SideMenu from "../../SideMenu";
import {
  HeaderContainer,
  NavWrapper,
  Title,
} from "../../../../shared/Nav.styled";

import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { Form, Input, message, Radio, Space } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckboxSCTO, StyledFormItem } from "./TargetsConfig.styled";
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
} from "../../../../redux/targets/targetActions";
import Container from "../../../../components/Layout/Container";
import { setuploadMode } from "../../../../redux/targets/targetSlice";

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

  const handleContinue = async () => {
    try {
      await form.validateFields(); // Validate all fields before submission
      setLoading(true);
      const values = form.getFieldsValue();
      values.form_uid = form_uid;

      const response = targetConfig
        ? await dispatch(putTargetConfig(values))
        : await dispatch(postTargetConfig(values));

      if (response.payload) {
        if (sourceType === "csv") {
          navigate(
            `/survey-information/targets/upload/${survey_uid}/${form_uid}`
          );
        } else {
          const refresh_scto_columns = await dispatch(
            updateTargetSCTOColumns({ form_uid: form_uid! })
          );
          if (refresh_scto_columns) {
            navigate(
              `/survey-information/targets/scto_map/${survey_uid}/${form_uid}`
            );

            if (targetConfig?.target_source === "csv") {
              toggleUploadMode("overwrite");
            }
          } else {
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
      {loading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <div
            style={{
              flex: 1,
              backgroundColor: "#f5f5f5",
              paddingLeft: "80px",
              paddingTop: "23px",
              fontFamily: "Lato",
            }}
          >
            <div style={{ display: "flex" }}>
              <Title>Targets: Configuration</Title>
            </div>
            <Form
              form={form}
              layout="horizontal"
              style={{
                paddingTop: "23px",
                fontFamily: "Lato",
                fontSize: "16px",
              }}
            >
              <StyledFormItem
                name="target_source"
                label="Select the source of Targets"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Please Select the source of Targets",
                  },
                ]}
              >
                <Radio.Group>
                  <Space direction="horizontal" onChange={handleSourceChange}>
                    <Radio value="csv">Upload CSV</Radio>
                    <Radio value="scto">
                      Connect to a SurveyCTO Dataset/Form
                    </Radio>
                  </Space>
                </Radio.Group>
              </StyledFormItem>

              {sourceType === "scto" && (
                <>
                  <StyledFormItem
                    name="scto_input_type"
                    label="Select Type of SurveyCTO Input"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Please Select Type of SurveyCTO Input",
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
                    label="Enter the SurveyCTO Input ID"
                    rules={[
                      {
                        required: true,
                        message: "Please Enter the SurveyCTO Dataset/Form ID",
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
                      If SCTO Form is encrypted, please share the SCTO key with{" "}
                      <a href="mail:surveystream.devs@idinsight.org">
                        surveystream.devs@idinsight.org
                      </a>{" "}
                      via FlowCrypt/Dashlane.
                    </CheckboxSCTO>
                  </StyledFormItem>
                </>
              )}

              {targetConfig && targetConfig.target_source !== sourceType && (
                <div
                  style={{
                    color: "red",
                    marginBottom: "16px",
                    fontSize: "14px",
                  }}
                >
                  Warning: Changing the source will delete already uploaded
                  targets.
                </div>
              )}
            </Form>
          </div>
        </div>
      )}
      <FooterWrapper>
        <ContinueButton onClick={handleContinue}>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}
export default TargetsConfig;
