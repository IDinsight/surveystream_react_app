import { Col, Form, Input, Radio, Row, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionText,
  DescriptionTitle,
  StyledFormItem,
} from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  getAllPermissions,
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../redux/userRoles/userRolesActions";
import { Key, useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";
import { BodyWrapper } from "./UserRoles.styled";
import {
  BackArrow,
  BackLink,
  NavWrapper,
  Title,
} from "../../../shared/Nav.styled";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "./SideMenu";
import Header from "../../../components/Header";
import PermissionsTable from "../../../components/PermissionsTable";

interface OriginalRolesData {
  reporting_role_uid: number | null;
  role_name: string;
  role_uid: number;
  survey_uid: number;
}

interface TransformedRolesData {
  role: string;
  role_uid: number;
}

function AddSurveyRoles() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const supervisorRoles = useAppSelector(
    (state: RootState) => state.userRoles.supervisorRoles
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.userRoles.loading
  );

  const rolePermissions = useAppSelector(
    (state: RootState) => state.userRoles.rolePermissions
  );

  const [loading, setLoading] = useState(false);

  const [rolesTableData, setRolesTableData] = useState<any>([]);

  const [hasReportingRole, setHasReportingRole] = useState(false);

  const [allPermissions, setAllPermissions] = useState<any>([]);

  const [localPermissions, setLocalPermissions] = useState<any>([]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const [addRolesForm] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const handleRadioChange = (value: boolean) => {
    setHasReportingRole(value);
  };

  const fetchSupervisorRoles = async () => {
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));

    if (res.payload.length > 0) {
      const originalRolesData: OriginalRolesData = res.payload;
      console.log("originalRolesData", originalRolesData);

      const transformedData: TransformedRolesData[] = (
        Array.isArray(originalRolesData)
          ? originalRolesData
          : [originalRolesData]
      ).map((item: any) => ({
        role_uid: item.role_uid,
        role: item.role_name,
      }));

      console.log("transformedData", transformedData);

      setRolesTableData(transformedData);
    } else {
      setRolesTableData([]);
    }
  };

  const fetchAllPermissions = async () => {
    const res = await dispatch(getAllPermissions());
    console.log("getAllPermissions", res.payload);
    setAllPermissions(res.payload);
  };

  const handlePermissionsChange = async (newPermissions: any[]) => {
    setLocalPermissions(newPermissions);
    console.log("handlePermissionsChange", newPermissions);
    console.log("rolePermissions", rolePermissions);
  };

  const handleAddRole = async () => {
    try {
      const formValues = addRolesForm.getFieldsValue();

      console.log("formValues", formValues);

      setLoading(true);
      if (survey_uid == undefined) {
        message.error(
          "Please check that the survey_uid is provided on the url!"
        );
        return;
      }

      // Validate the form fields
      addRolesForm
        .validateFields()
        .then(async (formValues) => {
          if (localPermissions.length == 0) {
            message.error("Kindly select the role permissions to proceed!");
            return;
          }

          formValues.permissions = localPermissions;
          const otherRoles = [...supervisorRoles];

          otherRoles.push(formValues);

          //combine with other supervisor roles
          console.log("supervisorRoles", otherRoles);

          const rolesRes = await dispatch(
            postSupervisorRoles({
              supervisorRolesData: otherRoles,
              surveyUid: survey_uid,
            })
          );

          if (rolesRes.payload.status === false) {
            message.error(rolesRes.payload.message);
            return;
          } else {
            navigate(`/survey-information/user-roles/roles/${survey_uid}`);
            message.success("Roles updated successfully");
          }
        })
        .catch((error) => {
          // Handle validation errors
          console.error("Validation error:", error);
          message.error(
            `Validation error: ${error?.errorFields[0]?.errors[0]}`
          );
        });
    } catch (error) {
      message.error("Failed to submit roles data, kindly check");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisorRoles();
    fetchAllPermissions();
  }, [dispatch]);

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title>
          {(() => {
            const activeSurveyData = localStorage.getItem("activeSurvey");
            return (
              activeSurvey?.survey_name ||
              (activeSurveyData && JSON.parse(activeSurveyData).survey_name) ||
              ""
            );
          })()}
        </Title>
      </NavWrapper>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyWrapper>
              <DescriptionTitle>Roles</DescriptionTitle>
              <DescriptionText style={{ marginRight: "auto" }}>
                Create new role
              </DescriptionText>

              <div style={{ display: "flex" }}></div>

              <Form form={addRolesForm}>
                <Row gutter={36} style={{ marginBottom: "30px" }}>
                  <Col span={12}>
                    <StyledFormItem
                      label="Role name"
                      labelAlign="right"
                      name="role_name"
                      style={{ display: "block" }}
                      rules={[
                        {
                          required: true,
                          message: "Please enter a role name",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input style={{ width: "100%" }} />
                    </StyledFormItem>

                    <StyledFormItem
                      label="Does this role report to someone?"
                      labelAlign="right"
                      labelCol={{ span: 24 }}
                      style={{ display: "block" }}
                      rules={[
                        {
                          required: true,
                          message:
                            "Please select if the role has a reporting role",
                        },
                      ]}
                      hasFeedback
                      name="has_reporting_role"
                    >
                      <Radio.Group
                        style={{ display: "flex", width: "100px" }}
                        onChange={(e) => handleRadioChange(e.target.value)}
                        defaultValue={false}
                      >
                        <Radio.Button value={true}>Yes</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                      </Radio.Group>
                    </StyledFormItem>

                    {hasReportingRole && (
                      <StyledFormItem
                        label="Reporting role"
                        labelAlign="right"
                        name="reporting_role_uid"
                        rules={[
                          {
                            required: true,
                            message: "Please select the reporting role",
                          },
                        ]}
                        hasFeedback
                      >
                        <Select
                          showSearch={true}
                          allowClear={true}
                          placeholder="Select reporting role"
                          style={{ width: "100%" }}
                        >
                          <Select.Option value={null}>
                            No reporting role
                          </Select.Option>
                          {rolesTableData.map(
                            (
                              r: { role_uid: any; role: any },
                              i: Key | null | undefined
                            ) => (
                              <Select.Option key={i} value={r.role_uid}>
                                {r.role}
                              </Select.Option>
                            )
                          )}
                        </Select>
                      </StyledFormItem>
                    )}
                  </Col>
                </Row>

                <DescriptionTitle>Role permissions</DescriptionTitle>
                <DescriptionText style={{ marginRight: "auto" }}>
                  Please select the respective permission by selecting edit,
                  view or none against the permission{" "}
                </DescriptionText>

                <PermissionsTable
                  permissions={allPermissions}
                  onPermissionsChange={handlePermissionsChange}
                />
              </Form>
            </BodyWrapper>
          </div>

          <FooterWrapper>
            <SaveButton disabled>Save</SaveButton>
            <ContinueButton loading={loading} onClick={handleAddRole}>
              Finalize roles
            </ContinueButton>
          </FooterWrapper>
        </>
      )}
    </>
  );
}

export default AddSurveyRoles;
