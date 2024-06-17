import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import NavItems from "../../components/NavItems";
import Header from "../../components/Header";
import { HeaderContainer } from "../Assignments/Assignments.styled";
import { Title } from "../../shared/Nav.styled";
import { BodyContainer, CustomBtn, FormItemLabel } from "./MediaAudits.styled";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../redux/store";
import { Button, Col, Row, Select, Spin, message } from "antd";
import { getCTOFormQuestions } from "../../redux/surveyCTOQuestions/surveyCTOQuestionsActions";
import { LoadingOutlined } from "@ant-design/icons";
import {
  createMediaAuditConfig,
  getMediaAuditConfig,
  updateMediaAuditConfig,
} from "../../redux/mediaAudits/mediaAuditsActions";

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
  console.log(mediaConfigUID);

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [formFieldsData, setFormFieldsData] = useState<any>({
    form_uid: "",
    file_type: "",
    source: "",
    scto_fields: [],
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
          errorMsg = "Either Main Form ID is wrong or access is not given.";
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
        if (res.payload?.error) {
          message.error(res.payload?.error);
        } else {
          message.success("Media Audit Config updated successfully.");
          navigate(`/module-configuration/media-audits/${survey_uid}`);
        }
      });
    } else {
      dispatch(
        createMediaAuditConfig({
          formUID: formFieldsData.form_uid,
          data: formFieldsData,
        })
      ).then((res) => {
        if (res.payload?.error) {
          message.error(res.payload?.error);
        } else {
          message.success("Media Audit Config saved successfully.");
          navigate(`/module-configuration/media-audits/${survey_uid}`);
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
              scto_fields: data.scto_fields,
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
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Media Audit Config</Title>
          </HeaderContainer>
          <BodyContainer>
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> Select main SCTO form:
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  value={formFieldsData?.form_uid}
                  onSelect={(val) => {
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      form_uid: val as string,
                    }));
                  }}
                >
                  {surveyCTOForm?.scto_form_id && (
                    <Select.Option value={surveyCTOForm?.form_uid}>
                      {surveyCTOForm?.scto_form_id}
                    </Select.Option>
                  )}
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
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> Select column
                  variables:
                </FormItemLabel>
              </Col>
              <Col span={8} style={{ display: "flex" }}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Multi select"
                  options={questions}
                  mode="multiple"
                  allowClear
                  value={formFieldsData?.scto_fields}
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
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> Select mapping
                  criteria:
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Location / Language"
                  value={formFieldsData?.mapping_criteria}
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
              <CustomBtn style={{ marginTop: 24 }} onClick={handleSave}>
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
