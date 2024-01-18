import { useParams } from "react-router-dom";
import Roles from "./Roles";
import RolesAdd from "./RolesAdd";
import Users from "./Users";
import UsersAdd from "./UsersAdd";
import EditUser from "./UsersEdit";
import EditRoles from "./RolesEdit";

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
