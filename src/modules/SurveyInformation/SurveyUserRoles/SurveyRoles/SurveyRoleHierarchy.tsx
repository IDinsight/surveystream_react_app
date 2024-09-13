import { Button, Form, Radio, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../../../components/Header.OLD";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  HeaderContainer,
} from "../../../../shared/Nav.styled";

import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";
import {
  CustomBtn,
  SurveyRoleHierarchyDescriptionText,
  SurveyRoleHierarchyFormWrapper,
} from "../SurveyUserRoles.styled";
import { useEffect, useState } from "react";
import { RootState } from "../../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../../redux/userRoles/userRolesActions";
import {
  DynamicItemsForm,
  StyledFormItem,
} from "../../SurveyInformation.styled";
import {
  resetSupervisorRoles,
  setSupervisorRoles,
} from "../../../../redux/userRoles/userRolesSlice";
import FullScreenLoader from "../../../../components/Loaders/FullScreenLoader";
import { getSurveyBasicInformation } from "../../../../redux/surveyConfig/surveyConfigActions";
import { GlobalStyle } from "../../../../shared/Global.styled";
import Container from "../../../../components/Layout/Container";
import HandleBackButton from "../../../../components/HandleBackButton";

function SurveyRoleHierarchy() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const supervisorRoles = useAppSelector(
    (state: RootState) => state.userRoles.supervisorRoles
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.userRoles.loading
  );

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(`/survey-configuration/${survey_uid}`);
    }
  };
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  const fetchSupervisorRoles = async () => {
    if (survey_uid != undefined) {
      const res = await dispatch(
        getSupervisorRoles({ survey_uid: survey_uid })
      );

      if (res.payload.length > 0) {
        const originalRolesData = res.payload;

        const filteredRoles = originalRolesData.filter(
          (item: { role_name: string }) => item.role_name !== "Survey Admin"
        );

        dispatch(setSupervisorRoles(filteredRoles));
      }
    }
  };

  const renderHierarchyRolesField = () => {
    const numRoles = supervisorRoles.length;

    const fields = Array.from({ length: numRoles }, (_, index) => {
      const role: {
        reporting_role_uid?: string;
        role_name?: string;
        role_uid?: string;
      } = supervisorRoles[index];

      return (
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 11 }}
          wrapperCol={{ span: 11 }}
          name={`role_${index}`}
          label={role.role_name ? role?.role_name : ""}
          initialValue={
            role?.reporting_role_uid ? role?.reporting_role_uid : null
          }
          rules={[
            {
              validator: (_: any, value: string | undefined) => {
                const hierarchyMap: { [key: string]: string[] } =
                  supervisorRoles.reduce((map, item) => {
                    const { reporting_role_uid, role_uid } = item;
                    if (reporting_role_uid !== null) {
                      if (!map[reporting_role_uid]) {
                        map[reporting_role_uid] = [];
                      }
                      map[reporting_role_uid].push(role_uid);
                    }
                    return map;
                  }, {} as { [key: string]: string[] });

                const hasCycle = (node: string, visited: string[] = []) => {
                  visited.push(node);

                  const children = hierarchyMap[node] || [];

                  for (let i = 0; i < children.length; i++) {
                    const child = children[i];

                    if (visited.includes(child)) {
                      return true; // Cycle detected
                    }

                    if (hasCycle(child, [...visited])) {
                      return true; // Cycle detected in child subtree
                    }
                  }

                  return false; // No cycle detected
                };

                if (role) {
                  const { role_uid } = role;

                  if (
                    value &&
                    supervisorRoles.some(
                      (g) => g.reporting_role_uid === value && g !== role
                    )
                  ) {
                    return Promise.reject("Please select a unique hierarchy!");
                  }
                  if (value && value === role.role_uid) {
                    return Promise.reject("Role hierarchy invalid!");
                  }
                  if (role_uid && hasCycle(role_uid)) {
                    return Promise.reject("Role hierarchy cycle detected!");
                  }
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Select
            showSearch={true}
            allowClear={true}
            placeholder="Choose hierarchy"
            style={{ width: "100%" }}
            onChange={(value) => handleSelectChange(value, index)}
          >
            <Select.Option value={null}>Highest hierarchy level</Select.Option>
            {supervisorRoles.map((g, i) => (
              <Select.Option key={i} value={g.role_uid}>
                {g.role_name}
              </Select.Option>
            ))}
          </Select>
        </StyledFormItem>
      );
    });

    return fields;
  };

  const handleSelectChange = (value: string, index: number) => {
    const updatedLevels = [...supervisorRoles];
    if (survey_uid != undefined) {
      updatedLevels[index] = {
        ...updatedLevels[index],
        reporting_role_uid: value,
      };

      dispatch(setSupervisorRoles(updatedLevels));
    } else {
      message.error(
        "Kindly check that survey_uid is provided in the url to proceed."
      );
    }
  };

  const handleHierarchyContinue = async () => {
    try {
      if (survey_uid != undefined) {
        setLoading(true);

        await form.validateFields();

        const surveyRolesData = supervisorRoles;

        const rolesRes = await dispatch(
          postSupervisorRoles({
            supervisorRolesData: surveyRolesData,
            validate_hierarchy: true,
            surveyUid: survey_uid,
          })
        );

        if (rolesRes.payload.status === false) {
          message.error(rolesRes.payload.message);
          return;
        } else {
          message.success("Role hierarchy updated successfully.");

          navigate(`/survey-information/survey-roles/roles/${survey_uid}`);
        }
      } else {
        message.error(
          "Kindly check that survey_uid is provided in the url to proceed."
        );
      }
      setLoading(false);
      // Save successful, navigate to the next step
    } catch (error) {
      setLoading(false);
      message.error("Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisorRoles();
    return () => {
      dispatch(resetSupervisorRoles());
    };
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />
      {/* <Header /> */}
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
        <Title>Survey Roles Hierarchy</Title>
        <div
          style={{ display: "flex", marginLeft: "auto", marginBottom: "15px" }}
        ></div>
      </HeaderContainer>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ display: "flex" }}>
          <SideMenu />
          <SurveyRoleHierarchyFormWrapper>
            <SurveyRoleHierarchyDescriptionText>
              Update or add role hierarchy for this survey
            </SurveyRoleHierarchyDescriptionText>
            <div style={{ marginTop: "30px" }}>
              <DynamicItemsForm form={form}>
                {renderHierarchyRolesField()}
              </DynamicItemsForm>
            </div>
            <div>
              <Button
                style={{ marginTop: 24, marginRight: 24 }}
                onClick={() =>
                  navigate(
                    `/survey-information/survey-roles/roles/${survey_uid}`
                  )
                }
              >
                Cancel
              </Button>
              <CustomBtn
                style={{ marginTop: 24 }}
                onClick={handleHierarchyContinue}
              >
                Save
              </CustomBtn>
            </div>
          </SurveyRoleHierarchyFormWrapper>
        </div>
      )}
    </>
  );
}

export default SurveyRoleHierarchy;
