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
import { useNavigate } from "react-router-dom";

function ModuleSelection() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink onClick={handleGoBack}>
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
