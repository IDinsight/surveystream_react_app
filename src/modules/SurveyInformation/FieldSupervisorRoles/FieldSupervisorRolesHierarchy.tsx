import { Form, Select, message } from "antd";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
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
import { setSupervisorRoles } from "../../../redux/surveyInformation/surveyInformationSlice";
import { MainWrapper } from "../../../shared/Nav.styled";
import {
  getSupervisorRoles,
  postSupervisorRoles,
} from "../../../redux/surveyInformation/surveyInformationActions";
import { useEffect, useState } from "react";

function FieldSupervisorRolesHierarchy() {
  const dispatch = useAppDispatch();
  const supervisorRoles = useAppSelector(
    (state: RootState) => state.reducer.surveyInformation.supervisorRoles
  );
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { survey_uid } = useParams<{ survey_uid?: string }>() ?? {
    survey_uid: "",
  };

  const fetchSupervisorRoles = async () => {
    await dispatch(getSupervisorRoles({ survey_uid: survey_uid }));
  };

  useEffect(() => {
    fetchSupervisorRoles();
  }, [dispatch]);

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
          initialValue={role.reporting_role_uid ? role.reporting_role_uid : ""}
          rules={[
            {
              required: true,
              message: "Please select a role!",
            },
            {
              validator: (_, value) => {
                if (value && value === role.role_name) {
                  return Promise.reject("A role cannot report to itself!");
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
            <Select.Option value="No reporting role">
              No reporting role
            </Select.Option>
            {supervisorRoles.map((r, i) => (
              <Select.Option key={i} value={r.reporting_role_uid}>
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

      for (const roleData of supervisorRolesData) {
        const rolesRes = await dispatch(
          postSupervisorRoles({ supervisorRolesData: roleData, surveyUid })
        );

        if (rolesRes.payload.status === false) {
          message.error("Failed to save roles");
          return;
        }
      }
      message.success("Roles updated successfully");

      // Save successful, navigate to the next step
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
          <DescriptionTitle>
            Field supervisors: Define role hierarchy
          </DescriptionTitle>
          <DescriptionText>
            Please map the hierarchy among roles. For each role defined in the
            previous step, select the corresponding reporting role. If there is
            no reporting role, please select ‘No reporting role’.
          </DescriptionText>
        </DescriptionWrap>

        <RolesForm form={form}>{renderReportingRolesField()}</RolesForm>
      </MainWrapper>

      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton loading={loading} onClick={handleContinue}>
          Continue
        </ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default FieldSupervisorRolesHierarchy;
