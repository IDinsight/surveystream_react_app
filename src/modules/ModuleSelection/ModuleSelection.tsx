import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../shared/Nav.styled";
import SideMenu from "./SideMenu";
import { Form } from "antd";
import ModuleSelectionForm from "./ModuleSelectionForm";

import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { GlobalStyle } from "../../shared/Global.styled";
import HandleBackButton from "../../components/HandleBackButton";

function ModuleSelection() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

  return (
    <>
      <GlobalStyle />

      <NavWrapper>
        <HandleBackButton surveyPage={true}></HandleBackButton>
        <Title>
          {(() => {
            const activeSurveyData = localStorage.getItem("activeSurvey");
            return (
              activeSurvey?.survey_name ||
              (activeSurveyData && JSON.parse(activeSurveyData).survey_name) ||
              ""
            );
          })()}
        </Title>
      </NavWrapper>
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
