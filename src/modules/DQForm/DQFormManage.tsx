import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Container from "../../components/Layout/Container";
import FullScreenLoader from "../../components/Loaders/FullScreenLoader";
import NavItems from "../../components/NavItems";
import Header from "../../components/Header";
import { HeaderContainer } from "../Assignments/Assignments.styled";
import { Title } from "../../shared/Nav.styled";
import { BodyContainer, CustomBtn, FormItemLabel } from "./DQForm.styled";
import { getSurveyCTOForm } from "../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../redux/store";
import { Button, Col, Input, Row, Select, message } from "antd";
import {
  createDQForm,
  getDQForm,
  updateDQForm,
} from "../../redux/dqForm/dqFormActions";
import { userHasPermission } from "../../utils/helper";

function DQFormManage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  if (!survey_uid) {
    navigate("/surveys");
  }

  const [searchParam] = useSearchParams();
  const dqFormUID = searchParam.get("dq_form_uid");

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Data Quality Forms"
  );

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const { loading: isDQFormLoading } = useAppSelector(
    (state: RootState) => state.dqForms
  );

  const [formFieldsData, setFormFieldsData] = useState<any>({
    survey_uid: survey_uid,
    scto_form_id: null,
    form_name: null,
    tz_name: null,
    scto_server_name: null,
    encryption_key_shared: null,
    server_access_role_granted: null,
    server_access_allowed: null,
    form_type: "dq",
    dq_form_type: null,
    parent_form_uid: null,
  });

  const handleSave = () => {
    const fields = Object.keys(formFieldsData);
    for (let i = 0; i < fields.length; i++) {
      if (formFieldsData[fields[i]] === null) {
        message.error("Please fill all the required fields.");
        return;
      }
    }

    if (dqFormUID) {
      dispatch(
        updateDQForm({
          formUID: dqFormUID,
          data: formFieldsData,
        })
      ).then((res) => {
        if (res.payload?.success) {
          const formUID = res.payload?.data.form_uid;
          message.success("DQ form updated successfully.");
          navigate(
            `/module-configuration/dq-forms/${survey_uid}/scto-questions/${formUID}`
          );
        } else {
          message.error(res.payload?.message);
        }
      });
    } else {
      dispatch(
        createDQForm({
          data: formFieldsData,
        })
      ).then((res) => {
        if (res.payload?.success) {
          const formUID = res.payload?.data.data.survey.form_uid;
          message.success("DQ form created successfully.");
          navigate(
            `/module-configuration/dq-forms/${survey_uid}/scto-questions/${formUID}`
          );
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
    dispatch(getSurveyCTOForm({ survey_uid }));
  }, [dispatch, survey_uid]);

  useEffect(() => {
    if (dqFormUID) {
      dispatch(getDQForm({ form_uid: dqFormUID })).then((res) => {
        if (res.payload?.success) {
          const data = res.payload?.data;
          setFormFieldsData((pre: any) => ({
            ...pre,
            survey_uid: data.survey_uid,
            scto_form_id: data.scto_form_id,
            form_name: data.form_name,
            tz_name: data.tz_name,
            scto_server_name: data.scto_server_name,
            encryption_key_shared: data.encryption_key_shared,
            server_access_role_granted: data.server_access_role_granted,
            server_access_allowed: data.server_access_allowed,
            form_type: "dq",
            dq_form_type: data.dq_form_type,
            parent_form_uid: data.parent_form_uid,
          }));
        } else {
          message.error("Something went wrong!");
        }
      });
    }
  }, [dqFormUID]);

  // Loading data from the main form
  useEffect(() => {
    if (formFieldsData.parent_form_uid) {
      if (formFieldsData.parent_form_uid === surveyCTOForm?.form_uid) {
        setFormFieldsData((prev: any) => ({
          ...prev,
          tz_name: surveyCTOForm?.tz_name,
          scto_server_name: surveyCTOForm?.scto_server_name,
          encryption_key_shared: surveyCTOForm?.encryption_key_shared,
          server_access_role_granted: surveyCTOForm?.server_access_role_granted,
          server_access_allowed: surveyCTOForm?.server_access_allowed,
        }));
      }
    }
  }, [formFieldsData.parent_form_uid]);

  const isLoading = isSurveyCTOFormLoading || isDQFormLoading;

  return (
    <>
      <Header items={NavItems} />
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container />
          <HeaderContainer>
            <Title>Data quality forms</Title>
          </HeaderContainer>
          <BodyContainer>
            <p style={{ color: "#8C8C8C", fontSize: 14 }}>
              Please fill out the SurveyCTO form details for a data quality
              form.
            </p>
            <p style={{ color: "#8C8C8C", fontSize: 14 }}>
              Kindly note that it is assumed that the SurveyCTO server name and
              timezone for the data quality form matches that of the
              corresponding main form
            </p>
            <Row align="middle" style={{ marginBottom: 6, marginTop: 24 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> Select main SCTO form:
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="SCTO Form"
                  value={formFieldsData?.parent_form_uid}
                  disabled={!canUserWrite}
                  onSelect={(val) => {
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      parent_form_uid: val as string,
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
                  <span style={{ color: "red" }}>*</span> Select DQ form type:
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Select
                  style={{ width: "100%" }}
                  placeholder="audioaudit / backcheck/ spotcheck"
                  value={formFieldsData?.dq_form_type}
                  disabled={!canUserWrite}
                  onSelect={(val: any) => {
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      dq_form_type: val,
                    }));
                  }}
                >
                  <Select.Option value="audioaudit">audioaudit</Select.Option>
                  <Select.Option value="backcheck">backcheck</Select.Option>
                  <Select.Option value="spotcheck">spotcheck</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> DQ form ID:
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <Input
                  value={formFieldsData?.scto_form_id}
                  onChange={(e) => {
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      scto_form_id: e.target.value,
                    }));
                  }}
                />
              </Col>
            </Row>
            <Row align="middle" style={{ marginBottom: 6 }}>
              <Col span={6}>
                <FormItemLabel>
                  <span style={{ color: "red" }}>*</span> DQ form name:
                </FormItemLabel>
              </Col>
              <Col span={8} style={{ display: "flex" }}>
                <Input
                  value={formFieldsData?.form_name}
                  onChange={(e) => {
                    setFormFieldsData((prev: any) => ({
                      ...prev,
                      form_name: e.target.value,
                    }));
                  }}
                />
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

export default DQFormManage;
