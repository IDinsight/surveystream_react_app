import Header from "../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../shared/Nav.styled";
import SideMenu from "./SideMenu";
import { Form } from "antd";
import ModuleSelectionForm from "./ModuleSelectionForm";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";

function ModuleSelection() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );

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
