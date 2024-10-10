import { useParams } from "react-router-dom";
import Roles from "./ManageSurveyRoles";
import RolesAdd from "../SurveyRoles/AddSurveyRoles";
import EditRoles from "../SurveyRoles/EditSurveyRoles";
import DuplicateRoles from "../SurveyRoles/DuplicateSurveyRoles";
import SurveyRoleHierarchy from "../SurveyRoles/SurveyRoleHierarchy";

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
      ) : path === "hierarchy" ? (
        <SurveyRoleHierarchy />
      ) : (
        <Roles />
      )}
    </>
  );
}

export default SurveyRoles;
