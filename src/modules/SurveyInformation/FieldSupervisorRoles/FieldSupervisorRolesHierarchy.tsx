import { Form, Select, message } from "antd";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionWrap,
  DescriptionTitle,
  DescriptionText,
  StyledFormItem,
  DynamicItemsForm,
} from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { setSupervisorRoles } from "../../../redux/fieldSupervisorRoles/fieldSupervisorRolesSlice";
import { MainWrapper } from "../../../shared/Nav.styled";
import {
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../redux/fieldSupervisorRoles/fieldSupervisorRolesActions";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

function FieldSupervisorRolesHierarchy() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const isLoading = useAppSelector(
    (state: RootState) => state.surveyLocations.loading
  );
  const supervisorRoles = useAppSelector(
    (state: RootState) => state.filedSupervisorRoles.supervisorRoles
  );

  const fetchSupervisorRoles = async () => {
    await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));
  };

  const renderReportingRolesField = () => {
    const numRoles = supervisorRoles.length;

    const fields = Array.from({ length: numRoles }, (_, index) => {
      const role: {
        role_name?: string;
        reporting_role_uid?: string;
        role_uid?: string;
      } = supervisorRoles[index];

      return (
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 11 }}
          wrapperCol={{ span: 11 }}
          name={`role_${index}`}
          label={role.role_name ? role.role_name : ""}
          initialValue={
            role.reporting_role_uid ? role.reporting_role_uid : null
          }
          rules={[
            {
              validator: (_: any, value: string | undefined) => {
                // Create a mapping of role_uid to reporting_role_uids
                const rolesMap: { [key: string]: string[] } =
                  supervisorRoles.reduce((map, role) => {
                    const { role_uid, reporting_role_uid } = role;
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

                  const children = rolesMap[node] || [];

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

                if (value && value === role.role_uid) {
                  return Promise.reject("A role cannot report to itself!");
                }
                if (
                  value &&
                  supervisorRoles.some(
                    (r) => r.reporting_role_uid === value && r !== role
                  )
                ) {
                  return Promise.reject(
                    "Please select a unique reporting role!"
                  );
                }
                if (role.role_uid && hasCycle(role.role_uid)) {
                  return Promise.reject("Role hierarchy cycle detected!");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Select
            placeholder="Select reporting role"
            style={{ width: "100%" }}
            onChange={(value) => handleSelectChange(value, index)}
          >
            <Select.Option value={null}>No reporting role</Select.Option>
            {supervisorRoles.map((r, i) => (
              <Select.Option key={i} value={r.role_uid}>
                {r.role_name}
              </Select.Option>
            ))}
          </Select>
        </StyledFormItem>
      );
    });

    return fields;
  };

  const handleSelectChange = (value: string, index: number) => {
    const updatedRoles = [...supervisorRoles];

    updatedRoles[index] = {
      ...updatedRoles[index],
      reporting_role_uid: value,
    };

    dispatch(setSupervisorRoles(updatedRoles));
  };

  const handleContinue = async () => {
    try {
      setLoading(true);

      await form.validateFields();

      const supervisorRolesData = supervisorRoles;
      const surveyUid = survey_uid ? survey_uid : "168";

      const rolesRes = await dispatch(
        postSupervisorRoles({
          supervisorRolesData: supervisorRolesData,
          surveyUid,
        })
      );

      if (rolesRes.payload.status === false) {
        message.error(rolesRes.payload.message);
        return;
      } else {
        message.success("Roles updated successfully");
        navigate(`/survey-information/location/add/${survey_uid}`);
      }

      // Save successful, navigate to the next step
    } catch (error) {
      message.error("Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSupervisorRoles();
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <div style={{ width: "100%" }}>
          <MainWrapper style={{ minHeight: "75vh" }}>
            <DescriptionWrap>
              <DescriptionTitle>
                Field supervisors: Define role hierarchy
              </DescriptionTitle>
              <DescriptionText>
                Please map the hierarchy among roles. For each role defined in
                the previous step, select the corresponding reporting role. If
                there is no reporting role, please select ‘No reporting role’.
              </DescriptionText>
            </DescriptionWrap>

            <DynamicItemsForm form={form}>
              {renderReportingRolesField()}
            </DynamicItemsForm>
          </MainWrapper>
          <FooterWrapper>
            <SaveButton>Save</SaveButton>
            <ContinueButton loading={loading} onClick={handleContinue}>
              Continue
            </ContinueButton>
          </FooterWrapper>
        </div>
      )}
    </>
  );
}

export default FieldSupervisorRolesHierarchy;
