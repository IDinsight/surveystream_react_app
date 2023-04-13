import Header from "../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  MainWrapper,
} from "./NewSurveyConfig.styled";
import SideMenu from "./SideMenu";
import BasicInformationForm from "./BasicInformation/BasicInformationForm";
import { Form } from "antd";
import FooterBar from "./FooterBar";

function NewSurveyConfig() {
  const [form] = Form.useForm();

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink href="#">
          <BackArrow />
        </BackLink>
        <Title>New survey config</Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <MainWrapper>
          <BasicInformationForm form={form} />
        </MainWrapper>
      </div>
      <FooterBar />
    </>
  );
}

export default NewSurveyConfig;
