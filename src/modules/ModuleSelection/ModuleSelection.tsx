import {
  NavWrapper,
  BackLink,
  BackArrow,
  HeaderContainer,
  Title,
} from "../../shared/Nav.styled";
import Container from "../../components/Layout/Container";
import SideMenu from "./SideMenu";
import { Form } from "antd";
import ModuleSelectionForm from "./ModuleSelectionForm";

import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { GlobalStyle } from "../../shared/Global.styled";

function ModuleSelection() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  return (
    <>
      <GlobalStyle />

      <Container surveyPage={true} />
      <HeaderContainer>
        <Title>Feature Selection</Title>
      </HeaderContainer>
      <div
        style={{
          float: "left",
          display: "inline-block",
        }}
      >
        <SideMenu />
      </div>

      <ModuleSelectionForm form={form} />
    </>
  );
}

export default ModuleSelection;
