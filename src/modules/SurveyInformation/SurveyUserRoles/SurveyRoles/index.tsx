import { useParams } from "react-router-dom";
import Roles from "./ManageSurveyRoles";
import RolesAdd from "../SurveyRoles/AddSurveyRoles";
import EditRoles from "../SurveyRoles/EditSurveyRoles";

function SurveyRoles() {
  const { path } = useParams();

  return (
    <>
      {path === "add" ? (
        <RolesAdd />
      ) : path === "edit" ? (
        <EditRoles />
      ) : (
        <Roles />
      )}
    </>
  );
}

export default SurveyRoles;
