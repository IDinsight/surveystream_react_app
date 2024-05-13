import { useParams } from "react-router-dom";
import Roles from "./ManageSurveyRoles";
import RolesAdd from "../SurveyRoles/AddSurveyRoles";
import EditRoles from "../SurveyRoles/EditSurveyRoles";
import DuplicateRoles from "../SurveyRoles/DuplicateSurveyRoles";

function SurveyRoles() {
  const { path } = useParams();

  return (
    <>
      {path === "add" ? (
        <RolesAdd />
      ) : path === "edit" ? (
        <EditRoles />
      ) : path === "duplicate" ? (
        <DuplicateRoles />
      ) : (
        <Roles />
      )}
    </>
  );
}

export default SurveyRoles;
