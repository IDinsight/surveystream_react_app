import { useParams } from "react-router-dom";
import Users from "./ManageSurveyUsers";
import UsersAdd from "./AddSurveyUsers";
import EditUser from "./EditSurveyUsers";

function SurveyUsers() {
  const { path } = useParams();

  return (
    <>
      {path === "add" ? (
        <UsersAdd />
      ) : path === "edit" ? (
        <EditUser />
      ) : (
        <Users />
      )}
    </>
  );
}

export default SurveyUsers;
