import { useParams } from "react-router-dom";
import Roles from "./SurveyRoles";
import RolesAdd from "./AddSurveyRoles";
import Users from "./SurveyUsers";
import UsersAdd from "./AddSurveyUsers";
import EditUser from "./EditSurveyUsers";
import EditRoles from "./EditSurveyRoles";

function UserRoles() {
  const { path } = useParams();

  return (
    <>
      {path === "add-user" ? (
        <UsersAdd />
      ) : path === "edit-user" ? (
        <EditUser />
      ) : path === "users" ? (
        <Users />
      ) : path === "add-role" ? (
        <RolesAdd />
      ) : path === "edit-role" ? (
        <EditRoles />
      ) : (
        <Roles />
      )}
    </>
  );
}

export default UserRoles;
