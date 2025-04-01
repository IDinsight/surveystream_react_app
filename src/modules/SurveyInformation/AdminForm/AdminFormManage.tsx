import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Container from "../../../components/Layout/Container";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

import { HeaderContainer } from "../../../shared/Nav.styled";
import { BodyContainer, CustomBtn, FormItemLabel } from "./AdminForm.styled";
import { getSurveyCTOForm } from "../../../redux/surveyCTOInformation/surveyCTOInformationActions";
import { RootState } from "../../../redux/store";
import { Button, Checkbox, Col, Input, Row, Select, message } from "antd";
import {
  createAdminForm,
  getAdminForm,
  updateAdminForm,
} from "../../../redux/adminForm/adminFormActions";
import { userHasPermission } from "../../../utils/helper";
import { Breadcrumb } from "antd";
import SideMenu from "../SideMenu";

const { Option } = Select;

function AdminFormManage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  if (!survey_uid) {
    navigate("/surveys");
  }

  const [searchParam] = useSearchParams();
  const adminFormUID = searchParam.get("admin_form_uid");

  const userProfile = useAppSelector((state: RootState) => state.auth.profile);
  const canUserWrite = userHasPermission(
    userProfile,
    survey_uid,
    "WRITE Admin Forms"
  );

  const { loading: isSurveyCTOFormLoading, surveyCTOForm } = useAppSelector(
    (state: RootState) => state.surveyCTOInformation
  );

  const { loading: isAdminFormLoading } = useAppSelector(
    (state: RootState) => state.adminForms
  );

  const [formFieldsData, setFormFieldsData] = useState<any>({
    survey_uid: survey_uid,
    scto_form_id: null,
    form_name: null,
    tz_name: null,
    scto_server_name: null,
    encryption_key_shared: false,
    server_access_role_granted: null,
    server_access_allowed: null,
    form_type: "admin",
    admin_form_type: null,
  });

  const handleSave = () => {
    const fields = Object.keys(formFieldsData);
    for (let i = 0; i < fields.length; i++) {
      if (formFieldsData[fields[i]] === null) {
        message.error("Please fill all the required fields.");
        return;
      }
    }

    if (adminFormUID) {
      dispatch(
        updateAdminForm({
          formUID: adminFormUID,
          data: formFieldsData,
        })
      ).then((res) => {
        if (res.payload?.success) {
          const formUID = res.payload?.data.form_uid;
          message.success("Admin form updated successfully.");
          navigate(
            `/survey-information/admin-forms/${survey_uid}/scto-questions/${formUID}`
          );
        } else {
          message.error(res.payload?.message);
        }
      });
    } else {
      dispatch(
        createAdminForm({
          data: formFieldsData,
        })
      ).then((res) => {
        if (res.payload?.success) {
          const formUID = res.payload?.data.data.survey.form_uid;
          message.success("Admin form created successfully.");
          navigate(
            `/survey-information/admin-forms/${survey_uid}/scto-questions/${formUID}`
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
    if (adminFormUID) {
      dispatch(getAdminForm({ form_uid: adminFormUID })).then((res) => {
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
            form_type: "admin",
            admin_form_type: data.admin_form_type,
          }));
        } else {
          message.error("Something went wrong!");
        }
      });
    }
  }, [adminFormUID]);

  // Loading data from the parent form for the same survey
  // This works now since there is a single parent form
  // Change later to have server details in the survey object
  useEffect(() => {
    if (surveyCTOForm) {
      setFormFieldsData((prev: any) => ({
        ...prev,
        tz_name: surveyCTOForm?.tz_name,
        scto_server_name: surveyCTOForm?.scto_server_name,
        server_access_role_granted: surveyCTOForm?.server_access_role_granted,
        server_access_allowed: surveyCTOForm?.server_access_allowed,
      }));
    }
  }, [surveyCTOForm]);

  const isLoading = isSurveyCTOFormLoading || isAdminFormLoading;

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Container surveyPage={true} />
          <HeaderContainer>
            <Breadcrumb
              separator=">"
              style={{ fontSize: "16px", color: "#000" }}
              items={[
                {
                  title: "Admin Forms",
                  href: `/survey-information/admin-forms/${survey_uid}`,
                },
                {
                  title: "Form Details",
                },
              ]}
            />
          </HeaderContainer>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyContainer>
              <p style={{ color: "#8C8C8C", fontSize: 14 }}>
                Please fill out the SurveyCTO form details for an admin form.
              </p>
              <p style={{ color: "#8C8C8C", fontSize: 14 }}>
                Kindly note that it is assumed that the SurveyCTO server name
                and timezone for the admin form matches that of the other forms
                in the survey.
              </p>
              <Row align="middle" style={{ marginBottom: 6, marginTop: 24 }}>
                <Col span={6}>
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Select admin form
                    type:
                  </FormItemLabel>
                </Col>
                <Col span={8}>
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Bikelog / Account details / Other"
                    value={formFieldsData?.admin_form_type}
                    disabled={!canUserWrite}
                    onSelect={(val: any) => {
                      setFormFieldsData((prev: any) => ({
                        ...prev,
                        admin_form_type: val,
                      }));
                    }}
                  >
                    <Option value="bikelog">Bikelog</Option>
                    <Option value="account_details">Account details</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Col>
              </Row>
              <Row align="middle" style={{ marginBottom: 6 }}>
                <Col span={6}>
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Admin form ID:
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
              <Row align="middle" style={{ marginBottom: 18 }}>
                <Col span={6}>
                  <FormItemLabel>
                    <span style={{ color: "red" }}>*</span> Admin form name:
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
              <Row align={"middle"} style={{ marginBottom: 6 }}>
                <Col>
                  <Checkbox
                    checked={formFieldsData?.encryption_key_shared}
                    onChange={(e) => {
                      setFormFieldsData((prev: any) => ({
                        ...prev,
                        encryption_key_shared: e.target.checked,
                      }));
                    }}
                  >
                    The form is encrypted. If yes, please share the key with{" "}
                    <a href="mail:surveystream.devs@idinsight.org">
                      surveystream.devs@idinsight.org
                    </a>{" "}
                    via FlowCrypt/Nordpass.
                  </Checkbox>
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
          </div>
        </>
      )}
    </>
  );
}

export default AdminFormManage;
