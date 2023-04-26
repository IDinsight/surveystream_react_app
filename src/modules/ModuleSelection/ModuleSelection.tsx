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
import FooterBar from "./FooterBar";
import ModuleSelectionForm from "./ModuleSelectionForm";

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
      <FooterBar />
    </>
  );
}

export default ModuleSelection;
