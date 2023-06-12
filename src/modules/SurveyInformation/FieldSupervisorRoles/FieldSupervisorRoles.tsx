import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  MainWrapper,
} from "../../../shared/Nav.styled";

import { Form, Input, Select } from "antd";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../../shared/FooterBar.styled";
import SideMenu from "../SideMenu";

import { FileAddOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
  StyledFormItem,
  StyledTooltip,
} from "../../NewSurveyConfig/BasicInformation/BasicInformationForm.styled";
import { useNavigate } from "react-router-dom";
import {
  QuestionsForm,
  QuestionsFormTitle,
} from "../SurveyCTOQuestions/SurveyCTOQuestions.styled";
import {
  DescriptionWrap,
  DescriptionTitle,
  DescriptionText,
} from "../SurveyInformation.styled";
import { RolesForm } from "./FildSupervisorRoles.styled";

function FieldSupervisorRoles() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink href="#" onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title> TSDPS </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <MainWrapper>
          <DescriptionWrap>
            <DescriptionTitle>
              Field Supervisor Roles: Add Roles
            </DescriptionTitle>

            <DescriptionText>
              Please create the field supervisor roles for your survey. Examples
              of roles: core team, regional coordinator, cluster coordinator.
            </DescriptionText>
          </DescriptionWrap>

          <RolesForm>
            <StyledFormItem
              required
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 11 }}
              name="surveyStatus"
              label={<span>Role 1</span>}
            >
              <Input placeholder="Enter role name" style={{ width: "100%" }} />
            </StyledFormItem>

            <span>
              <FileAddOutlined />
              <a style={{ float: "right" }}>Add another role</a>
            </span>
          </RolesForm>
        </MainWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default FieldSupervisorRoles;
