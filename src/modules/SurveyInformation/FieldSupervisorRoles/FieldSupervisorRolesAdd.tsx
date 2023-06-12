import { MainWrapper } from "../../../shared/Nav.styled";
import { Button, Form, Input, message } from "antd";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import { FileAddOutlined } from "@ant-design/icons";
import { StyledFormItem } from "../../NewSurveyConfig/BasicInformation/BasicInformationForm.styled";
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionWrap,
  DescriptionTitle,
  DescriptionText,
} from "../SurveyInformation.styled";
import { RolesForm } from "./FildSupervisorRoles.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  addSupervisorRole,
  setSupervisorRoles,
} from "../../../redux/surveyInformation/surveyInformationSlice";
import {
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../redux/surveyInformation/surveyInformationActions";
import { useEffect, useState } from "react";

function FieldSupervisorRolesAdd() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const supervisorRoles = useAppSelector(
    (state: RootState) => state.reducer.surveyInformation.supervisorRoles
  );

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchSupervisorRoles = async () => {
    await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));
  };

  useEffect(() => {
    fetchSupervisorRoles();
  }, [dispatch]);

  const renderRolesField = () => {
    const numRoles = supervisorRoles.length;

    const fields = Array.from({ length: numRoles + 1 }, (_, index) => {
      const role: { role_name?: string; reporting_role_uid?: string } =
        index === numRoles ? {} : supervisorRoles[index];

      return (
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 11 }}
          name={`role_${index}`}
          label={<span>Role {index + 1}</span>}
          initialValue={role.role_name ? role.role_name : ""}
          rules={[
            {
              required: true,
              message: "Please enter a role name",
            },
            {
              validator: (_, value) => {
                if (
                  value &&
                  supervisorRoles.some(
                    (r) => r.role_name === value && r !== role
                  )
                ) {
                  return Promise.reject("Please use unique role names!");
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Enter role name" style={{ width: "100%" }} />
        </StyledFormItem>
      );
    });

    return fields;
  };

  const handleAddRole = () => {
    form.validateFields().then(() => {
      const lastRoleIndex = supervisorRoles.length;

      const newRole = form.getFieldValue(`role_${lastRoleIndex}`);

      const isDuplicateRole = supervisorRoles.some(
        (role) => role.role_name === newRole
      );

      if (!isDuplicateRole) {
        const role = {
          role_name: newRole,
        };

        dispatch(addSupervisorRole(role));
      } else {
        message.error("Role already exists!");
      }
    });
  };
  const handleContinue = async () => {
    try {
      const filteredRoles = supervisorRoles.filter((role) => role.role_name);

      if (filteredRoles.length === 0) {
        message.error("Please fill in at least one role name!");
      } else {
        // Update the supervisorRoles state with the filtered roles
        dispatch(setSupervisorRoles(filteredRoles));
      }

      setLoading(true);

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
      }

      navigate(
        `/survey-information/field-supervisor-roles/hierarchy/${survey_uid}`
      );
    } catch (error) {
      message.error("Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainWrapper
        style={{
          width: "74.5%",
          height: "75vh",
          float: "right",
          display: "inline-block",
        }}
      >
        <DescriptionWrap>
          <DescriptionTitle>Field Supervisor Roles: Add Roles</DescriptionTitle>
          <DescriptionText>
            Please create the field supervisor roles for your survey. Examples
            of roles: core team, regional coordinator, cluster coordinator.
          </DescriptionText>
        </DescriptionWrap>
        <RolesForm form={form}>
          {renderRolesField()}
          <StyledFormItem labelCol={{ span: 5 }} wrapperCol={{ span: 11 }}>
            <Button
              onClick={handleAddRole}
              type="dashed"
              style={{ width: "100%" }}
            >
              <FileAddOutlined /> Add another role
            </Button>
          </StyledFormItem>
        </RolesForm>
      </MainWrapper>
      <FooterWrapper style={{ flexBasis: "auto" }}>
        <SaveButton>Save</SaveButton>
        <ContinueButton
          loading={loading}
          onClick={handleContinue}
          disabled={supervisorRoles.length === 0}
        >
          Continue
        </ContinueButton>{" "}
      </FooterWrapper>
    </>
  );
}

export default FieldSupervisorRolesAdd;
