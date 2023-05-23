import Header from "../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
  MainWrapper,
} from "../../shared/Nav.styled";
import SideMenu from "./SideMenu";
import { Form } from "antd";
import ModuleSelectionForm from "./ModuleSelectionForm";
import {
  FooterWrapper,
  SaveButton,
  ContinueButton,
} from "../../shared/FooterBar.styled";

function ModuleSelection() {
  const [form] = Form.useForm();

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink href="#">
          <BackArrow />
        </BackLink>
        <Title> TSDPS </Title>
      </NavWrapper>
      <div style={{ display: "flex" }}>
        <SideMenu />
        <MainWrapper>
          <ModuleSelectionForm form={form} />
        </MainWrapper>
      </div>
      <FooterWrapper>
        <SaveButton>Save</SaveButton>
        <ContinueButton>Continue</ContinueButton>
      </FooterWrapper>
    </>
  );
}

export default ModuleSelection;
