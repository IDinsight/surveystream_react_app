import { Button, Col, Form, Input, Row, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
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
  const isuserManagementLoading = useAppSelector(
    (state: RootState) => state.userManagement.loading
  );

  const [loading, setLoading] = useState(false);

  const [allPermissions, setAllPermissions] = useState<any>([]);

  const [localPermissions, setLocalPermissions] = useState<any>([]);

  const [addRolesForm] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const fetchSupervisorRoles = async () => {
    setLoading(true);
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));
    if (res.payload.length > 0) {
      const originalRolesData: OriginalRolesData = res.payload;

      const roleData = Array.isArray(originalRolesData)
        ? originalRolesData
        : [originalRolesData];

      const transformedData: TransformedRolesData[] = [];
      roleData.forEach((role: OriginalRolesData) => {
        // Remove the Survey Admin role from the list
        if (role.role_name === "Survey Admin") {
          return;
        }

        transformedData.push({
          role: role.role_name,
          role_uid: role.role_uid,
        });
      });
    }
    setLoading(false);
  };

  const fetchAllPermissions = async () => {
    const res = await dispatch(getAllPermissions({ survey_uid: survey_uid }));
    setAllPermissions(res.payload);
  };

  const handlePermissionsChange = async (newPermissions: any[]) => {
    setLocalPermissions(newPermissions);
  };

  const handleAddRole = async () => {
    try {
      const formValues = addRolesForm.getFieldsValue();

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
          const otherRoles = supervisorRoles.filter(
            (role) => role.role_name !== "Survey Admin"
          );

          const roleExists = otherRoles.some(
            (role) => role.role_name === formValues.role_name
          );

          if (roleExists) {
            message.error(
              "Role with the same name already exists, kindly change the name to create a new role!"
            );
            return;
          }

          otherRoles.push(formValues);

          const rolesRes = await dispatch(
            postSupervisorRoles({
              supervisorRolesData: otherRoles,
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
            message.success("Roles updated successfully");
          }
        })
        .catch((error) => {
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

  const isLoading = isuserManagementLoading || loading;

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
              <DescriptionText style={{ marginRight: "auto" }}>
                Create a new role
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
                <CustomBtn style={{ marginTop: 0 }} onClick={handleAddRole}>
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

export default AddSurveyRoles;
