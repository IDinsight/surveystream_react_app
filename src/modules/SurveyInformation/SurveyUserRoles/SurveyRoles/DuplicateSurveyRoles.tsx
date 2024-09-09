import { Button, Col, Form, Input, Row, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionText,
  DescriptionTitle,
  StyledFormItem,
} from "../../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { setRolePermissions } from "../../../../redux/userRoles/userRolesSlice";
import {
  getAllPermissions,
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../../redux/userRoles/userRolesActions";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { BodyWrapper, CustomBtn } from "../SurveyUserRoles.styled";
import {
  NavWrapper,
  Title,
  HeaderContainer,
} from "../../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import Header from "../../../../components/Header";
import PermissionsTable from "../../../../components/PermissionsTable";
import { GlobalStyle } from "../../../../shared/Global.styled";
import HandleBackButton from "../../../../components/HandleBackButton";

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

function DuplicateSurveyRoles() {
  const [duplicateRolesForm] = Form.useForm();
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
  const isuserRolesLoading = useAppSelector(
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
  const fetchAllPermissions = async () => {
    const res = await dispatch(getAllPermissions({ survey_uid: survey_uid }));
    setAllPermissions(res.payload);
  };

  const fetchSupervisorRoles = async () => {
    setLoading(true);
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

      duplicateRolesForm.setFieldsValue({
        ...filteredRole,
      });

      duplicateRolesForm.setFieldsValue({ role_name: null });

      setRolesEditData(filteredRole);
      dispatch(
        setRolePermissions({
          survey_uid: survey_uid ?? null,
          permissions: filteredRole?.permissions,
          role_uid: filteredRole?.role_uid ?? null,
          duplicate: false,
        })
      );
      setLoading(false);
    } else {
      setLoading(false);
      message.error("Could not fetch roles, kindly reload to try again");
    }
  };

  const handlePermissionsChange = async (newPermissions: any[]) => {
    setLocalPermissions(newPermissions);
  };

  const handleRadioChange = (value: boolean) => {
    setHasReportingRole(value);
  };

  const handleDuplicateRole = async () => {
    try {
      const formValues = duplicateRolesForm.getFieldsValue();

      setLoading(true);
      if (survey_uid == undefined) {
        message.error(
          "Please check that the survey_uid is provided on the url!"
        );
        return;
      }

      // Validate the form fields
      duplicateRolesForm
        .validateFields()
        .then(async (formValues) => {
          if (localPermissions.length == 0) {
            message.error("Kindly select the role permissions to proceed!");
            return;
          }

          formValues.permissions = localPermissions;
          //remove survey admin role from the initial
          const otherRoles = supervisorRoles.filter(
            (role) => role.role_name !== "Survey Admin"
          );

          formValues.role_uid = null;
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
            navigate(
              `/survey-information/survey-roles/hierarchy/${survey_uid}`
            );
            message.success("Role duplicated successfully");
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
    fetchSupervisorRoles();
    fetchAllPermissions();
  }, [dispatch]);

  const isLoading = loading || isuserRolesLoading;

  return (
    <>
      <GlobalStyle />
      <Header />
      <NavWrapper>
        <HandleBackButton></HandleBackButton>

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
        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        ></div>
      </HeaderContainer>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <div style={{ display: "flex" }}>
            <SideMenu />
            <BodyWrapper>
              <DescriptionTitle>Roles</DescriptionTitle>
              <DescriptionText>
                <>Duplicate selected role</>
              </DescriptionText>

              <div style={{ display: "flex" }}></div>

              <Form form={duplicateRolesForm}>
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
                <CustomBtn
                  style={{ marginTop: 0 }}
                  onClick={handleDuplicateRole}
                >
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

export default DuplicateSurveyRoles;
