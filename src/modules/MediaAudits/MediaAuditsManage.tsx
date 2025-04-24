import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";

import { HeaderContainer, Title } from "../../shared/Nav.styled";
import { BodyContainer, CustomBtn, FormItemLabel } from "./MediaAudits.styled";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../redux/store";
import { Button, Col, Row, Select, Spin, Tooltip, message } from "antd";
import { getCTOFormQuestions } from "../../redux/surveyCTOQuestions/surveyCTOQuestionsActions";
import { InfoCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { getAdminForms } from "../../redux/adminForm/adminFormActions";
import {
  createMediaAuditConfig,
  getMediaAuditConfig,
  updateMediaAuditConfig,
} from "../../redux/mediaAudits/mediaAuditsActions";
import { userHasPermission } from "../../utils/helper";
import { resolveSurveyNotification } from "../../redux/notifications/notificationActions";

const { Option } = Select;

function MediaAuditsManage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  if (!survey_uid) {
    navigate("/surveys");
  }

  const [searchParam] = useSearchParams();
  const mediaConfigUID = searchParam.get("media_config_uid");

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Media Files Config"
  );

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const { loading: isAdminFormLoading, adminForms } = useAppSelector(
    (state: RootState) => state.adminForms
  );

  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionWithRepeatGroup, setQuestionWithRepeatGroup] = useState<any[]>(
    []
  );
  const [formFieldsData, setFormFieldsData] = useState<any>({
    form_uid: null,
    file_type: null,
    source: null,
    format: null,
    scto_fields: [],
    media_fields: [],
    mapping_criteria: "",
  });

  const loadFormQuestions = async (formUid: string) => {
    setIsQuestionLoading(true);
    if (formUid != undefined) {
      const questionsRes = await dispatch(
        await getCTOFormQuestions({ formUid, refresh: false })
      );

      if (questionsRes.payload?.error) {
        let errorMsg = "";
        if (questionsRes.payload?.error.includes("ResourceNotFoundException")) {
          errorMsg =
            "The resource is not found. Either the SCTO server name is wrong, or access is not given.";
        } else if (questionsRes.payload?.error.includes("Client Error")) {
          errorMsg = "Either Form ID is wrong or access is not given.";
        } else {
          errorMsg = questionsRes.payload?.error;
        }

        message.error(errorMsg);
      }
      if (questionsRes.payload?.questions) {
        const questions: any = [];
        questionsRes.payload?.questions.forEach((question: any) => {
          questions.push({
            label: question.question_name,
            value: question.question_name,
          });
        });
        setQuestions(questions);
      }
      const repeatGroupRes = await dispatch(
        await getCTOFormQuestions({
          formUid,
          refresh: false,
          include_repeat_groups: true,
        })
      );

      if (repeatGroupRes.payload?.error) {
        let errorMsg = "";
        if (
          repeatGroupRes.payload?.error.includes("ResourceNotFoundException")
        ) {
          errorMsg =
            "The resource is not found. Either the SCTO server name is wrong, or access is not given.";
        } else if (repeatGroupRes.payload?.error.includes("Client Error")) {
          errorMsg = "Either Form ID is wrong or access is not given.";
        } else {
          errorMsg = repeatGroupRes.payload?.error;
        }

        message.error(errorMsg);
      }
      if (repeatGroupRes.payload?.questions) {
        const repeatGroupQuestions: any = [];
        repeatGroupRes.payload?.questions.forEach((question: any) => {
          repeatGroupQuestions.push({
            label: question.question_name,
            value: question.question_name,
          });
        });
        setQuestionWithRepeatGroup(repeatGroupQuestions);
      }
    } else {
      message.error("There is problem with main STCO form uid.");
    }
    setIsQuestionLoading(false);
  };

  const handleSave = () => {
    const fields = Object.keys(formFieldsData);
    for (let i = 0; i < fields.length; i++) {
      if (fields[i] === "mapping_criteria") continue;
      if (formFieldsData[fields[i]] === "") {
        message.error("Please fill all the required fields.");
        break;
      }
    }

    if (mediaConfigUID) {
      dispatch(
        updateMediaAuditConfig({
          mediaConfigUID: mediaConfigUID,
          data: formFieldsData,
        })
      ).then((res) => {
        if (res.payload?.success) {
          message.success("Media Audit Config updated successfully.");
          dispatch(
            resolveSurveyNotification({
              survey_uid: survey_uid,
              module_id: 12,
              resolution_status: "done",
            })
          );
          navigate(`/module-configuration/media-audits/${survey_uid}`);
        } else {
          message.error(res.payload?.message);
        }
      });
    } else {
      dispatch(
        createMediaAuditConfig({
          formUID: formFieldsData.form_uid,
          data: formFieldsData,
        })
      ).then((res) => {
        if (res.payload?.success) {
          message.success("Media Audit Config saved successfully.");
          navigate(`/module-configuration/media-audits/${survey_uid}`);
        } else {
          message.error(res.payload?.message);
        }
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(getSurveyCTOForm({ survey_uid: survey_uid }));
  }, [dispatch, survey_uid]);

  useEffect(() => {
    if (survey_uid) {
      dispatch(getAdminForms({ survey_uid }));
    }
  }, [dispatch, survey_uid]);

  useEffect(() => {
    if (mediaConfigUID) {
      dispatch(getMediaAuditConfig({ mediaConfigUID: mediaConfigUID })).then(
        (res) => {
          if (res.payload?.success) {
            const data = res.payload?.data.data;
            setFormFieldsData((pre: any) => ({
              ...pre,
              form_uid: data.form_uid,
              file_type: data.file_type,
              source: data.source,
              format: data.format,
              scto_fields: data.scto_fields,
              media_fields: data.media_fields,
              mapping_criteria: data.mapping_criteria,
            }));
          } else {
            message.error("Something went wrong!");
          }
        }
      );
    }
  }, [mediaConfigUID]);

  useEffect(() => {
    if (formFieldsData.form_uid) {
      loadFormQuestions(formFieldsData.form_uid);
    }
  }, [formFieldsData.form_uid]);

  const isLoading = isSurveyCTOFormLoading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          <HeaderContainer>
            <Title>Media Audits</Title>
          </HeaderContainer>
          <BodyContainer>
            {mediaConfigUID ? (
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: "#8C8C8C", fontSize: 14, marginTop: -20 }}>
                  Edit the media audit configuration below. Kindly note that any
                  changes made will take a few minutes to reflect on the output
                  Google Sheets.
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: 30 }}>
                <p style={{ color: "#8C8C8C", fontSize: 14, marginTop: -20 }}>
                  Please provide all the details below to create a media audit
                  configuration for generating Google Sheets with links to media
                  files from SurveyCTO or Exotel.
                </p>{" "}
                <span style={{ display: "inline-block" }}></span>
                <p style={{ color: "#8C8C8C", fontSize: 14, marginTop: -20 }}>
                  Links to the Google Sheet outputs will be available on the
                  home page as soon as they are created. Survey Admins will also
                  receive an email notification granting them access to the
                  Google Drive folder containing the sheets.
                </p>
              </div>
            )}

            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> Select form ID{" "}
                  <Tooltip title="Dropdown contains main forms and admin forms added for the survey">
                    <InfoCircleOutlined />
                  </Tooltip>{" "}
                  :
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="SCTO Form"
                  value={formFieldsData?.form_uid}
                  disabled={!canUserWrite}
                  onSelect={(val) => {
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      form_uid: val as string,
                    }));
                  }}
                >
                  {surveyCTOForm?.scto_form_id && (
                    <Option value={surveyCTOForm?.form_uid}>
                      {surveyCTOForm?.scto_form_id}
                    </Option>
                  )}
                  {adminForms.map((form: any) => (
                    <Option key={form.form_uid} value={form.form_uid}>
                      {form.scto_form_id}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> Select media type:
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Photo / Audio"
                  value={formFieldsData?.file_type}
                  disabled={!canUserWrite}
                  onSelect={(val: any) => {
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      file_type: val,
                    }));
                  }}
                >
                  <Select.Option value="photo">Photo</Select.Option>
                  <Select.Option value="audio">Audio</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> Select audit source:
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="SCTO form / Exotel"
                  value={formFieldsData?.source}
                  disabled={!canUserWrite}
                  onSelect={(val) =>
                    setFormFieldsData((prev: any) => ({ ...prev, source: val }))
                  }
                >
                  <Select.Option value="SurveyCTO">SCTO form</Select.Option>
                  {formFieldsData.file_type === "audio" ? (
                    <Select.Option value="Exotel">Exotel</Select.Option>
                  ) : null}
                </Select>
              </Col>
            </Row>
            {formFieldsData?.source === "SurveyCTO" && (
              <Row align="middle" style={{ marginBottom: 6 }}>
                <Col span={6}>
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Select output type{" "}
                    <Tooltip title="Long format is 1 row per media file. Wide format is 1 row per submission.">
                      <InfoCircleOutlined />
                    </Tooltip>{" "}
                    :
                  </FormItemLabel>
                </Col>
                <Col span={8}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Long / Wide"
                    value={formFieldsData?.format}
                    disabled={!canUserWrite}
                    onSelect={(val: any) => {
                      setFormFieldsData((prev: any) => ({
                        ...prev,
                        format: val,
                      }));
                    }}
                  >
                    <Select.Option value="long">Long</Select.Option>
                    <Select.Option value="wide">Wide</Select.Option>
                  </Select>
                </Col>
              </Row>
            )}
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> Select column
                  variables{" "}
                  <Tooltip title="The columns on the Google Sheet will be displayed in the same order as the variables are selected.">
                    <InfoCircleOutlined />
                  </Tooltip>{" "}
                  :
                </FormItemLabel>
              </Col>
              <Col span={8} style={{ display: "flex" }}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Multi select"
                  options={questions.filter(
                    (q) => !formFieldsData?.media_fields?.includes(q.value)
                  )}
                  mode="multiple"
                  allowClear
                  value={formFieldsData?.scto_fields}
                  disabled={!canUserWrite}
                  onChange={(val) => {
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      scto_fields: val,
                    }));
                  }}
                ></Select>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />}
                  style={{
                    marginLeft: 24,
                    display: isQuestionLoading ? "block" : "none",
                  }}
                />
              </Col>
            </Row>
            {formFieldsData?.format === "wide" && (
              <Row align="middle" style={{ marginBottom: 6 }}>
                <Col span={6}>
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Select media
                    variables{" "}
                    <Tooltip title="The columns on the Google Sheet will be displayed in the same order as the variables are selected.">
                      <InfoCircleOutlined />
                    </Tooltip>{" "}
                    :
                  </FormItemLabel>
                </Col>
                <Col span={8} style={{ display: "flex" }}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Multi select"
                    options={questionWithRepeatGroup.filter(
                      (q) => !formFieldsData?.scto_fields?.includes(q.value)
                    )}
                    mode="multiple"
                    allowClear
                    value={formFieldsData?.media_fields}
                    disabled={!canUserWrite}
                    onChange={(val) => {
                      setFormFieldsData((prev: any) => ({
                        ...prev,
                        media_fields: val,
                      }));
                    }}
                  ></Select>
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 28 }} spin />
                    }
                    style={{
                      marginLeft: 24,
                      display: isQuestionLoading ? "block" : "none",
                    }}
                  />
                </Col>
              </Row>
            )}
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  Select mapping criteria{" "}
                  <Tooltip title="Mapping criteria will be used to create multiple Google Sheets - one per prime geo location or language as per selection. If location/language level Google Sheets are not required, kindly select 'Not required'. This option is not available for admin forms. ">
                    <InfoCircleOutlined />
                  </Tooltip>{" "}
                  :
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Location / Language"
                  value={formFieldsData?.mapping_criteria}
                  disabled={
                    !canUserWrite ||
                    // Disable if form_uid is in adminForms. Admin forms are not allowed to have mapping criteria since mapping is done using target location and language details.
                    adminForms.some(
                      (form: any) => form.form_uid === formFieldsData?.form_uid
                    )
                  }
                  onSelect={(val) =>
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      mapping_criteria: val,
                    }))
                  }
                >
                  <Select.Option value={null}>Not required</Select.Option>
                  <Select.Option value="location">Location</Select.Option>
                  <Select.Option value="language">Language</Select.Option>
                </Select>
              </Col>
            </Row>
            <div>
              <Button
                style={{ marginTop: 24, marginRight: 24 }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <CustomBtn
                style={{ marginTop: 24 }}
                disabled={!canUserWrite}
                onClick={handleSave}
              >
                Save
              </CustomBtn>
            </div>
          </BodyContainer>
        </>
      )}
    </>
  );
}

export default MediaAuditsManage;
