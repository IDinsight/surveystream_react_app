import Header from "../../../components/Header";
import {
  NavWrapper,
  BackLink,
  BackArrow,
  Title,
} from "../../../shared/Nav.styled";
import SideMenu from "../SideMenu";
import { useNavigate, useParams } from "react-router-dom";
import FieldSupervisorRolesAdd from "./FieldSupervisorRolesAdd";
import FieldSupervisorRolesHierarchy from "./FieldSupervisorRolesHierarchy";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";

function FieldSupervisorRoles() {
  const navigate = useNavigate();
  const activeSurvey = useAppSelector(
    (state: RootState) => state.surveys.activeSurvey
  );
  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const { path } = useParams();

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
      <div style={{ display: "flex" }}>
        <SideMenu />
        {path === "hierarchy" ? (
          <FieldSupervisorRolesHierarchy />
        ) : (
          <FieldSupervisorRolesAdd />
        )}
      </div>
    </>
  );
}

export default FieldSupervisorRoles;
