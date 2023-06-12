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

function FieldSupervisorRoles() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back one step in the history stack
  };

  const { path } = useParams();

  return (
    <>
      <Header />
      <NavWrapper>
        <BackLink href="#" onClick={handleGoBack}>
          <BackArrow />
        </BackLink>
        <Title>TSDPS</Title>
      </NavWrapper>
      <div
        style={{
          float: "left",
          display: "inline-block",
        }}
      >
        <SideMenu />
      </div>

      {path === "hierarchy" ? (
        <FieldSupervisorRolesHierarchy />
      ) : (
        <FieldSupervisorRolesAdd />
      )}
    </>
  );
}

export default FieldSupervisorRoles;
