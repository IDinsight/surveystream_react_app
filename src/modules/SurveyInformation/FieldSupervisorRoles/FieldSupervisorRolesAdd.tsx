import { MainWrapper } from "../../../shared/Nav.styled";
import { Button, Form, Input, message } from "antd";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import { FileAddOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  DescriptionWrap,
  DescriptionTitle,
  DescriptionText,
  StyledFormItem,
  AddAnotherButton,
  DynamicItemsForm,
} from "../SurveyInformation.styled";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { setSupervisorRoles } from "../../../redux/fieldSupervisorRoles/fieldSupervisorRolesSlice";
import {
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../redux/fieldSupervisorRoles/fieldSupervisorRolesActions";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../../components/Loaders/FullScreenLoader";

function FieldSupervisorRolesAdd() {
  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };
  const [loading, setLoading] = useState(false);

  const supervisorRoles = useAppSelector(
    (state: RootState) => state.reducer.filedSupervisorRoles.supervisorRoles
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.reducer.filedSupervisorRoles.loading
  );

  const [numRoleFields, setNumRoleFields] = useState(
    supervisorRoles.length !== 0 ? supervisorRoles.length : 1
  );

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const fetchSupervisorRoles = async () => {
    const res = await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));
    setNumRoleFields(res.payload.length === 0 ? 1 : res.payload.length);
    if (res.payload.length > 0) {
      form.setFieldValue("role_0", res.payload[0].role_name);
    }
  };

  const handleFormValuesChange = async () => {
    const formValues = form.getFieldsValue();

    const filteredRoles = Object.keys(formValues).reduce(
      (role: any[], fieldName: string) => {
        const fieldValue = formValues[fieldName];

        if (fieldValue !== undefined && fieldValue !== "") {
          role.push({ role_name: fieldValue });
        }

        return role;
      },
      []
    );
    dispatch(setSupervisorRoles(filteredRoles));
  };

  const renderRolesField = () => {
    const fields = Array.from({ length: numRoleFields }, (_, index) => {
      const role: { role_name?: string; reporting_role_uid?: string } =
        numRoleFields === 1 ? {} : supervisorRoles[index];

      return (
        <StyledFormItem
          key={index}
          required
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 11 }}
          name={`role_${index}`}
          label={<span>Role {index + 1}</span>}
          initialValue={role?.role_name ? role.role_name : ""}
          rules={[
            {
              required: true,
              message: "Please enter a role name",
            },
            {
              validator: (_: any, value: any) => {
                if (
                  value &&
                  Object.values(supervisorRoles).filter(
                    (r: {
                      role_name: any;
                      reporting_role_uid?: string | undefined;
                    }) => r.role_name === value
                  ).length > 1
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
    return form.validateFields().then(() => {
      setNumRoleFields(numRoleFields + 1);
    });
  };
  const handleContinue = async () => {
    try {
      const formValues = form.getFieldsValue();
      const filteredRoles = Object.keys(formValues).reduce(
        (role: any[], fieldName: string) => {
          const fieldValue = formValues[fieldName];

          if (fieldValue !== undefined && fieldValue !== "") {
            role.push({ role_name: fieldValue });
          }

          return role;
        },
        []
      );

      if (filteredRoles.length === 0) {
        message.error("Please fill in at least one role name!");
      } else {
        dispatch(setSupervisorRoles(filteredRoles));
      }

      setLoading(true);

      const supervisorRolesData = filteredRoles;
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
  useEffect(() => {
    fetchSupervisorRoles();
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <MainWrapper
          style={{
            width: "74.5%",
            height: "75vh",
            float: "right",
            display: "inline-block",
          }}
        >
          <DescriptionWrap>
            <DescriptionTitle>
              Field Supervisor Roles: Add Roles
            </DescriptionTitle>
            <DescriptionText>
              Please create the field supervisor roles for your survey. Examples
              of roles: core team, regional coordinator, cluster coordinator.
            </DescriptionText>
          </DescriptionWrap>
          <DynamicItemsForm form={form} onValuesChange={handleFormValuesChange}>
            {renderRolesField()}
            <StyledFormItem labelCol={{ span: 5 }} wrapperCol={{ span: 11 }}>
              <AddAnotherButton
                onClick={handleAddRole}
                type="dashed"
                style={{ width: "100%" }}
              >
                <FileAddOutlined /> Add another role
              </AddAnotherButton>
            </StyledFormItem>
          </DynamicItemsForm>
        </MainWrapper>
      )}
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
