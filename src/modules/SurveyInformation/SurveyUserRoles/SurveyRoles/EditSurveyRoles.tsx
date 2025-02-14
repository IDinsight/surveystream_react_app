import { Button, Col, Form, Input, Radio, Row, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  DescriptionText,
  DescriptionTitle,
  StyledFormItem,
} from "../../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import {
  getAllPermissions,
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../../redux/userRoles/userRolesActions";
import { Key, useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import {
  BodyWrapper,
  CustomBtn,
  StyledTooltip,
} from "../SurveyUserRoles.styled";
import {
  NavWrapper,
  Title,
  HeaderContainer,
} from "../../../../shared/Nav.styled";
import SideMenu from "../../SideMenu";

import PermissionsTable from "../../../../components/PermissionsTable";
import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";
import { setRolePermissions } from "../../../../redux/userRoles/userRolesSlice";

interface OriginalRolesData {
  reporting_role_uid: number | null;
  role_name: string;
  role_uid: string;
  survey_uid: number;
  permissions: any;
}

interface TransformedRolesData {
  role: string;
  role_uid: number;
}

function EditSurveyRoles() {
  const [editRolesForm] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const { role_uid } = useParams<{ role_uid?: string }>() ?? {
    role_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const supervisorRoles = useAppSelector(
    (state: RootState) => state.userRoles.supervisorRoles
  );
  const rolePermissions = useAppSelector(
    (state: RootState) => state.userRoles.rolePermissions
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.userRoles.loading
  );
  const [rolesEditData, setRolesEditData] = useState<any>([]);
  const [hasReportingRole, setHasReportingRole] = useState(false);
  const [allPermissions, setAllPermissions] = useState<any>([]);
  const [localPermissions, setLocalPermissions] = useState<any>([]);
  const [rolesTableData, setRolesTableData] = useState<any>([]);

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const { loading: isSideMenuLoading } = useAppSelector(
    (state: RootState) => state.surveyConfig
  );
  const fetchAllPermissions = async () => {
    const res = await dispatch(getAllPermissions({ survey_uid: survey_uid }));
    setAllPermissions(res.payload);
  };

  const fetchSupervisorRoles = async () => {
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));

    if (Array.isArray(res.payload) && res.payload.length > 0) {
      const originalRolesData: OriginalRolesData[] = res.payload;

      const transformedData: TransformedRolesData[] = (
        Array.isArray(originalRolesData)
          ? originalRolesData
          : [originalRolesData]
      ).map((item: any) => ({
        role_uid: item.role_uid,
        role: item.role_name,
      }));

      setRolesTableData(transformedData);

      const filteredRole = originalRolesData.find(
        (role) => role.role_uid == role_uid
      );

      setLocalPermissions(filteredRole?.permissions);

      if (filteredRole?.reporting_role_uid != null) {
        setHasReportingRole(true);
        editRolesForm.setFieldsValue({
          ...filteredRole,
          has_reporting_role: true,
        });
      } else {
        setHasReportingRole(false);
        editRolesForm.setFieldsValue({
          ...filteredRole,
          has_reporting_role: false,
        });
      }

      setRolesEditData(filteredRole);

      dispatch(
        setRolePermissions({
          survey_uid: survey_uid ?? null,
          permissions: filteredRole?.permissions,
          role_uid: filteredRole?.role_uid ?? null,
          duplicate: false,
        })
      );
    } else {
      message.error("Could not fetch roles, kindly reload to try again");
    }
  };

  const handlePermissionsChange = async (newPermissions: any[]) => {
    setLocalPermissions(newPermissions);
  };

  const handleRadioChange = (value: boolean) => {
    setHasReportingRole(value);
  };

  const handleEditRole = async () => {
    try {
      const formValues = editRolesForm.getFieldsValue();

      setLoading(true);
      if (survey_uid == undefined) {
        message.error(
          "Please check that the survey_uid is provided on the url!"
        );
        return;
      }

      // Validate the form fields
      editRolesForm
        .validateFields()
        .then(async (formValues) => {
          if (localPermissions.length == 0) {
            message.error("Kindly select the role permissions to proceed!");
            return;
          }

          formValues.permissions = localPermissions;
          let otherRoles = supervisorRoles.filter(
            (role) => role.role_name !== "Survey Admin"
          );

          formValues.role_uid = role_uid;
          otherRoles = [
            ...otherRoles.filter(
              (role) => role.role_uid != formValues.role_uid
            ),
          ];
          otherRoles.push(formValues);

          const rolesRes = await dispatch(
            postSupervisorRoles({
              supervisorRolesData: otherRoles, // Pass validated form values
              validate_hierarchy: false,
              surveyUid: survey_uid,
            })
          );

          if (rolesRes.payload.status === false) {
            message.error(rolesRes.payload.message);
            return;
          } else {
            navigate(`/survey-information/survey-roles/roles/${survey_uid}`);
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
    if (role_uid == "" || role_uid == undefined) {
      message.error(
        "Kindly check that the role_uid is provided on the url to proceed."
      );

      navigate(`/survey-information/survey-roles/roles/${survey_uid}`);
      return;
    }
    fetchAllPermissions();
    fetchSupervisorRoles();
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />

      <NavWrapper>
        <HandleBackButton surveyPage={true}></HandleBackButton>

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
      <HeaderContainer>
        <Title>Survey Roles</Title>
      </HeaderContainer>
      {isLoading || isSideMenuLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyWrapper>
              <DescriptionText>
                <>Edit selected role</>
              </DescriptionText>

              <div style={{ display: "flex" }}></div>

              <Form form={editRolesForm}>
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
                      label={
                        <span>
                          Does this role report to someone?&nbsp;
                          <StyledTooltip title="As saved under role hierachy. Use the 'Edit role hierarchy' button on the previous screen to edit this.">
                            <QuestionCircleOutlined />
                          </StyledTooltip>
                        </span>
                      }
                      labelAlign="right"
                      labelCol={{ span: 24 }}
                      style={{ display: "block" }}
                      hasFeedback
                      name="has_reporting_role"
                    >
                      <Radio.Group
                        style={{ display: "flex", width: "100px" }}
                        onChange={(e) => handleRadioChange(e.target.value)}
                        disabled={true}
                        defaultValue={false}
                      >
                        <Radio.Button value={true}>Yes</Radio.Button>
                        <Radio.Button value={false}>No</Radio.Button>
                      </Radio.Group>
                    </StyledFormItem>

                    {hasReportingRole && (
                      <StyledFormItem
                        label={
                          <span>
                            Reporting role?&nbsp;
                            <StyledTooltip title="As saved under role hierachy. Use the 'Edit role hierarchy' button on the previous screen to edit this.">
                              <QuestionCircleOutlined />
                            </StyledTooltip>
                          </span>
                        }
                        labelAlign="right"
                        name="reporting_role_uid"
                        hasFeedback
                      >
                        <Select
                          showSearch={true}
                          allowClear={true}
                          disabled={true}
                          placeholder="Select reporting role"
                          style={{ width: "100%" }}
                        >
                          {rolesTableData
                            .filter(
                              (r: { role_uid: any }) => r.role_uid != role_uid
                            ) // Filter out the current role being edited
                            .map(
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
              <div>
                <Button
                  style={{ marginTop: 0, marginRight: 24 }}
                  onClick={() =>
                    navigate(
                      `/survey-information/survey-roles/roles/${survey_uid}`
                    )
                  }
                >
                  Cancel
                </Button>
                <CustomBtn style={{ marginTop: 0 }} onClick={handleEditRole}>
                  Save
                </CustomBtn>
              </div>
            </BodyWrapper>
          </div>
        </>
      )}
    </>
  );
}

export default EditSurveyRoles;
